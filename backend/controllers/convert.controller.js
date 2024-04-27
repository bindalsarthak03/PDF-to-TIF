const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const Jimp = require('jimp');
exports.convertController = async (req, res) => {
  try {
    const pdfFiles = fs.readdirSync('../backend/uploads').filter(file => path.extname(file) === '.pdf');

    if (pdfFiles.length === 0) {
      return res.status(400).json({ error: 'No PDF files found in the uploads directory' });
    }

    const convertedTiffs = [];

    for (const pdfFile of pdfFiles) {
      const pdfPath = path.join('../backend/uploads', pdfFile);
      
      // Use pdf-image to render each page of the PDF as an image
      const convertProcess = spawn('pdftoppm', [
        '-tiff',
        '-r', '300', // Set resolution (adjust as needed)
        pdfPath,
        path.join('uploads', pdfFile.split('.')[0]) // Output file prefix
      ]);

      await new Promise((resolve, reject) => {
        convertProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`pdftoppm process exited with code ${code}`));
          }
        });
      });

      // Rename and collect TIFF files
      const tiffFiles = fs.readdirSync('../backend/uploads').filter(file => file.startsWith(pdfFile.split('.')[0]));

      for (const tiffFile of tiffFiles) {
        const tiffPath = path.join('uploads', tiffFile);
        const image = await Jimp.read(tiffPath);

        // Save the image as TIFF
        const newTiffPath = tiffPath.replace('.tif', '_converted.tiff');
        await image.writeAsync(newTiffPath);

        convertedTiffs.push(newTiffPath);

        // Delete the temporary TIFF file
        fs.unlinkSync(tiffPath);
      }
    }

    res.json({ convertedTiffs });
  } catch (error) {
    console.error('Error converting PDFs to TIFF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
