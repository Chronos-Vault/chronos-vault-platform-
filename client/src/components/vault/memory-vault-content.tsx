import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, UploadCloud, X, FileText, Film, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from 'react-hook-form';

interface MemoryVaultContentProps {
  form: any;
  isSubmitting: boolean;
}

export function MemoryVaultContent({ form, isSubmitting }: MemoryVaultContentProps) {
  const [fileUploadStatus, setFileUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string, type: string, size: number, url: string }>>([]);
  const [mediaUploadType, setMediaUploadType] = useState<'photos' | 'videos' | 'documents'>('photos');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setFileUploadStatus('uploading');
    
    // In a real implementation, you would upload these to a server
    // This is a simulated upload for demonstration
    setTimeout(() => {
      const newFiles = Array.from(files).map(file => ({
        name: file.name,
        type: file.type,
        size: file.size,
        // Create object URLs for preview (in real implementation, this would be a server URL)
        url: URL.createObjectURL(file)
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setFileUploadStatus('success');
      
      // Update the form's value with the new files
      const attachments = form.getValues('metadata.attachments') || [];
      form.setValue('metadata.attachments', [...attachments, ...newFiles], { shouldValidate: true });
    }, 1000);
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    
    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(newFiles[index].url);
    
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
    
    // Update the form value
    form.setValue('metadata.attachments', newFiles, { shouldValidate: true });
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <ImageIcon className="w-4 h-4 text-blue-400" />;
    if (type.includes('video')) return <Film className="w-4 h-4 text-purple-400" />;
    return <FileText className="w-4 h-4 text-gray-400" />;
  };

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="border border-gray-800 bg-black/20 shadow-inner mb-6">
      <CardContent className="pt-6">
        <h3 className="text-base font-medium text-white mb-4">Memory Vault Content</h3>
        
        <FormField
          control={form.control}
          name="metadata.memoryTitle"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-sm text-gray-300">Memory Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Title for your memory collection" 
                  {...field} 
                  className="bg-black/30 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="metadata.memoryDescription"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-sm text-gray-300">Memory Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what these memories mean to you or their recipient..." 
                  {...field} 
                  className="bg-black/30 border-gray-700 min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-6 mb-4">
          <FormLabel className="text-sm text-gray-300 block mb-2">Multimedia Content</FormLabel>
          
          <Tabs 
            defaultValue="photos" 
            className="w-full" 
            onValueChange={(v) => setMediaUploadType(v as any)}
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            <div className="border border-dashed border-gray-700 rounded-md p-6 text-center mb-4 hover:border-[#FF5AF7] transition-colors">
              <UploadCloud className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-2">
                Drag and drop your files here, or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                {mediaUploadType === 'photos' && 'JPG, PNG, GIF up to 10MB'}
                {mediaUploadType === 'videos' && 'MP4, MOV up to 50MB'}
                {mediaUploadType === 'documents' && 'PDF, DOC, TXT up to 10MB'}
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept={
                  mediaUploadType === 'photos' ? 'image/*' :
                  mediaUploadType === 'videos' ? 'video/*' : 
                  '.pdf,.doc,.docx,.txt'
                }
                onChange={handleFileChange}
                disabled={fileUploadStatus === 'uploading'}
              />
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={fileUploadStatus === 'uploading'}
                className="bg-black/40"
              >
                {fileUploadStatus === 'uploading' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : 'Select Files'}
              </Button>
            </div>
          </Tabs>
          
          {uploadedFiles.length > 0 && (
            <ScrollArea className="h-60 border border-gray-800 rounded-md bg-black/30 p-2">
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-md bg-black/40 border border-gray-700">
                    <div className="flex items-center space-x-2">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-300 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{getFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                      className="text-gray-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        <FormField
          control={form.control}
          name="metadata.revealMessage"
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel className="text-sm text-gray-300">Reveal Message</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Message to be shown when the vault unlocks..." 
                  {...field} 
                  className="bg-black/30 border-gray-700"
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                This message will be displayed when the memory vault unlocks.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="metadata.showCountdown"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-800 p-3 mt-4">
              <div className="space-y-0.5">
                <FormLabel className="text-sm text-gray-300">Display Countdown</FormLabel>
                <FormDescription className="text-xs text-gray-500">
                  Show a countdown timer for when this memory vault will unlock
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}