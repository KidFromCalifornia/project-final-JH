import styled, { keyframes } from "styled-components";

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const LogoStack = styled.div`
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinningText = styled.img`
  position: absolute;
  top: -10px;
  left: 0;
  width: 300px;
  height: 300px;
  animation: ${spin} 4.5s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

const LogoShield = styled.img`
  position: absolute;

  width: 150px;
  height: 150px;
`;

const LoadingLogo = () => (
  <LoaderWrapper>
    <LogoStack>
      <SpinningText src="/src/assets/scc_logo_text.svg" alt="Logo Text" />
      <LogoShield src="/src/assets/scc_shield.svg" alt="Logo Shield" />
    </LogoStack>
    Currently Brewing...
  </LoaderWrapper>
);

export default LoadingLogo;
