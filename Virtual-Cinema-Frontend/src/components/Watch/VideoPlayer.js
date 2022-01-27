import ReactPlayer from "react-player";
import { PropTypes } from "prop-types";
import { useEffect, useRef, useState } from "react";
import PlaybackSocket from "../../core/PlaybackSocketConnectionHandler";

const BUFFERING_DELAY = 0.6;

const VideoPlayer = (props) => {
  const videoPlayer = useRef();
  const [playing, setPlaying] = useState(props.playing);
  const [connectionHandler, setConnectionHandler] = useState(null);
  const [ready, setReady] = useState(false);
  const [inSync, setInSync] = useState(false);

  const seekHandler = (e) => {
    console.log("Seek Handler Triggered", e);
    if (videoPlayer.current.getSecondsLoaded() < e.videoTime)
      videoPlayer.current.seekTo(e.videoTime + BUFFERING_DELAY);
    else videoPlayer.current.seekTo(e.videoTime);
    setInSync(true);
    setPlaying(e.playing);
  };

  useEffect(() => {
    const username = "test";
    const connectionHandler = new PlaybackSocket(
      props.socket,
      props.groupId,
      seekHandler
    );
    connectionHandler.connect(username);
    setConnectionHandler(connectionHandler);
    setReady(true);
  }, []);

  const getState = (playing) => {
    return {
      videoTime: videoPlayer.current.getCurrentTime(),
      videoLoad: videoPlayer.current.getSecondsLoaded(),
      playing,
      timestamp: new Date().getTime(),
    };
  };

  const onPause = () => {
    if (inSync) {
      setInSync(false);
      return;
    }
    setPlaying(false);
    connectionHandler.handleVideoSync(getState(false));
  };

  const onPlay = () => {
    if (inSync) {
      setInSync(false);
      return;
    }
    setPlaying(true);
    connectionHandler.handleVideoSync(getState(true));
  };

  return ready ? (
    <ReactPlayer
      className="react-player"
      playing={playing}
      url={props.videoURL}
      controls={true}
      height={"80vh"}
      width={"100%"}
      onPause={onPause}
      ref={videoPlayer}
      progressInterval={500} // progress report interval
      onPlay={onPlay}
    />
  ) : (
    <h2 style={{ backgroundColor: "black" }}>Loading...</h2>
  );
};

VideoPlayer.propTypes = {
  videoURL: PropTypes.string.isRequired,
  playing: PropTypes.bool,
};

export default VideoPlayer;
