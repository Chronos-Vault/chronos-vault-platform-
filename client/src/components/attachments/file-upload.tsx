import { useState, useRef } from "react";
import { Upload, X, FileUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  vaultId: number;
  onUploadComplete: (attachment: any) => void;
  className?: string;
}

export function FileUpload({ vaultId, onUploadComplete, className }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEncrypted, setIsEncrypted] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File is too large. Maximum size is 10MB.");
        return;
      }
      
      setFile(selectedFile);
      setError(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Validate file size
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError("File is too large. Maximum size is 10MB.");
        return;
      }
      
      setFile(droppedFile);
      setError(null);
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const uploadFile = async () => {
    if (!file || !vaultId) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const increment = Math.floor(Math.random() * 10) + 5;
          const newProgress = Math.min(prev + increment, 95);
          return newProgress;
        });
      }, 300);
      
      // Create a FormData object to handle the file upload
      const formData = new FormData();
      formData.append('file', file);
      
      // We're using a mock storage key for now
      // In a real implementation, this would come from the upload response
      const storageKey = `vault-${vaultId}/${Date.now()}-${file.name}`;
      
      // Prepare attachment data
      const attachmentData = {
        vaultId,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        description: description || null,
        storageKey,
        thumbnailUrl: file.type.startsWith('image/') ? storageKey : null,
        isEncrypted,
        metadata: {
          originalName: file.name,
          lastModified: file.lastModified
        }
      };
      
      // Create the attachment record in the database
      const response = await apiRequest('/api/attachments', {
        method: 'POST',
        body: JSON.stringify(attachmentData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Reset the form
      setFile(null);
      setDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Notify parent component about the new attachment
      onUploadComplete(response);
      
      // Delay setting isUploading to false for a smoother UX
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 800);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      setIsUploading(false);
      setUploadProgress(0);
      console.error("File upload error:", err);
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Upload className="mr-2 h-5 w-5" />
          Add Media Attachment
        </CardTitle>
        <CardDescription>
          Upload images, documents, videos, or audio files to your vault
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!file ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="font-medium mb-1">Drag and drop a file here or click to browse</h3>
            <p className="text-sm text-muted-foreground">
              Supports images, documents, videos, and audio files (max 10MB)
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Unknown type"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                id="description"
                placeholder="Add a description for this file..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setFile(null);
            setDescription("");
            setError(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
          disabled={!file || isUploading}
        >
          Cancel
        </Button>
        <Button
          onClick={uploadFile}
          disabled={!file || isUploading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isUploading ? "Uploading..." : "Upload to Vault"}
        </Button>
      </CardFooter>
    </Card>
  );
}