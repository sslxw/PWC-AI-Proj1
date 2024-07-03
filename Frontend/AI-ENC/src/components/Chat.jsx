import React, { useState } from 'react';
import axios from 'axios';
import Message from './Message';
import SummaryOptions from './SummaryOptions';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [documentText, setDocumentText] = useState('');
    const [entities, setEntities] = useState('');
    const [summaryOptions, setSummaryOptions] = useState(null);
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        const response = await axios.post('http://localhost:8001/chat/', {
            history: updatedMessages,
            document_text: documentText,
            entities: entities
        });

        const botMessage = { role: 'assistant', content: response.data.answer };
        setMessages([...updatedMessages, botMessage]);
        setLoading(false);
    };

    const handleUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('http://localhost:8001/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setDocumentText(response.data.text);
        setEntities(response.data.entities);
        setMessages([
            { role: 'system', content: 'NER results: ' + response.data.entities },
            { role: 'system', content: 'Document: ' + response.data.text },
            { role: 'assistant', content: 'Please select the summary length (short, medium, long) and the level of detail.' }
        ]);
    };

    const handleSummaryOptions = async (length, detail) => {
        setSummaryOptions({ length, detail });
        setLoading(true);
        const response = await axios.post('http://localhost:8001/summarize/', {
            text: documentText,
            length: length,
            detail: detail
        });

        const botMessage = { role: 'assistant', content: response.data.summary };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false);
    };

    return (
        <div className="chat-container">
            {!documentText && (
                <div className="file-upload">
                    <input type="file" onChange={handleUpload} />
                </div>
            )}
            {documentText && !summaryOptions && (
                <SummaryOptions onSubmit={handleSummaryOptions} />
            )}
            <div className="chat-messages">
                {messages.map((message, index) => (
                    <Message key={index} role={message.role} content={message.content} />
                ))}
                {loading && (
                    <div className="message assistant typing-indicator">
                        <div className="dot"></div>
                        <div className="dot"></div>
                        <div className="dot"></div>
                    </div>
                )}
            </div>
            <div className="chat-input">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
