import React, { useState } from 'react';
import axios from 'axios';
import Message from './Message';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [documentText, setDocumentText] = useState('');
    const [entities, setEntities] = useState('');

    const sendMessage = async () => {
        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');

        const response = await axios.post('http://localhost:8001/chat/', {
            history: updatedMessages,
            document_text: documentText,
            entities: entities
        });

        const botMessage = { role: 'assistant', content: response.data.answer };
        setMessages([...updatedMessages, botMessage]);
    };

    const uploadFile = async (event) => {
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
            { role: 'system', content: 'Document: ' + response.data.text }
        ]);
    };

    return (
        <div>
            <input type="file" onChange={uploadFile} />
            <div>
                {messages.map((message, index) => (
                    <Message key={index} role={message.role} content={message.content} />
                ))}
            </div>
            <input
                type="text"
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
    );
};

export default Chat;
