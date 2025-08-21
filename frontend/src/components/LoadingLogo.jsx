import styled, { keyframes } from "styled-components";
import { ReactComponent as SCCLogoText } from "../public/scc_logo_text.svg";
import { ReactComponent as SCCLogoshield } from "../public/image/scc_shield.svg";

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  font-size: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
`;

const LogoStack = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningText = styled(SCCLogoText)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  animation: ${spin} 1.2s linear infinite;
  &:hover {
    animation-play-state: paused;
  }
`;

const LogoShield = styled(SCCLogoshield)`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 80px;
  height: 80px;
`;

const LoadingLogo = () => (
  <LoaderWrapper>
    <LogoStack>
      <SpinningText />
      <LogoShield />
    </LogoStack>
    Currently Brewing...
  </LoaderWrapper>
);

export default LoadingLogo;
