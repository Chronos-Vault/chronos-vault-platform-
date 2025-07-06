import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { File, Image, Trash2, FileText, FileMusic, FileVideo, Lock, Unlock, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { FileUpload } from "./file-upload";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Attachment {
  id: number;
  vaultId: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  description: string | null;
  storageKey: string;
  thumbnailUrl: string | null;
  isEncrypted: boolean;
  uploadedAt: string;
  metadata: any;
}

interface AttachmentListProps {
  vaultId: number;
  className?: string;
}

export function AttachmentList({ vaultId, className }: AttachmentListProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<Attachment | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: attachments = [], isLoading, error } = useQuery({
    queryKey: ['/api/vaults', vaultId, 'attachments'],
    queryFn: async () => {
      const response = await fetch(`/api/vaults/${vaultId}/attachments`);
      if (!response.ok) {
        throw new Error("Failed to fetch attachments");
      }
      return response.json();
    },
    enabled: !!vaultId
  });
  
  const handleUploadComplete = (newAttachment: Attachment) => {
    queryClient.invalidateQueries({ queryKey: ['/api/vaults', vaultId, 'attachments'] });
  };
  
  const handleDeleteAttachment = async (id: number) => {
    if (!confirm("Are you sure you want to delete this attachment?")) return;
    
    try {
      await apiRequest("DELETE", `/api/attachments/${id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/vaults', vaultId, 'attachments'] });
    } catch (err) {
      console.error("Failed to delete attachment:", err);
    }
  };
  
  // Group attachments by file type category
  const groupedAttachments = {
    images: attachments.filter((a: Attachment) => a.fileType.startsWith('image/')),
    documents: attachments.filter((a: Attachment) => 
      a.fileType.includes('pdf') || 
      a.fileType.includes('doc') || 
      a.fileType.includes('text') || 
      a.fileType.includes('sheet')),
    videos: attachments.filter((a: Attachment) => a.fileType.startsWith('video/')),
    audio: attachments.filter((a: Attachment) => a.fileType.startsWith('audio/')),
    other: attachments.filter((a: Attachment) => 
      !a.fileType.startsWith('image/') && 
      !a.fileType.startsWith('video/') && 
      !a.fileType.startsWith('audio/') && 
      !a.fileType.includes('pdf') && 
      !a.fileType.includes('doc') && 
      !a.fileType.includes('text') && 
      !a.fileType.includes('sheet'))
  };
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading attachments...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error loading attachments</div>;
  }
  
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (fileType.startsWith('video/')) return <FileVideo className="h-6 w-6" />;
    if (fileType.startsWith('audio/')) return <FileMusic className="h-6 w-6" />;
    if (fileType.includes('pdf') || fileType.includes('doc') || fileType.includes('text')) {
      return <FileText className="h-6 w-6" />;
    }
    return <File className="h-6 w-6" />;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  // Render the attachment item
  const renderAttachmentItem = (attachment: Attachment) => (
    <Card key={attachment.id} className="overflow-hidden">
      <div className="relative bg-muted aspect-video flex items-center justify-center">
        {attachment.fileType.startsWith('image/') ? (
          // For images, show a thumbnail
          <img
            src={attachment.thumbnailUrl || '/placeholder-image.jpg'}
            alt={attachment.fileName}
            className="w-full h-full object-cover"
          />
        ) : (
          // For non-images, show an icon
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            {getFileIcon(attachment.fileType)}
            <span className="mt-2 text-xs uppercase">{attachment.fileType.split('/')[1]}</span>
          </div>
        )}
        
        {/* Encryption indicator */}
        <div className="absolute top-2 right-2 bg-background/80 p-1 rounded-full">
          {attachment.isEncrypted ? (
            <Lock className="h-4 w-4 text-green-500" />
          ) : (
            <Unlock className="h-4 w-4 text-yellow-500" />
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-sm truncate" title={attachment.fileName}>
          {attachment.fileName}
        </h3>
        
        <div className="mt-1 text-xs text-muted-foreground">
          <p>{formatFileSize(attachment.fileSize)}</p>
          <p>{format(new Date(attachment.uploadedAt), 'MMM d, yyyy')}</p>
        </div>
        
        {attachment.description && (
          <p className="mt-2 text-xs line-clamp-2">{attachment.description}</p>
        )}
      </CardContent>
      
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 mr-1"
          onClick={() => {
            setSelectedAttachment(attachment);
            setPreviewDialogOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 ml-1"
          onClick={() => handleDeleteAttachment(attachment.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className={cn("space-y-6", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vault Attachments</CardTitle>
          <CardDescription>
            Manage media and documents attached to this vault
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <FileUpload 
            vaultId={vaultId} 
            onUploadComplete={handleUploadComplete} 
            className="mb-8"
          />
          
          <Tabs defaultValue="all" className="mt-8">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({attachments.length})</TabsTrigger>
              <TabsTrigger value="images">Images ({groupedAttachments.images.length})</TabsTrigger>
              <TabsTrigger value="documents">Documents ({groupedAttachments.documents.length})</TabsTrigger>
              <TabsTrigger value="videos">Videos ({groupedAttachments.videos.length})</TabsTrigger>
              <TabsTrigger value="audio">Audio ({groupedAttachments.audio.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {attachments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <File className="mx-auto h-12 w-12 mb-3" />
                  <p>No attachments added to this vault yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {attachments.map((attachment: Attachment) => renderAttachmentItem(attachment))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="images">
              {groupedAttachments.images.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Image className="mx-auto h-12 w-12 mb-3" />
                  <p>No images added to this vault yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedAttachments.images.map((attachment: Attachment) => renderAttachmentItem(attachment))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="documents">
              {groupedAttachments.documents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-3" />
                  <p>No documents added to this vault yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedAttachments.documents.map((attachment: Attachment) => renderAttachmentItem(attachment))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos">
              {groupedAttachments.videos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileVideo className="mx-auto h-12 w-12 mb-3" />
                  <p>No videos added to this vault yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedAttachments.videos.map((attachment: Attachment) => renderAttachmentItem(attachment))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="audio">
              {groupedAttachments.audio.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileMusic className="mx-auto h-12 w-12 mb-3" />
                  <p>No audio files added to this vault yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupedAttachments.audio.map((attachment: Attachment) => renderAttachmentItem(attachment))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Attachment Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-3xl">
          {selectedAttachment && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAttachment.fileName}</DialogTitle>
                <DialogDescription>
                  {selectedAttachment.description || 'No description provided'}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                {selectedAttachment.fileType.startsWith('image/') ? (
                  // Image preview
                  <div className="rounded-md overflow-hidden">
                    <img
                      src={selectedAttachment.thumbnailUrl || '/placeholder-image.jpg'}
                      alt={selectedAttachment.fileName}
                      className="w-full h-auto"
                    />
                  </div>
                ) : selectedAttachment.fileType.startsWith('video/') ? (
                  // Video preview (placeholder)
                  <div className="bg-muted rounded-md p-8 text-center">
                    <FileVideo className="mx-auto h-16 w-16 mb-4 text-muted-foreground" />
                    <p>Video preview not available</p>
                  </div>
                ) : selectedAttachment.fileType.startsWith('audio/') ? (
                  // Audio preview (placeholder)
                  <div className="bg-muted rounded-md p-8 text-center">
                    <FileMusic className="mx-auto h-16 w-16 mb-4 text-muted-foreground" />
                    <p>Audio preview not available</p>
                  </div>
                ) : (
                  // Document or other file preview (placeholder)
                  <div className="bg-muted rounded-md p-8 text-center">
                    {getFileIcon(selectedAttachment.fileType)}
                    <p className="mt-4">Preview not available for this file type</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-6">
                <div className="text-sm">
                  <p><span className="font-medium">Type:</span> {selectedAttachment.fileType}</p>
                  <p><span className="font-medium">Size:</span> {formatFileSize(selectedAttachment.fileSize)}</p>
                  <p><span className="font-medium">Uploaded:</span> {format(new Date(selectedAttachment.uploadedAt), 'PPP')}</p>
                  <p><span className="font-medium">Encryption:</span> {selectedAttachment.isEncrypted ? 'Encrypted' : 'Not encrypted'}</p>
                </div>
                
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}