import styled from "styled-components";
import EmojiWrapper from "./EmojiWrapper";

const Emoji = styled(EmojiWrapper)`
  font-size: ${({ size }) => (size ? size : "1rem")};
`;
export default Emoji;
