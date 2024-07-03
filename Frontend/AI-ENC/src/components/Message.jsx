import React from 'react';

const Message = ({ role, content }) => {
    return (
        <div className={`message ${role}`}>
            <strong>{role === 'assistant' ? 'Bot' : 'You'}:</strong> {content}
        </div>
    );
};

export default Message;
