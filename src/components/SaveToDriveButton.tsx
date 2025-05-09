"use client";

import React, { useEffect, useState } from 'react';
import { 
  initGoogleDriveApi, 
  isSignedIn, 
  signIn, 
  uploadFileToDrive 
} from '../utils/googleDriveService';

interface SaveToDriveButtonProps {
  fileName: string;
  getPdfBlob: () => Promise<Blob>;
  folderName?: string;
}

const SaveToDriveButton: React.FC<SaveToDriveButtonProps> = ({ 
  fileName, 
  getPdfBlob,
  folderName = 'Performa Invoices & Quotations'
}) => {
  const [isApiInitialized, setIsApiInitialized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Google Drive API
    const initApi = async () => {
      try {
        await initGoogleDriveApi();
        setIsApiInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Google Drive API:', error);
      }
    };

    initApi();
  }, []);

  const handleSaveToDrive = async () => {
    try {
      setIsUploading(true);
      setUploadStatus('idle');

      // Check if user is signed in, if not, sign in
      if (!isSignedIn()) {
        await signIn();
      }

      // Get PDF blob
      const pdfBlob = await getPdfBlob();

      // Upload file to Google Drive
      const fileId = await uploadFileToDrive(fileName, pdfBlob, folderName);

      // Set file URL
      setFileUrl(`https://drive.google.com/file/d/${fileId}/view`);
      setUploadStatus('success');
    } catch (error) {
      console.error('Error saving to Google Drive:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleSaveToDrive}
        disabled={!isApiInitialized || isUploading}
        className={`px-4 py-2 rounded-md text-white font-medium ${
          isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isUploading ? 'Saving to Google Drive...' : 'Save to Google Drive'}
      </button>

      {uploadStatus === 'success' && (
        <div className="mt-2 text-green-600">
          Successfully saved to Google Drive!{' '}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View file
            </a>
          )}
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="mt-2 text-red-600">
          Failed to save to Google Drive. Please try again.
        </div>
      )}
    </div>
  );
};

export default SaveToDriveButton;
