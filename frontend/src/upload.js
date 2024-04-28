import React, { useState } from 'react';
import axios from 'axios';
import './upload.css'; // Import CSS for styling

const UploadComponent = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('pdfs', files[i]);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/v1/upload', formData);

      console.log('Files uploaded successfully:', response.data);

      // Reset the file input and show an alert
      setFiles([]);
      alert('Files uploaded successfully!');

    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleConvert = async () => {
        try {
          const response = await axios.post('http://localhost:5000/api/v1/convert');
          console.log('Conversion successful:', response.data);
          alert('Conversion successful!');
        } catch (error) {
          console.error('Error converting file:', error);
        }
    setFiles([]);
  };

  return (
    <div className="upload-container">
      <input type="file" name='pdfs' onChange={handleFileChange} multiple />
      <div className="button-container">
        <button className="upload-button" onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button className="convert-button" onClick={handleConvert}>Convert</button>
      </div>
    </div>
  );
};

export default UploadComponent;
