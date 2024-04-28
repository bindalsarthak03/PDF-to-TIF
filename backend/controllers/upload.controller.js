exports.uploadController = async (req, res) => {
    const uploadedFiles = req.files; // Use req.files to access multiple files
    if (!uploadedFiles || uploadedFiles.length === 0) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
    }
    res.status(200).json({ uploadedFiles });
};
