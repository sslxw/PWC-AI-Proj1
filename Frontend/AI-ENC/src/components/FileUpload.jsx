import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ setText }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('http://localhost:8000/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        setText(response.data.text);
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default FileUpload;