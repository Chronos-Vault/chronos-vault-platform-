import React, { useState, useRef, useEffect } from 'react';
import { 
  Image, 
  FileVideo, 
  FileText, 
  File, 
  Upload, 
  Check, 
  X, 
  DownloadCloud,
  Paperclip,
  Music,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EnhancedMediaUploaderProps {
  vaultId?: number;
  onUploadComplete?: (attachment: any) => void;
  onAttachmentsChange?: (attachments: any[]) => void;
  maxUploads?: number;
  allowedTypes?: string[];
  initialAttachments?: any[];
  className?: string;
}

const ALLOWED_FILE_TYPES = {
  images: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  documents: ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.md'],
  videos: ['.mp4', '.webm', '.mov', '.avi'],
  audio: ['.mp3', '.wav', '.ogg', '.m4a'],
  other: ['.zip', '.rar', '.7z', '.json', '.csv', '.xlsx']
};

type FileCategory = 'images' | 'documents' | 'videos' | 'audio' | 'other';

export function EnhancedMediaUploader({
  vaultId = -1,
  onUploadComplete,
  onAttachmentsChange,
  maxUploads = 5,
  allowedTypes = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents, ...ALLOWED_FILE_TYPES.videos, ...ALLOWED_FILE_TYPES.audio, ...ALLOWED_FILE_TYPES.other],
  initialAttachments = [],
  className
}: EnhancedMediaUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachments, setAttachments] = useState<any[]>(initialAttachments);
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<string>('');

  useEffect(() => {
    // Update attachments when initialAttachments changes
    if (initialAttachments.length > 0) {
      setAttachments(initialAttachments);
    }
  }, [initialAttachments]);

  // When attachments change, notify parent component
  useEffect(() => {
    if (onAttachmentsChange) {
      onAttachmentsChange(attachments);
    }
  }, [attachments, onAttachmentsChange]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (attachments.length + files.length > maxUploads) {
      toast({
        title: `Maximum ${maxUploads} files allowed`,
        description: `Please remove some files before uploading more.`,
        variant: "destructive",
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      if (!allowedTypes.includes(fileExtension)) {
        toast({
          title: "File type not allowed",
          description: `The file type ${fileExtension} is not allowed.`,
          variant: "destructive",
        });
        continue;
      }
      
      uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const simulateProgress = () => {
      setUploadProgress(prev => Math.min(prev + Math.random() * 10, 90));
    };
    
    const progressInterval = window.setInterval(simulateProgress, 300);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (vaultId && vaultId > 0) {
        formData.append('vaultId', vaultId.toString());
      }
      
      const response = await apiRequest("POST", "/api/attachments", formData);
      
      window.clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Add new attachment to list
      const newAttachment = {
        ...response,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
      };
      
      setAttachments(prev => [...prev, newAttachment]);
      
      if (onUploadComplete) {
        onUploadComplete(newAttachment);
      }
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });
      
      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
      
    } catch (error) {
      window.clearInterval(progressInterval);
      console.error("Upload error:", error);
      
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
      
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const removeAttachment = async (id: number, index: number) => {
    try {
      // If the attachment has an ID (it's been saved to the server), delete it
      if (id) {
        await apiRequest("DELETE", `/api/attachments/${id}`);
      }
      
      // Remove from local state
      setAttachments(prev => prev.filter((_, i) => i !== index));
      
      toast({
        title: "File removed",
        description: "The file has been removed.",
      });
    } catch (error) {
      console.error("Remove error:", error);
      
      toast({
        title: "Error removing file",
        description: "There was an error removing the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    if (!extension) return <File className="h-5 w-5" />;
    
    if (ALLOWED_FILE_TYPES.images.some(type => type.includes(extension))) {
      return <Image className="h-5 w-5" />;
    } else if (ALLOWED_FILE_TYPES.documents.some(type => type.includes(extension))) {
      return <FileText className="h-5 w-5" />;
    } else if (ALLOWED_FILE_TYPES.videos.some(type => type.includes(extension))) {
      return <FileVideo className="h-5 w-5" />;
    } else if (ALLOWED_FILE_TYPES.audio.some(type => type.includes(extension))) {
      return <Music className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };

  const getFileCategory = (fileName: string): FileCategory => {
    const extension = `.${fileName.split('.').pop()?.toLowerCase()}`;
    
    if (ALLOWED_FILE_TYPES.images.includes(extension)) return 'images';
    if (ALLOWED_FILE_TYPES.documents.includes(extension)) return 'documents';
    if (ALLOWED_FILE_TYPES.videos.includes(extension)) return 'videos';
    if (ALLOWED_FILE_TYPES.audio.includes(extension)) return 'audio';
    return 'other';
  };

  const handlePreview = (attachment: any) => {
    const fileName = attachment.fileName;
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // For images, we can create a preview URL
    if (ALLOWED_FILE_TYPES.images.some(type => type.includes(extension))) {
      // If we have a file URL, use it
      if (attachment.fileUrl) {
        setFilePreview(attachment.fileUrl);
        setPreviewType('image');
      } else {
        // Otherwise, indicate no preview available
        toast({
          title: "Preview not available",
          description: "Preview is only available for uploaded files.",
        });
      }
    } else {
      // For non-image files, show a message that preview is not available
      setFilePreview(attachment.fileUrl || null);
      
      if (ALLOWED_FILE_TYPES.documents.some(type => type.includes(extension))) {
        setPreviewType('document');
      } else if (ALLOWED_FILE_TYPES.videos.some(type => type.includes(extension))) {
        setPreviewType('video');
      } else if (ALLOWED_FILE_TYPES.audio.some(type => type.includes(extension))) {
        setPreviewType('audio');
      } else {
        setPreviewType('other');
      }
    }
  };

  const closePreview = () => {
    setFilePreview(null);
    setPreviewType('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredAttachments = attachments.filter(attachment => {
    if (activeTab === 'all') return true;
    
    const fileCategory = getFileCategory(attachment.fileName);
    return fileCategory === activeTab;
  });

  return (
    <div className={className}>
      <Card className="border border-[#6B00D7]/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Paperclip className="h-5 w-5 text-[#6B00D7]" />
            Media Attachments
          </CardTitle>
          <CardDescription>
            Add files, images, videos, and documents to your vault
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="images" className="text-xs">Images</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">Documents</TabsTrigger>
              <TabsTrigger value="videos" className="text-xs">Videos</TabsTrigger>
              <TabsTrigger value="audio" className="text-xs">Audio</TabsTrigger>
            </TabsList>
            
            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Uploading...</span>
                  <span className="text-sm">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <TabsContent value="all" className="space-y-4">
              {/* Drag & drop area */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-[#6B00D7] bg-[#6B00D7]/5' 
                    : 'border-gray-300 hover:border-[#6B00D7]/50'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  multiple
                  accept={allowedTypes.join(',')}
                />
                
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-[#6B00D7]/10 rounded-full">
                    <Upload className="h-6 w-6 text-[#6B00D7]" />
                  </div>
                  <div className="text-sm font-medium">
                    {dragActive ? (
                      <span className="text-[#6B00D7]">Drop files here</span>
                    ) : (
                      <>
                        <span>Drop files here or </span>
                        <span className="text-[#6B00D7] hover:underline cursor-pointer">browse</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Supports images, documents, videos, and audio files
                  </p>
                  <p className="text-xs text-gray-500">
                    Max {maxUploads} files · Up to 10MB each
                  </p>
                </div>
              </div>
              
              {/* File list */}
              {filteredAttachments.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Uploaded Files ({filteredAttachments.length}/{maxUploads})</h4>
                  <ul className="space-y-2">
                    <AnimatePresence>
                      {filteredAttachments.map((attachment, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between p-2 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] group hover:border-[#6B00D7]/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-[#6B00D7]/10 rounded-md">
                              {getFileIcon(attachment.fileName)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-[180px]">
                                {attachment.fileName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatFileSize(attachment.fileSize || 0)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => handlePreview(attachment)}
                                  >
                                    <DownloadCloud className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Preview file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500"
                                    onClick={() => removeAttachment(attachment.id, index)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Remove file</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              ) : (
                <div className="text-center p-4 text-gray-500 text-sm">
                  No files uploaded yet
                </div>
              )}
            </TabsContent>
            
            {/* Content for other tabs - similar structure but filtered by type */}
            <TabsContent value="images" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {filteredAttachments.length > 0 ? (
                  filteredAttachments.map((attachment, index) => (
                    <div 
                      key={index} 
                      className="relative aspect-square rounded-md overflow-hidden border border-[#2A2A2A] hover:border-[#6B00D7]/30 group cursor-pointer"
                      onClick={() => handlePreview(attachment)}
                    >
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                        <DownloadCloud className="h-6 w-6 text-white" />
                      </div>
                      <div className="absolute top-1 right-1 z-20">
                        <Button 
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 bg-black/60 hover:bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAttachment(attachment.id, index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      {attachment.fileUrl ? (
                        <img 
                          src={attachment.fileUrl} 
                          alt={attachment.fileName}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-[#1A1A1A]">
                          <Image className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-xs text-white truncate">
                        {attachment.fileName}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center p-4 text-gray-500 text-sm bg-[#1A1A1A] rounded-md">
                    No images uploaded yet
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              {filteredAttachments.length > 0 ? (
                <ul className="space-y-2">
                  {filteredAttachments.map((attachment, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#6B00D7]/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6B00D7]/10 rounded-md">
                          <FileText className="h-5 w-5 text-[#6B00D7]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{attachment.fileName}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(attachment.fileSize || 0)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handlePreview(attachment)}
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 text-red-500 hover:bg-red-500/10"
                          onClick={() => removeAttachment(attachment.id, index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-gray-500 text-sm bg-[#1A1A1A] rounded-md">
                  No documents uploaded yet
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="space-y-4">
              {filteredAttachments.length > 0 ? (
                <ul className="space-y-3">
                  {filteredAttachments.map((attachment, index) => (
                    <li 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#6B00D7]/30"
                    >
                      <div className="p-2 bg-[#6B00D7]/10 rounded-md">
                        <FileVideo className="h-5 w-5 text-[#6B00D7]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{attachment.fileName}</div>
                            <div className="text-xs text-gray-500 mt-1">{formatFileSize(attachment.fileSize || 0)}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-red-500/10 hover:text-red-500"
                            onClick={() => removeAttachment(attachment.id, index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full text-xs h-7"
                          onClick={() => handlePreview(attachment)}
                        >
                          <FileVideo className="h-3 w-3 mr-1" />
                          Play Video
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-gray-500 text-sm bg-[#1A1A1A] rounded-md">
                  No videos uploaded yet
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="audio" className="space-y-4">
              {filteredAttachments.length > 0 ? (
                <ul className="space-y-3">
                  {filteredAttachments.map((attachment, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between p-3 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#6B00D7]/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#6B00D7]/10 rounded-md">
                          <Music className="h-5 w-5 text-[#6B00D7]" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{attachment.fileName}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(attachment.fileSize || 0)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8"
                          onClick={() => handlePreview(attachment)}
                        >
                          Play
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs h-8 text-red-500 hover:bg-red-500/10"
                          onClick={() => removeAttachment(attachment.id, index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center p-4 text-gray-500 text-sm bg-[#1A1A1A] rounded-md">
                  No audio files uploaded yet
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between pt-0">
          <div className="text-xs text-gray-500">
            {attachments.length}/{maxUploads} attachments
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={attachments.length >= maxUploads || isUploading}
          >
            <Upload className="h-4 w-4 mr-1" />
            Add Files
          </Button>
        </CardFooter>
      </Card>
      
      {/* File preview modal */}
      {filePreview && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-auto bg-[#1A1A1A] rounded-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between p-3 border-b border-[#2A2A2A] bg-[#1A1A1A]">
              <h3 className="font-medium">File Preview</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={closePreview}
                className="h-8 w-8 rounded-full hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-4">
              {previewType === 'image' && (
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="max-w-full h-auto mx-auto rounded-md"
                />
              )}
              {previewType === 'video' && (
                <video 
                  src={filePreview} 
                  controls 
                  className="max-w-full max-h-[70vh] mx-auto rounded-md"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {previewType === 'audio' && (
                <div className="p-6 flex flex-col items-center justify-center">
                  <Music className="h-16 w-16 mb-4 text-[#6B00D7]" />
                  <audio 
                    src={filePreview} 
                    controls 
                    className="w-full"
                  >
                    Your browser does not support the audio tag.
                  </audio>
                </div>
              )}
              {(previewType === 'document' || previewType === 'other') && (
                <div className="p-6 text-center">
                  <div className="p-4 mx-auto mb-4 rounded-full bg-[#6B00D7]/10 w-20 h-20 flex items-center justify-center">
                    {previewType === 'document' ? (
                      <FileText className="h-10 w-10 text-[#6B00D7]" />
                    ) : (
                      <File className="h-10 w-10 text-[#6B00D7]" />
                    )}
                  </div>
                  <h4 className="text-lg font-medium mb-2">Preview not available</h4>
                  <p className="text-gray-400 mb-4">
                    This file type cannot be previewed directly in the browser.
                  </p>
                  <Button 
                    variant="outline"
                    className="mx-auto"
                    asChild
                  >
                    <a 
                      href={filePreview} 
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      <DownloadCloud className="h-4 w-4 mr-2" />
                      Download File
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}