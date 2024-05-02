# PDF to TIFF Converter

## Description

This project offers a solution for converting multiple-page PDF files into single-page TIFF images, catering particularly to logistics companies or any business dealing with numerous invoices and labels requiring submission in TIFF format.

## Features

- Converts multiple-page PDFs to single-page TIFF images.
- Utilizes a RESTful API for easy integration into existing systems.
- Supports uploading multiple PDF files simultaneously.
- Implements conversion using ImageMagick library for PDF to JPEG conversion and Ghostscript for intermediate steps.
- Provides clean and organized code structure for easy maintenance and modification.

## Installation

1. Clone the repository:
    ```bash
    git clone <repository_url>

2. Install dependencies
    ```bash
    npm install

3. Ensure ImageMagick and Ghostscript are installed on your system and their binaries are included in the system PATH.


## Usage

1. Start the server
    ```bash
    npm start

2. Upload PDF files using the /api/v1/upload endpoint. The endpoint accepts a POST request with a multipart form containing PDF files. Files are stored in the /uploads directory.

3. Convert uploaded PDF files to TIFF images using the /api/v1/convert endpoint. The endpoint triggers the conversion process, generating single-page TIFF images in the /convertedTif directory.


## API Endpoints

- **POST /api/v1/upload**:
    - Description: Uploads PDF files for conversion.
    - Request Body: Multipart form data containing PDF files.
    - Response: JSON object with uploaded file details.

- **POST /api/v1/convert**:
    - Description: Converts uploaded PDF files to TIFF images.
    - Response: Success message upon completion.

## Code Structure

- **routes.js**: Defines API routes and middleware.
- **middlewares/upload.middleware.js**: Middleware for handling file uploads using Multer.
- **controllers/upload.controller.js**: Controller for handling file upload requests.
- **controllers/convert.controller.js**: Controller for converting PDF files to TIFF images.


## Dependencies

- Express: Fast, unopinionated, minimalist web framework for Node.js.
- Multer: Middleware for handling multipart/form-data, used for file uploads.
- ImageMagick: Library for image manipulation and conversion.
- fs: File system module for Node.js.
- path: Utility for working with file and directory paths.


## Acknowledgments:

- Special thanks to the authors of ImageMagick and Ghostscript for their powerful libraries.
- Inspired by the needs of logistics companies striving for efficiency in document management.
