import React from 'react';
import { UploadedMedia, MediaType } from '@/components/vault/media-uploader';
import { File, FileImage, FileText, FileVideo, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MediaAttachmentsPreviewProps {
  mediaAttachments: UploadedMedia[];
  onRemove?: (media: UploadedMedia) => void;
  className?: string;
  showRemove?: boolean;
  maxHeight?: string;
}

/**
 * A component that displays a preview of uploaded media attachments
 */
export const MediaAttachmentsPreview: React.FC<MediaAttachmentsPreviewProps> = ({
  mediaAttachments,
  onRemove,
  className = '',
  showRemove = true,
  maxHeight = '300px'
}) => {
  if (mediaAttachments.length === 0) {
    return null;
  }

  const getMediaIcon = (mediaType: MediaType) => {
    switch (mediaType) {
      case MediaType.IMAGE:
        return <FileImage className="h-5 w-5 text-blue-400" />;
      case MediaType.VIDEO:
        return <FileVideo className="h-5 w-5 text-red-400" />;
      case MediaType.DOCUMENT:
        return <FileText className="h-5 w-5 text-yellow-400" />;
      default:
        return <File className="h-5 w-5 text-gray-400" />;
    }
  };

  const getMediaThumbnail = (media: UploadedMedia) => {
    if (media.thumbnailUrl && media.type === MediaType.IMAGE) {
      return (
        <div className="relative w-full aspect-square bg-black rounded-md overflow-hidden">
          <img 
            src={media.thumbnailUrl} 
            alt={media.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center w-full aspect-square bg-gray-900/50 rounded-md p-4">
        <div className="p-3 bg-gray-800 rounded-full mb-2">
          {getMediaIcon(media.type)}
        </div>
        <span className="text-xs text-gray-400 text-center truncate w-full">
          {media.name}
        </span>
      </div>
    );
  };

  return (
    <div className={`${className}`}>
      <h3 className="text-sm font-medium text-gray-200 mb-2">Media Attachments ({mediaAttachments.length})</h3>
      
      <div className={`overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3`} style={{ maxHeight }}>
        {mediaAttachments.map((media) => (
          <div key={media.id} className="relative group bg-gray-800/50 border border-gray-700 rounded-lg p-2">
            {showRemove && onRemove && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => onRemove(media)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
            
            {getMediaThumbnail(media)}
            
            <div className="mt-2 px-1">
              <div className="flex items-center gap-1">
                {getMediaIcon(media.type)}
                <span className="text-xs font-medium text-gray-300 truncate">
                  {media.name.length > 18 ? `${media.name.substring(0, 15)}...` : media.name}
                </span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {(media.size / (1024 * 1024)).toFixed(1)} MB
                </span>
                <span className="text-xs text-[#FF5AF7]">
                  Arweave
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaAttachmentsPreview;