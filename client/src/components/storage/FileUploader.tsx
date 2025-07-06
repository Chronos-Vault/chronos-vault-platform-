/**
 * FileUploader component for Chronos Vault
 * 
 * This component provides a user interface for uploading files to
 * permanent Arweave storage via Bundlr.
 */

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Check, AlertTriangle, ArrowUpCircle, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { arweaveStorage } from '@/services/arweave-service';
import type { UploadResult, StorageError } from '../../../shared/types/storage';

// Props for the FileUploader component
interface FileUploaderProps {
  vaultId: number;
  onUploadComplete?: (result: UploadResult) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  showOptions?: boolean;
}

/**
 * FileUploader component for uploading files to permanent storage
 */
export function FileUploader({ 
  vaultId, 
  onUploadComplete, 
  acceptedFileTypes = '*', 
  maxFileSize = 100 * 1024 * 1024, // 100MB default
  showOptions = true 
}: FileUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<StorageError | null>(null);
  
  // Options state
  const [securityLevel, setSecurityLevel] = useState<'standard' | 'enhanced' | 'maximum'>('standard');
  const [encrypt, setEncrypt] = useState(true);
  const [crossChainVerify, setCrossChainVerify] = useState(true);
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Check file size
    if (file.size > maxFileSize) {
      toast({
        title: 'File too large',
        description: `Maximum file size is ${formatFileSize(maxFileSize)}`,
      });
      return;
    }
    
    setSelectedFile(file);
    
    // Create file preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
    
    // Reset upload state
    setUploadProgress(0);
    setUploadResult(null);
    setUploadError(null);
  };
  
  // Handle upload button click
  const handleUpload = async () => {
    if (!selectedFile || !vaultId) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Upload the file with progress tracking
      const result = await arweaveStorage.uploadFile(
        selectedFile,
        vaultId,
        {
          encrypt,
          securityLevel,
          crossChainVerify,
          onProgress: (progress) => {
            setUploadProgress(progress);
          }
        }
      );
      
      setUploadResult(result);
      
      toast({
        title: 'Upload Complete',
        description: 'Your file has been permanently stored',
      });
      
      // Call the callback if provided
      if (onUploadComplete) {
        onUploadComplete(result);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      
      setUploadError(error as StorageError);
      
      toast({
        title: 'Upload Failed',
        description: (error as StorageError)?.message || 'Failed to upload file',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };
  
  // Handle trigger click
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  return (
    <Card className="w-full shadow-lg border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpCircle className="h-5 w-5 text-purple-500" />
          <span>Permanent File Storage</span>
        </CardTitle>
        <CardDescription>
          Upload files to be stored permanently on the Arweave network
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* File selection area */}
        <div 
          className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
          onClick={triggerFileSelect}
        >
          {!selectedFile ? (
            <div className="space-y-3">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Click to select or drag and drop</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Files will be permanently stored and cannot be deleted
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filePreview ? (
                <img 
                  src={filePreview} 
                  alt="Preview" 
                  className="max-h-40 max-w-full mx-auto rounded-md" 
                />
              ) : (
                <File className="h-10 w-10 mx-auto text-purple-500" />
              )}
              <div>
                <p className="text-sm font-medium truncate max-w-xs mx-auto">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatFileSize(selectedFile.size)} - {selectedFile.type || 'Unknown type'}
                </p>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileTypes}
            className="hidden"
          />
        </div>
        
        {/* Security options */}
        {showOptions && selectedFile && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="security-level">Security Level</Label>
              <Select 
                value={securityLevel} 
                onValueChange={(value) => setSecurityLevel(value as 'standard' | 'enhanced' | 'maximum')}
              >
                <SelectTrigger id="security-level">
                  <SelectValue placeholder="Select security level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="enhanced">Enhanced</SelectItem>
                  <SelectItem value="maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="encrypt" 
                checked={encrypt}
                onCheckedChange={(checked) => setEncrypt(checked === true)}
              />
              <Label htmlFor="encrypt" className="cursor-pointer">Encrypt file content</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="verify" 
                checked={crossChainVerify}
                onCheckedChange={(checked) => setCrossChainVerify(checked === true)}
              />
              <Label htmlFor="verify" className="cursor-pointer">Cross-chain verification</Label>
            </div>
          </div>
        )}
        
        {/* Upload progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {/* Upload result */}
        {uploadResult && (
          <Alert variant="default" className="border-green-500/30 bg-green-500/10">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle>Upload Successful</AlertTitle>
            <AlertDescription className="text-xs break-all">
              Transaction ID: {uploadResult.transactionId}
              <br />
              <a 
                href={uploadResult.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-500 hover:underline"
              >
                View on Arweave
              </a>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Upload error */}
        {uploadError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{uploadError.code || 'Error'}</AlertTitle>
            <AlertDescription>
              {uploadError.message}
              {uploadError.recoverable && (
                <div className="mt-2 text-xs">
                  <strong>Suggested action:</strong> {uploadError.suggestedAction}
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : uploadResult ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Uploaded Successfully
            </>
          ) : (
            <>Upload to Permanent Storage</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
