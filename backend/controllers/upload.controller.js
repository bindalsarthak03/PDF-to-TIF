exports.uploadController = async (req, res) => {
    const uploadedFiles = req.file;
    if (!uploadedFiles) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
    }
    res.status(200).json({ uploadedFiles });
};