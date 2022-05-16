import React from "react"

export default function ChatMessage(props) {
    if(props.sent){    
        return(
            <div className="sender-message">
                <span className="sender-message-content">test1</span>
                <small>18 min ago</small>
            </div>
        )
    }else{
        return(
            <div className="user-message">
                <span className="user-message-content">test2</span>
                <small>18 min ago</small>
            </div>
        )
    }
}