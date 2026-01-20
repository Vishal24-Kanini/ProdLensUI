# ZIP File Upload Guide

## Issue Fixed
The ZIP file upload wasn't working because the frontend wasn't parsing ZIP files properly. It was treating them as plain text instead of extracting the JSON files inside.

## Solution Implemented

### Frontend Changes:
1. **fileService.ts** - Updated `parseZipFile()` to:
   - Detect `.zip` vs `.json` files
   - Use JSZip library to extract JSON files from ZIP
   - Look for: `metadata.json`, `blocks.json`, `dependencies.json`, or `config.json`
   - Combine extracted data into AppConfig structure

2. **UploadPage.tsx** - Updated to:
   - Import and use the `parseZipFile()` function
   - Handle both JSON and ZIP file formats

### Required ZIP Structure
Create a ZIP file with the following structure:

```
app-config.zip
├── metadata.json
├── blocks.json
├── dependencies.json
└── (optional: config.json)
```

### File Format Examples

**metadata.json**
```json
{
  "name": "My App Name",
  "description": "App description",
  "version": "1.0.0",
  "author": "Your Name",
  "tags": ["dashboard", "e-commerce"],
  "complexity": "medium",
  "estimatedUsers": 5000,
  "createdAt": "2024-01-20T10:00:00Z"
}
```

**blocks.json**
```json
{
  "layout": {
    "type": "grid",
    "columns": 12
  },
  "components": [
    {
      "id": "header",
      "type": "header"
    },
    {
      "id": "sidebar",
      "type": "sidebar"
    },
    {
      "id": "main",
      "type": "container"
    }
  ]
}
```

**dependencies.json**
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "axios": "^1.4.0",
  "lodash": "^4.17.21",
  "moment": "^2.29.4"
}
```

## How to Test

1. Create the JSON files with the structure above
2. Compress them into a ZIP file
3. Upload using the file upload component
4. The app will extract and parse the files automatically

## Supported Formats
- ✅ Single JSON file with complete config
- ✅ ZIP file with separate JSON files
- ✅ ZIP file with `config.json` (combined config)

## What to Do Next

1. Install JSZip if not already done:
   ```bash
   cd frontend
   npm install jszip @types/jszip
   ```

2. Test the upload with a sample ZIP file

3. (Optional) Add ZIP file download functionality to export analyzed configs as ZIP

## Notes
- The app now gracefully handles missing JSON files within the ZIP
- Only the `name` field is mandatory in metadata
- All other fields are optional and will use defaults if missing
- ZIP extraction is done client-side, so no backend changes needed for ZIP support
