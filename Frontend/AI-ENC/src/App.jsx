import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import Summarization from './components/Summarization';
import Chatbot from './components/Chatbot';
import NER from './components/NER';

function App() {
    const [text, setText] = useState("");

    return (
        <div className="App">
            <h1>Document Summarization</h1>
            <FileUpload setText={setText} />
            <h2>Extracted Text</h2>
            <textarea value={text} readOnly rows="10" cols="50" />
            <h2>Summary</h2>
            <Summarization text={text} />
            <h2>Chatbot</h2>
            <Chatbot text={text} />
            <h2>Named Entity Recognition</h2>
            <NER text={text} />
        </div>
    );
}

export default App;