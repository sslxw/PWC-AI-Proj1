import React from 'react';

const Message = ({ role, content }) => {
    return (
        <div className={role}>
            <strong>{role}: </strong>{content}
        </div>
    );
};

export default Message;
