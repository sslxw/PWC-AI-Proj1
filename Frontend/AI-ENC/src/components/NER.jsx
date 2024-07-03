import React, { useState } from 'react';
import axios from 'axios';

const NER = ({ text }) => {
    const [entities, setEntities] = useState("");

    const handleNER = async () => {
        const response = await axios.post('http://localhost:8000/ner/', {
            text
        });
        setEntities(response.data.entities);
    };

    return (
        <div>
            <button onClick={handleNER}>Identify Entities</button>
            <textarea value={entities} readOnly rows="5" cols="50" />
        </div>
    );
};

export default NER;