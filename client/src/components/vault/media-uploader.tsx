import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, Image, Video, FileText, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Define the types of files that can be uploaded
export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  OTHER = 'other'
}

// File structure returned after upload
export interface UploadedMedia {
  id: string;           // Arweave transaction ID
  name: string;         // Original filename
  type: MediaType;      // Type of media
  size: number;         // File size in bytes
  contentType: string;  // MIME type
  url: string;          // Arweave URL
  thumbnailUrl?: string; // Optional thumbnail for images/videos
  uploadedAt: number;   // Timestamp
}

interface MediaUploaderProps {
  onUploadComplete: (files: UploadedMedia[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  uploadedFiles?: UploadedMedia[];
  className?: string;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes = "image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain",
  maxSizeMB = 50,
  uploadedFiles = [],
  className
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedMedia[]>(uploadedFiles);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle the file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file selection from the file input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  // Process the selected files
  const handleFiles = (fileList: FileList) => {
    if (files.length >= maxFiles) {
      setError(`Maximum of ${maxFiles} files allowed`);
      toast({
        title: "Upload limit reached",
        description: `You can upload a maximum of ${maxFiles} files`,
        variant: "destructive"
      });
      return;
    }

    const filesArray = Array.from(fileList);
    const validFiles = filesArray.filter(file => {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the maximum size of ${maxSizeMB}MB`,
          variant: "destructive"
        });
        return false;
      }
      
      // Check file type
      const fileType = file.type.split('/')[0];
      if (!acceptedFileTypes.includes(fileType) && !acceptedFileTypes.includes('*')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an accepted file type`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      uploadFilesToArweave(validFiles);
    }
  };

  // Determine the media type based on MIME type
  const getMediaType = (mimeType: string): MediaType => {
    if (mimeType.startsWith('image/')) {
      return MediaType.IMAGE;
    } else if (mimeType.startsWith('video/')) {
      return MediaType.VIDEO;
    } else if (
      mimeType === 'application/pdf' || 
      mimeType === 'application/msword' || 
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'text/plain'
    ) {
      return MediaType.DOCUMENT;
    } else {
      return MediaType.OTHER;
    }
  };

  // Get the appropriate icon based on media type
  const getFileIcon = (mediaType: MediaType) => {
    switch (mediaType) {
      case MediaType.IMAGE:
        return <Image className="h-5 w-5" />;
      case MediaType.VIDEO:
        return <Video className="h-5 w-5" />;
      case MediaType.DOCUMENT:
        return <FileText className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(1) + ' KB';
    } else {
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
  };

  // Upload files to Arweave network
  const uploadFilesToArweave = async (filesToUpload: File[]) => {
    setUploading(true);
    setError(null);
    
    try {
      // Simulate file upload with progress
      // In a real implementation, this would use the Bundlr client to upload to Arweave
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        setUploadProgress(Math.min(progress, 95)); // Cap at 95% until complete
        
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 300);
      
      // Simulate upload time based on file count and size
      const totalBytes = filesToUpload.reduce((total, file) => total + file.size, 0);
      const simulatedDelay = Math.min(5000, 1000 + totalBytes / 1000000);
      
      await new Promise(resolve => setTimeout(resolve, simulatedDelay));
      
      // Create mock uploaded files
      const newUploadedFiles: UploadedMedia[] = filesToUpload.map(file => {
        const mediaType = getMediaType(file.type);
        const id = 'ar-' + Math.random().toString(36).substring(2, 15);
        
        return {
          id,
          name: file.name,
          type: mediaType,
          size: file.size,
          contentType: file.type,
          url: `https://arweave.net/${id}`,
          thumbnailUrl: mediaType === MediaType.IMAGE ? URL.createObjectURL(file) : undefined,
          uploadedAt: Date.now()
        };
      });
      
      // Update state with the new files
      setFiles(prevFiles => [...prevFiles, ...newUploadedFiles]);
      onUploadComplete([...files, ...newUploadedFiles]);
      
      // Complete the progress
      setUploadProgress(100);
      
      toast({
        title: "Upload complete",
        description: `${newUploadedFiles.length} file(s) uploaded successfully`,
      });
      
      // Clean up
      clearInterval(interval);
      setTimeout(() => setUploadProgress(0), 1000);
      
    } catch (err: any) {
      setError(`Upload failed: ${err.message || 'Unknown error'}`);
      toast({
        title: "Upload failed",
        description: err.message || "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Remove a file from the list
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onUploadComplete(newFiles);
  };

  // Trigger the file input click
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Permanent storage notice */}
      <Alert className="bg-amber-950/20 border-amber-800/50">
        <AlertCircle className="h-4 w-4 text-amber-500" />
        <AlertTitle className="text-amber-500">Permanent Storage Notice</AlertTitle>
        <AlertDescription className="text-amber-300/80">
          Files uploaded will be permanently stored on the Arweave network and cannot be deleted. 
          Your vault will contain secure references to these decentralized files.
        </AlertDescription>
      </Alert>
      
      {/* File drop area */}
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          dragActive 
            ? "border-[#6B00D7] bg-[#6B00D7]/5" 
            : "border-gray-700 hover:border-gray-500",
          uploading && "opacity-50 cursor-not-allowed"
        )}
        onClick={uploading ? undefined : openFileDialog}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
        onDrop={uploading ? undefined : handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedFileTypes}
          disabled={uploading}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#6B00D7]/20 flex items-center justify-center">
            {uploading ? (
              <Upload className="h-8 w-8 text-[#FF5AF7] animate-pulse" />
            ) : (
              <UploadCloud className="h-8 w-8 text-[#FF5AF7]" />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-medium">
              {uploading ? "Uploading..." : "Drag files here or click to browse"}
            </p>
            <p className="text-sm text-gray-400">
              Upload files, images, videos, and documents to your vault
            </p>
            <p className="text-xs text-gray-500">
              Maximum {maxFiles} files, up to {maxSizeMB}MB each
            </p>
          </div>
        </div>
      </div>
      
      {/* Upload progress */}
      {uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Uploading to Arweave...</span>
            <span className="text-sm text-gray-400">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Preview of uploaded files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Uploaded Files</h3>
            <span className="text-sm text-gray-400">{files.length} of {maxFiles} files</span>
          </div>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={file.id} className="flex items-center justify-between bg-black/40 border border-gray-800 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center">
                    {file.thumbnailUrl ? (
                      <div className="w-10 h-10 rounded overflow-hidden">
                        <img src={file.thumbnailUrl} alt={file.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      getFileIcon(file.type)
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};