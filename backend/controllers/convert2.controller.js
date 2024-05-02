//Using pdfTron

const { PDFNet } = require('@pdftron/pdfnet-node');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const im = require('imagemagick');
require('dotenv').config();

// Initialize PDFNet
PDFNet.initialize(process.env.API_LICENSE_KEY);

combineTiffs = () =>{
    try {
        const uploadsFolder = path.join(__dirname, '../uploads/');
        const outputFolder = path.join(__dirname, '../convertedTif/');
    
        fs.readdir(uploadsFolder, (err, files) => {
          if (err) {
            console.error('Error reading uploads folder:', err);
            return;
          }
          
          const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
    
          pdfFiles.forEach((pdfFile) => {
            const fileName = path.basename(pdfFile, path.extname(pdfFile));
            const pdfFolderPath = path.join(outputFolder, fileName);
    
            // Check if the folder exists
            if (!fs.existsSync(pdfFolderPath)) {
              console.error(`Folder ${pdfFolderPath} does not exist.`);
              return;
            }
    
            // 1. Combine TIFF files within the folder into a single multi-page TIFF
            const multiPageTiffPath = path.join(outputFolder, `${fileName}.tif`);
            im.convert([
              path.join(pdfFolderPath, '*.tif'),
              '-compress','LZW', 
              '-density','300',
              '-quality','100',
              '-sharpen', '0x1.0',
              '-extent','0x0',  
              '-append',
               multiPageTiffPath
            ], async (err, stdout) => {
              if (err) {
                console.error(`Error combining TIFF files for ${pdfFile}:`, err);
                return;
              }
              console.log(`Successfully combined TIFF files for ${pdfFile}`);
    
              // 2. Delete the folder containing the individual TIFF files
              fs.rmdirSync(pdfFolderPath, { recursive: true });
              console.log(`Folder ${pdfFolderPath} deleted.`);
    
              console.log(`Successfully converted ${pdfFile} to multi-page TIFF`);
            });
          });
    
        });
      } catch (error) {
        console.error('Error converting PDFs to TIFF:', error);
      }
  }

exports.convertController2 = async (req, res) => {
    try {
        const inputFolder = path.join(__dirname, '../uploads/');
        const outputFolder = path.join(__dirname, '../convertedTif/');

        const pdfFiles = fs.readdirSync(inputFolder).filter(file => file.endsWith('.pdf'));

        for (const pdfFile of pdfFiles) {
            //converet code
            const pdfFilePath = path.join(inputFolder, pdfFile);
            const outputFileName = path.parse(pdfFile).name; 
            const outputFolderPath = path.join(outputFolder, outputFileName);

            if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath);
            }

            const doc = await PDFNet.PDFDoc.createFromFilePath(pdfFilePath);

            const pdfDraw = await PDFNet.PDFDraw.create();
            pdfDraw.setDPI(400);
            const pageCount = await doc.getPageCount();
            for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
                const page = await doc.getPage(pageNum);
                await pdfDraw.export(page, `${outputFolderPath}/page_${pageNum}.tif`, 'TIFF');
            }

            //combine code:
        }
        combineTiffs();
        res.send('Conversion complete.');
    } catch (error) {
        console.error('Error converting PDFs to TIFF:', error);
        res.status(500).send('Error converting PDFs to TIFF.');
    }
};
