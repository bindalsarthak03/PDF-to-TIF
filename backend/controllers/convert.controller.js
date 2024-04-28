const fs = require('fs');
const path = require('path');
const im = require('imagemagick');

exports.convertController = async (req, res) => {
  try {
    const pdfPath = path.join(__dirname, '../uploads/420605499261290278838506295721.pdf');
    const outputFolder = path.join(__dirname, '../convertedTif/');

    // 1. Convert PDF to multi-page TIFF
    const multiPageTiffPath = path.join(outputFolder, 'output.tiff');
    im.convert([
      pdfPath,
      '-density', '100', '-quality', '100', 
      '-resize', '768x512!', '-compress', 'jpeg', 
      multiPageTiffPath
    ], async (err, stdout) => {
      if (err) {
        console.error('Error converting PDF to multi-page TIFF:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // 2. Convert multi-page TIFF to single-page TIFF 
      const singlePageTiffPath = path.join(outputFolder, 'output_combined.tiff');
      im.convert([
        multiPageTiffPath,
        '-gravity', 'center',   // Position pages at center
        '-extent', '0x0',       // Auto-calculate the canvas extent 
        '-append', // Append vertically
        singlePageTiffPath
      ], async (err, stdout) => {
        if (err) {
          console.error('Error combining TIFF pages:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }

        // Remove the original multi-page TIFF (optional)
        fs.unlinkSync(multiPageTiffPath);

        res.status(200).json({ 
          message: 'PDF converted to TIFF successfully', 
          multiPageTiff: multiPageTiffPath, // In case you need it
          singlePageTiff: singlePageTiffPath 
        });
      });
    });
  } catch (error) {
    console.error('Error converting PDF to TIFF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

