import React, { useCallback, useState, useRef, DragEvent, ChangeEvent } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete: ({ url, mimeType }: { url: string; mimeType: string }) => void;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  className?: string;
  disabled?: boolean;
}

interface UploadFile {
  file: File;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  path?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  accept = "image/*,video/mp4,video/webm,video/quicktime",
  maxSize = 50 * 1024 * 1024, // 50MB
  maxFiles = 1,
  className,
  disabled = false
}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${Math.round(maxSize / (1024 * 1024))}MB)`;
    }

    // Check file type using MIME type for more reliable detection
    const allowedTypes = [
      // Image types
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Video types
      'video/mp4', 'video/webm', 'video/quicktime'
    ];

    if (!allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported. Allowed types: Images (JPEG, PNG, GIF, WebP) and Videos (MP4, WebM, MOV)`;
    }

    return null; // File is valid
  };

  const getMediaTypeFromMimeType = (mimeType: string): string => {
    if (mimeType.startsWith('video/')) {
      return 'video';
    }
    return 'image'; // Default to image for all other types
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Validate file before upload
    const validationError = validateFile(file);
    if (validationError) {
      throw new Error(validationError);
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'unknown';
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `gallery-${Date.now()}-${sanitizedName}`;
    const filePath = `uploaded/${fileName}`;

    const { error } = await supabase.storage
      .from('gallery')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      // Handle specific Supabase storage errors
      if (error.message.includes('Bucket not found')) {
        throw new Error('Storage bucket not configured. Please contact administrator.');
      }
      if (error.message.includes('The resource already exists')) {
        throw new Error('A file with this name already exists. Please try again.');
      }
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data } = supabase.storage
      .from('gallery')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const processFiles = useCallback(async (files: File[]) => {
    if (disabled || files.length === 0) return;

    // Limit files to maxFiles
    const filesToProcess = files.slice(0, maxFiles);

    const newFiles: UploadFile[] = filesToProcess.map(file => ({
      file,
      status: 'uploading' as const
    }));

    setUploadFiles(newFiles);

    for (let i = 0; i < newFiles.length; i++) {
      const fileUpload = newFiles[i];
      
      try {
        const filePath = await uploadFile(fileUpload.file);

        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i 
            ? { ...f, status: 'success' as const, path: filePath }
            : f
        ));

        onUploadComplete({ url: filePath, mimeType: fileUpload.file.type });

      } catch (error) {
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i 
            ? { 
                ...f, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Upload failed'
              }
            : f
        ));
      }
    }
  }, [disabled, maxFiles, onUploadComplete]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    processFiles(files);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    // Only set drag inactive if we're leaving the dropzone completely
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    
    if (!disabled) {
      const files = Array.from(event.dataTransfer.files);
      processFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getSupportedTypesText = () => {
    return "Images (JPEG, PNG, GIF, WebP) and Videos (MP4, WebM, MOV)";
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-6">
          <div
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={maxFiles > 1}
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
              data-testid="file-upload-input"
            />
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {isDragActive ? "Drop files here" : "Upload files"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: {getSupportedTypesText()}
              <br />
              Max size: {Math.round(maxSize / (1024 * 1024))}MB per file
            </p>
          </div>
        </CardContent>
      </Card>

      {uploadFiles.length > 0 && (
        <div className="space-y-2">
          {uploadFiles.map((fileUpload, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {getStatusIcon(fileUpload.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {fileUpload.file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(fileUpload.file.size / (1024 * 1024)).toFixed(2)} MB • {getMediaTypeFromMimeType(fileUpload.file.type)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    data-testid={`remove-file-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {fileUpload.status === 'uploading' && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploading...
                    </p>
                  </div>
                )}

                {fileUpload.status === 'error' && fileUpload.error && (
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {fileUpload.error}
                    </AlertDescription>
                  </Alert>
                )}

                {fileUpload.status === 'success' && (
                  <Alert className="mt-2">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Upload completed successfully
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};