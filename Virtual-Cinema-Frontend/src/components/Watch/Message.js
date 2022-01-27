import { Col, Button, Row } from "react-bootstrap";
import { postEventMessage, getMessagesForEvent,  } from "../../core/apiClient";
import { useEffect, useRef, useState } from "react";
import Login from "./ReLogin";

const MessageBox = (props) => {
  return (
    <>
      {props.me ? (
          <div className="my-message-section" >
          <span className="my-message">{props.msg}</span>
        </div>
      ) : (
        <div className="user-message-section">
          <span className="user-letter">{props.user}</span>
          <span className="user-message">{props.msg}</span>
        </div>
      )}
    </>
  );
};

const Message = (props) => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [messages, setMessages] = useState([]);

  const inputRef = useRef();
  const messagesEndRef = useRef();

  useEffect(async () => {
    const data = await getMessagesForEvent(props.eventID);
    setMessages(data.data);
  });

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const sendMessageHandler = async () => {
    const m = inputRef.current.value;    
    if (!m) return;
    const { data } = await postEventMessage({
      messageText: m,
      eventID: props.eventID,
    });
    setMessages([
      ...messages,
      {
        messageID: data.body.MessageId,
        timestamp: data.body.timestamp,
        user: { name: data.body.user.name },
        message: data.body.message,
        me: true,
      },
    ]);    
    reset();
  };

  const reset = () => {
    inputRef.current.value = "";
  };

  const sendMessageHandlerKeyDown = async (e) => {
    if (e.key === 'Enter') {
    const m = inputRef.current.value;
    if (!m) return;
      const { data } = await postEventMessage({
        messageText: m,
        eventID: props.eventID,
      });
      setMessages([
        ...messages,
        {
          messageID: data.body.MessageId,
          timestamp: data.body.timestamp,
          user: { name: data.body.user.name },
          message: data.body.message,
          me: true,
        },
      ]);
      reset();
    }     
  };

  return (
    <>
      <Row
        style={{
          overflowY: "scroll",
          maxHeight: "37vh",
          marginBottom: "10px",
        }}
      >
        {messages.map((x, i) => {
          return (
            <div>
                <MessageBox
                  me={x.me}
                  user={x.user.name[0]}
                  msg={x.message}
                  key={x.messageID}
                  color={x.user.name}
              />
              <div ref={messagesEndRef} />
            </div>            
          );
        })}
      </Row>
      <Row
        style={{
          width: "100%",
          padding: 0,
          height: "100px",
          marginBottom: "5px",
        }}
      >
        <Col>
          <input
            placeholder={"Type your message"}
            ref={inputRef}
            style={{
              padding: "20px",
              borderRadius: "20px",
              width: "100%",
              height: "40px",
              maginTop: "10px",
            }}            
            onChange={(e) =>
              e.target.value
                ? setButtonDisabled(false)
                : setButtonDisabled(true)
            }
            onKeyDown={(e) => sendMessageHandlerKeyDown(e)}
          />
        </Col>
        <Col xs lg="2">
          <Button
            onClick={sendMessageHandler}
            disabled={buttonDisabled}
            style={{ maginTop: "10px" }}
          >
            Send
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Message;