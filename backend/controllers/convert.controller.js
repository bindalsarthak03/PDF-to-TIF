// Using imagemagick
const fs = require('fs');
const path = require('path');
const im = require('imagemagick');




exports.convertController = async (req, res) => {
  try {
    const uploadsFolder = path.join(__dirname, '../uploads/');
    const outputFolder = path.join(__dirname, '../convertedTif/');

    fs.readdir(uploadsFolder, (err, files) => {
      if (err) {
        console.error('Error reading uploads folder:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');

      pdfFiles.forEach((pdfFile) => {
        const fileName = path.basename(pdfFile, path.extname(pdfFile));

        // 1. Convert PDF to multi-page TIFF
        const multiPageTiffPath = path.join(outputFolder, `${fileName}.tif`);
        im.convert([
          path.join(uploadsFolder, pdfFile),
          '-compress','LZW', 
          '-density','300',
          '-quality','100',
          '-sharpen', '0x1.0',
          '-extent','0x0',  
          '-append',
           multiPageTiffPath
        ], async (err, stdout) => {
          if (err) {
            console.error(`Error converting ${pdfFile} to multi-page TIFF:`, err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          console.log(`Successfully converted ${pdfFile} to TIFF`);

          // 2. Convert multi-page TIFF to single-page TIFF 
          // const singlePageTiffPath = path.join(outputFolder, `${fileName}_combined.tiff`);
          // im.convert([
          //   multiPageTiffPath,
          //   // '-gravity', 'center', 
          //   // '-extent','0x0',
          //   // '-append',
          //   singlePageTiffPath
          // ], async (err, stdout) => {
          //   if (err) {
          //     console.error(`Error combining ${pdfFile} TIFF pages:`, err);
          //     res.status(500).json({ error: 'Internal Server Error' });
          //     return;
          //   }
          //   fs.unlinkSync(multiPageTiffPath);

          //   console.log(`Successfully converted ${pdfFile} to TIFF`);
          // });
        });
      });

      res.status(200).json({ message: 'PDFs converted to TIFF successfully' });
    });
  } catch (error) {
    console.error('Error converting PDFs to TIFF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
