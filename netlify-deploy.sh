#!/bin/bash

# Install dependencies
npm install

# Build the Next.js app
npm run build

# Copy the _redirects file to the output directory
cp -r public/* .next/

# Success message
echo "Build completed successfully! Ready for Netlify deployment."
