# Performa Invoice System

A web application for generating Performa invoices and quotations with customizable layouts.

## Features

- Create and manage Performa invoices and quotations
- Customizable layouts with dynamic row and column functionality
- Automatic calculation of subtotal, GST, and total amounts
- Display of total amount in words
- Right-aligned numeric columns for better readability
- Google Drive integration for saving generated PDFs
- Responsive design for use on various devices

## Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- React-PDF for PDF generation

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/amitkkna/piq.git
   cd piq
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Google Drive Integration

To use the Google Drive integration feature, you need to set up Google Drive API credentials. Please refer to the [Google Drive Integration Guide](README-GOOGLE-DRIVE.md) for detailed instructions.

## Deployment

This project is configured for deployment on Netlify. The deployment process is automated through GitHub integration.
