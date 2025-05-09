@echo off
echo Installing dependencies...
call npm install

echo Building the Next.js app...
call npm run build

echo Copying public files to output directory...
xcopy /E /Y public\* .next\

echo Build completed successfully! Ready for Netlify deployment.
