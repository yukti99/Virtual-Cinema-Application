import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEvent } from "../core/apiClient";

export default function Test() {
  const [videoLink, setVideoLink] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(async () => {
    const data = await getEvent("testingv5");
    setVideoLink(data.data.videoURL);
    setIsLoading(false);
  }, []);

  useEffect(async () => {
    const data = await getEvent("testingv5");
    setVideoLink(data.data.videoURL);
  }, [videoLink]);

  return (
    <div>
      <h1>Test</h1>

      {isLoading ? (
        <h1>Im loading</h1>
      ) : (
        <h1>Youtube video link is {videoLink}</h1>
      )}
    </div>
  );
}