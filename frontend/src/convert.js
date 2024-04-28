import React, { useState } from 'react';
import axios from 'axios';

const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);

      setFile(null);
      alert('File uploaded successfully!');

    } catch (error) {
      console.error('Error uploading file:', error);
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
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      <button onClick={handleConvert}>Convert</button>
    </div>
  );
};

export default UploadComponent;
