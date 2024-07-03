import React, { useState } from 'react';

const SummaryOptions = ({ onSubmit }) => {
    const [length, setLength] = useState('');
    const [detail, setDetail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(length, detail);
    };

    return (
        <form onSubmit={handleSubmit} className="summary-options">
            <label>
                Summary Length:
                <select value={length} onChange={(e) => setLength(e.target.value)} required>
                    <option value="">Select length</option>
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                </select>
            </label>
            <label>
                Level of Detail:
                <select value={detail} onChange={(e) => setDetail(e.target.value)} required>
                    <option value="">Select detail</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default SummaryOptions;
