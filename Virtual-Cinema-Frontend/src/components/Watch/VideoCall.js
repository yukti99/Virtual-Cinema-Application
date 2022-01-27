import "bootstrap/dist/css/bootstrap.min.css";

import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import Peer from "simple-peer";

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, []);

  return (
    <Row>
      <video
        playsInline
        autoPlay
        ref={ref}
        height={props.height}
        className="videoLoad"
        width={"100vh"}
      />
    </Row>
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2,
};

const VideoCall = (props) => {
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    socketRef.current = props.socket;
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", props.groupID);
        socketRef.current.on("all users", (users) => {
          const peers = [];
          users.forEach((userID) => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: userID,
              peer,
            });
            peers.push(peer);
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers((users) => [...users, peer]);
        });

        socketRef.current.on("receiving returned signal", (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });
      });
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socketRef.current.emit("returning signal", { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container
      fluid
      style={{
        padding: 0,
        alignItems: "stretch",
        textAlign: "center !important",
        height: "100vh",
        maxHeight: "100vh",
        overflowY: "auto",
      }}
    >
      <Row style={{ padding: 0 }}>
        <video
          muted
          ref={userVideo}
          autoPlay
          height={`${30 / peers.length}%`}
          width={"inherit"}
          playsInline
        />
        {peers.map((peer, index) => {
          if (index > 1) return <></>;
          return (
            <Col>
              <Video key={index} peer={peer} height={`${30 / peers.length}%`} />
            </Col>
          );
        })}
      </Row>
      <Row>
        {peers.map((peer, index) => {
          if (index < 2) return <></>;
          return (
            <Col sm={6} className="video-feed">
              <Video key={index} peer={peer} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default VideoCall;
