import React, { useState, useEffect } from "react";
import Emoji from "./Emoji";
import EmojiButton from "./EmojiButton";
import EmojiBubble from "./EmojiBubble";
import EmojiBoardWrapper from "./EmojiBoardWrapper";
import loading from "../../loading.gif";
import { generate } from "short-id";
import AutoExpire from "../AutoExpire";

const EmojiBoard = () => {
  const emojis = [
    {
      id: 0,
      label: "Thumbs Up",
      symbol: "👍",
    },
    {
      id: 1,
      label: "Mind Blown",
      symbol: "⛴ ",
    },
    {
      id: 2,
      label: "Touche",
      symbol: "✌",
    },
    {
      id: 3,
      label: "react",
      symbol: "⚛",
    },
    {
      id: 4,
      label: "shyt",
      symbol: "💩",
    },
  ];

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
        left: randomNumber(100, 0),
        one: randomPosorNeg(200, 50),
        two: randomPosorNeg(200, 50),
        id: generate(),
      },
    ]);
    //key
  };

  const handleEmojiKeyDown = (e, label, symbol) => {
    if (e.key === "Enter") {
      setEmojiQueue([
        ...emojiQueue,
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
    }
  };
  const [emojiQueue, setEmojiQueue] = useState([]);

  useEffect(() => {
    console.log(emojiQueue);
  }, [emojiQueue]);

  return (
    <div>
      <div>
        <EmojiBoardWrapper>
          {emojis.map(({ label, symbol, id }) => {
            return (
              <EmojiButton
                key={id}
                onClick={() => handleEmojiClick(label, symbol)}
                onkeydown={(e) => handleEmojiKeyDown(e, label, symbol)}
              >
                <Emoji label={label} symbol={symbol} size="3rem" />
              </EmojiButton>
            );
          })}
        </EmojiBoardWrapper>
      </div>
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
        </AutoExpire>
      ))}
      <div>
        <img
          style={{ width: "50px", height: "50px" }}
          src={loading}
          alt="loading"
        />
      </div>
    </div>
  );
};

export default EmojiBoard;
