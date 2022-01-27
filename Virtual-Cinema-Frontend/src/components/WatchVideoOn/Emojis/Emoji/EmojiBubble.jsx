import styled, { keyframes } from "styled-components";
import EmojiWrapper from "./EmojiWrapper";

const floatAnimation = (one, two) => keyframes`
0% {bottom: -10%; transform:translateX(0)}
50% {transform: translateX(${one}px)}
100% {bottom: 110%; transform:translateX(${two}px)}
`;

const EmojiBubble = styled(EmojiWrapper)`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => (left ? left : 10)};
  font-size: ${({ size }) => (size ? size : 10)}rem;
  animation: ${({ one, two }) => floatAnimation(one, two)}
    ${({ size }) => (size < 3 ? 5 : 6)}s ease-in forwards;
`;

export default EmojiBubble;
