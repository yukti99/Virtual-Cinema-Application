import { useState, useEffect, useRef } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import VideoPlayer from "./VideoPlayer";
import VideoCall from "./VideoCall";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { FacebookSelector } from "react-reactions";
import EmojiBubble from "../WatchVideoOn/Emojis/Emoji/EmojiBubble";
import AutoExpire from "../WatchVideoOn/Emojis/AutoExpire";
import { generate } from "short-id";
import "./Watch.scss";
import { postEventMessage, getEvent } from "../../core/apiClient";
import emojis from "./assets/emojis";
import config from "../../config";
import Message from "./Message";
import qs from "qs";

export default function Watch() {
  let navigate = useNavigate();

  const [groupId, setGroupId] = useState();
  const [emojiQueue, setEmojiQueue] = useState([]);
  const userMessageRef = useRef();
  const [data, setData] = useState();

  useEffect(async () => {
    const token = window.localStorage.getItem("jwt");
    if (!token) {
      navigate("../");
    }
    const { eventID } = qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });
    setGroupId(eventID);
    const data = await getEvent(eventID);
    setData(data.data);
  }, []);

  const randomNumber = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const randomPosorNeg = (max, min) => {
    let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    randomNumber *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    return randomNumber;
  };

  const handleEmojiClick = (label, symbol) => {
    setEmojiQueue([
      ...emojiQueue,
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(1000, 0),
        one: randomPosorNeg(500, 50),
        two: randomPosorNeg(500, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(500, 0),
        one: randomPosorNeg(300, 50),
        two: randomPosorNeg(100, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(1000, 0),
        one: randomPosorNeg(500, 50),
        two: randomPosorNeg(500, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(500, 0),
        one: randomPosorNeg(300, 50),
        two: randomPosorNeg(100, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(1000, 0),
        one: randomPosorNeg(500, 50),
        two: randomPosorNeg(500, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(500, 0),
        one: randomPosorNeg(300, 50),
        two: randomPosorNeg(100, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
      {
        label,
        symbol,
        size: randomNumber(3, 2),
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
    ]);
    //key
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMsg = userMessageRef.current.value;
    // code to integrate with backend here
    const body = {
      eventID: groupId,
      messageText: userMsg,
    };
    const data = await postEventMessage(body);
  };

  const reactionHandler = (selected, socket) => {
    const em = emojis.find((item) => item.label === selected);
    socket.emit("reaction", { emoji: em, selected, groupId });
    handleEmojiClick(selected, em.symbol);
  };
  const URL = config.connection.socketHandler;
  const playbackSocket = io(`${URL}/playback`);
  const videoSocket = io(`${URL}/videoCall`);
  playbackSocket.on("reaction-sync", (req) => {
    handleEmojiClick(req.selected, req.emoji.symbol);
  });

  return (
    <>
      <Container
        fluid
        className="watch"
        style={{
          alignItems: "stretch",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <Row>
          <Col sm={8} className="left-section" style={{ padding: 0 }}>
            {data ? (
              <VideoPlayer
                videoURL={data.videoURL}
                playing={true}
                socket={playbackSocket}
                groupId={groupId}
              />
            ) : (
              <h3>Loading...</h3>
            )}

            {emojiQueue.map(({ id, label, symbol, size, left, one, two }) => (
              <AutoExpire key={id}>
                <EmojiBubble
                  label={label}
                  symbol={symbol}
                  size={size}
                  left={left}
                  one={one}
                  two={two}
                />
                w
              </AutoExpire>
            ))}
          </Col>
          <Col sm={4} className="right-section">
            <Row
              style={{
                height: "50vh",
                maxHeight: "50vh",
                overflow: "hidden",
                backgroundColor: "#D8D8D8	",
              }}
            >
              {groupId ? (
                <VideoCall socket={videoSocket} groupID={groupId} />
              ) : (
                <h1>Loading</h1>
              )}
            </Row>
            <Message eventID={groupId} />
            <Row
              style={{
                position: "fixed",
                bottom: "0",
                width: "100%",
                padding: 0,
              }}
            >
              <Col md={"auto"}>
                <FacebookSelector
                  onSelect={(selected) =>
                    reactionHandler(selected, playbackSocket)
                  }
                />
              </Col>
              <Col>
                <Button
                  variant="danger"
                  onClick={() => {
                    navigate("../end-party");
                  }}
                >
                  End Call
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
}