// Google Drive API integration service

// Google API client ID - you'll need to replace this with your actual client ID from Google Cloud Console
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const API_KEY = 'YOUR_GOOGLE_API_KEY';

// Discovery docs and scopes for Google Drive API
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

// Initialize the Google API client
export const initGoogleDriveApi = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Load the Google API client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      window.gapi.load('client:auth2', () => {
        window.gapi.client
          .init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
          .then(() => {
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    };
    script.onerror = () => {
      reject(new Error('Failed to load Google API client library'));
    };
    document.body.appendChild(script);
  });
};

// Check if user is signed in to Google
export const isSignedIn = (): boolean => {
  if (!window.gapi || !window.gapi.auth2) {
    return false;
  }
  return window.gapi.auth2.getAuthInstance().isSignedIn.get();
};

// Sign in to Google
export const signIn = (): Promise<void> => {
  return window.gapi.auth2.getAuthInstance().signIn();
};

// Sign out from Google
export const signOut = (): Promise<void> => {
  return window.gapi.auth2.getAuthInstance().signOut();
};

// Upload a file to Google Drive
export const uploadFileToDrive = async (
  fileName: string,
  fileContent: Blob,
  folderName?: string
): Promise<string> => {
  try {
    // Check if user is signed in
    if (!isSignedIn()) {
      await signIn();
    }

    let folderId = null;

    // If folder name is provided, check if it exists or create it
    if (folderName) {
      folderId = await findOrCreateFolder(folderName);
    }

    // Create file metadata
    const fileMetadata = {
      name: fileName,
      mimeType: 'application/pdf',
      parents: folderId ? [folderId] : undefined,
    };

    // Create a form data object
    const form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' })
    );
    form.append('file', fileContent);

    // Get access token
    const accessToken = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getAuthResponse().access_token;

    // Upload file using fetch API
    const response = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      }
    );

    const data = await response.json();
    
    // Return the file ID
    return data.id;
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error);
    throw error;
  }
};

// Find or create a folder in Google Drive
const findOrCreateFolder = async (folderName: string): Promise<string> => {
  try {
    // Search for the folder
    const response = await window.gapi.client.drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
    });

    const files = response.result.files;
    
    // If folder exists, return its ID
    if (files && files.length > 0) {
      return files[0].id;
    }

    // If folder doesn't exist, create it
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const folder = await window.gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });

    return folder.result.id;
  } catch (error) {
    console.error('Error finding or creating folder:', error);
    throw error;
  }
};

// Declare global window type with gapi
declare global {
  interface Window {
    gapi: any;
  }
}
