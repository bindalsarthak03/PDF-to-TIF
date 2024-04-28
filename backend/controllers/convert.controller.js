const fs = require('fs');
const path = require('path');
const im = require('imagemagick');

exports.convertController = async (req, res) => {
  try {
    const uploadsFolder = path.join(__dirname, '../uploads/');
    const outputFolder = path.join(__dirname, '../convertedTif/');

    // List all files in the uploads folder
    fs.readdir(uploadsFolder, (err, files) => {
      if (err) {
        console.error('Error reading uploads folder:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Filter PDF files
      const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

      // Convert each PDF file
      pdfFiles.forEach((pdfFile) => {
        // Extract the filename without extension
        const fileName = path.basename(pdfFile, path.extname(pdfFile));

        // 1. Convert PDF to multi-page TIFF
        const multiPageTiffPath = path.join(outputFolder, `${fileName}.tiff`);
        im.convert([
          path.join(uploadsFolder, pdfFile),
          '-density', '100', '-quality', '100', 
          '-resize', '768x512!', '-compress', 'jpeg', 
          multiPageTiffPath
        ], async (err, stdout) => {
          if (err) {
            console.error(`Error converting ${pdfFile} to multi-page TIFF:`, err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          // 2. Convert multi-page TIFF to single-page TIFF 
          const singlePageTiffPath = path.join(outputFolder, `${fileName}_combined.tiff`);
          im.convert([
            multiPageTiffPath,
            '-gravity', 'center',   // Position pages at center
            '-extent', '0x0',       // Auto-calculate the canvas extent 
            '-append', // Append vertically
            singlePageTiffPath
          ], async (err, stdout) => {
            if (err) {
              console.error(`Error combining ${pdfFile} TIFF pages:`, err);
              res.status(500).json({ error: 'Internal Server Error' });
              return;
            }

            // Remove the original multi-page TIFF (optional)
            fs.unlinkSync(multiPageTiffPath);

            console.log(`Successfully converted ${pdfFile} to TIFF`);
          });
        });
      });

      res.status(200).json({ message: 'PDFs converted to TIFF successfully' });
    });
  } catch (error) {
    console.error('Error converting PDFs to TIFF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
