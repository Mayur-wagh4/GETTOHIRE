// Spinner.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { LogoNewImage } from '../../assets/assets'; // Adjust the import according to your assets folder structure

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  background: transparent; /* Ensure background is transparent */

`;

const SpinnerWrapper = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
`;

const SpinnerRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #3498db;
  border-right-color: #e74c3c;
  border-bottom-color: #f1c40f;
  border-left-color: #2ecc71;
  animation: ${spin} 1.8s linear infinite;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent; /* Ensure background is transparent */
  border-radius: 50%;
`;

const Logo = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const Spinner = () => (
  <SpinnerContainer>
    <SpinnerWrapper>
      <SpinnerRing />
      <LogoWrapper>
        <Logo src={LogoNewImage} alt="Logo" />
      </LogoWrapper>
    </SpinnerWrapper>
  </SpinnerContainer>
);

export default Spinner;
