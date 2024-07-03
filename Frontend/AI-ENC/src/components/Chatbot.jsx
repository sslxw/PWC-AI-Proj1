import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = ({ text }) => {
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState("");

    const handleChat = async () => {
        const response = await axios.post('http://localhost:8000/chat/', {
            document_text: text,
            query
        });
        setAnswer(response.data.answer);
    };

    return (
        <div>
            <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a question..." />
            <button onClick={handleChat}>Ask</button>
            <textarea value={answer} readOnly rows="5" cols="50" />
        </div>
    );
};

export default Chatbot;
