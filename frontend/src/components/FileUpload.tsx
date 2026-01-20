import React, { useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading?: boolean;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, loading, error }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = React.useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-primary/5'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept=".json,.zip,.txt"
          className="hidden"
          disabled={loading}
        />

        <div className="flex justify-center mb-4">
          <div className={`p-3 rounded-full ${isDragActive ? 'bg-primary/20' : 'bg-gray-200'}`}>
            <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-gray-600'}`} />
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {loading ? 'Processing...' : 'Upload App Configuration'}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Drag and drop your app config (JSON/ZIP), or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Supported formats: .json, .zip (with metadata.json, blocks.json, dependencies.json)
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-danger/10 border border-danger/30 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
          <div className="text-sm text-danger">{error}</div>
        </div>
      )}
    </div>
  );
};
