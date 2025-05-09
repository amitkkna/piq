# Google Drive Integration for Performa Invoice System

This document provides instructions on how to set up Google Drive API integration to enable saving PDFs directly to Google Drive.

## Prerequisites

1. A Google account
2. Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page and select "New Project"
3. Enter a name for your project (e.g., "Performa Invoice System")
4. Click "Create"

## Step 2: Enable the Google Drive API

1. In your new project, go to the "APIs & Services" > "Library" section
2. Search for "Google Drive API"
3. Click on "Google Drive API" in the search results
4. Click "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace account)
3. Click "Create"
4. Fill in the required information:
   - App name: "Performa Invoice System"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"
6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add the following scope: `https://www.googleapis.com/auth/drive.file`
8. Click "Save and Continue"
9. Add test users if needed (your Google account email)
10. Click "Save and Continue"
11. Review your settings and click "Back to Dashboard"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "Performa Invoice System Web Client"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain if applicable
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production domain if applicable
7. Click "Create"
8. Note down the Client ID and Client Secret (you'll need the Client ID)

## Step 5: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Note down the API Key
4. Click "Restrict Key" to limit its usage:
   - Select "Google Drive API" from the list of APIs
   - Set application restrictions as needed

## Step 6: Update the Application Code

1. Open the file `src/utils/googleDriveService.ts`
2. Replace the placeholder values with your actual credentials:
   ```typescript
   const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your Client ID
   const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your API Key
   ```

## Step 7: Test the Integration

1. Start your application
2. Create an invoice or quotation
3. Click the "Save to Google Drive" button
4. You'll be prompted to sign in to your Google account and grant permissions
5. After authorization, the PDF should be saved to your Google Drive

## Folder Structure

By default, the application will save files to the following folders in your Google Drive:
- Invoices: "Performa Invoices"
- Quotations: "Performa Quotations"

These folders will be created automatically if they don't exist.

## Troubleshooting

### Common Issues:

1. **Authorization Error**: Make sure your OAuth consent screen is properly configured and you've added yourself as a test user.

2. **API Not Enabled**: Ensure the Google Drive API is enabled for your project.

3. **Invalid Origin**: Check that your application's domain is listed in the authorized JavaScript origins.

4. **Quota Exceeded**: Google APIs have usage quotas. If you exceed them, you may need to request an increase or wait until the quota resets.

### Debugging:

- Check the browser console for error messages
- Verify that your Client ID and API Key are correctly set in the code
- Ensure you're signed in to the correct Google account

## Security Considerations

- Never expose your API Key or Client Secret in client-side code in a production environment
- Consider implementing a server-side proxy for API calls in production
- Restrict your API Key to only the necessary APIs and domains
- Use environment variables to store sensitive credentials

## Additional Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server)
- [Google Cloud Console](https://console.cloud.google.com/)
