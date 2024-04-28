const fs = require('fs');
const path = require('path');
const im = require('imagemagick');

exports.convertController = async (req, res) => {
    try {
        const pdfPath = path.join(__dirname, '../uploads/Resume_SB.pdf'); // Path to the uploaded PDF
        const outputFolder = path.join(__dirname, '../convertedTif/'); // Output folder for TIFF files
        console.log(pdfPath)
        console.log(outputFolder)
        // Convert PDF to PNG
        const pngPath = path.join(outputFolder, 'output.png');
        im.convert([pdfPath, '-density', '100', '-quality', '100', '-resize', '768x512!', '-compress', 'jpeg', pngPath], async (err, stdout) => {
            if (err) {
                console.error('Error converting PDF to PNG:', err);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            // Convert PNG to TIFF
            const tiffPath = path.join(outputFolder, 'output.tiff');
            im.convert([pngPath, tiffPath], async (err, stdout) => {
                if (err) {
                    console.error('Error converting PNG to TIFF:', err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                // Remove PNG file
                fs.unlinkSync(pngPath);

                res.status(200).json({ message: 'PDF converted to TIFF successfully', tiffFile: tiffPath });
            });
        });
    } catch (error) {
        console.error('Error converting PDF to TIFF:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
