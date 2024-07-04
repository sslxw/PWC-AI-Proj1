import React, { useState } from 'react';

const SummaryOptions = ({ onSubmit }) => {
    const [length, setLength] = useState('short');
    const [detail, setDetail] = useState('low');

    const handleSubmit = () => {
        onSubmit(length, detail);
    };

    return (
        <div className="summary-options">
            <label>
                Summary Length:
                <select value={length} onChange={(e) => setLength(e.target.value)}>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                </select>
            </label>
            <label>
                Level of Detail:
                <select value={detail} onChange={(e) => setDetail(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>
            <button onClick={handleSubmit}>Set Options</button>
        </div>
    );
};

export default SummaryOptions;


