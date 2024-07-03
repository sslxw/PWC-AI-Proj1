import React, { useState } from 'react';
import axios from 'axios';

const Summarization = ({ text }) => {
    const [summary, setSummary] = useState("");
    const [length, setLength] = useState("short");

    const handleSummarize = async () => {
        const response = await axios.post('http://localhost:8000/summarize/', {
            text,
            length
        });
        setSummary(response.data.summary);
    };

    return (
        <div>
            <select onChange={(e) => setLength(e.target.value)} value={length}>
                <option value="short">Short</option>
                <option value="medium">Medium</option>
                <option value="long">Long</option>
            </select>
            <button onClick={handleSummarize}>Summarize</button>
            <textarea value={summary} readOnly rows="5" cols="50" />
        </div>
    );
};

export default Summarization;