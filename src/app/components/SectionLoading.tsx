import { styled } from '@mui/material/styles';
import { keyframes } from '@mui/system';

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const LoadingContainer = styled('div')`
  width: 100%;
  height: 2px;
  background: #f0f0f0;
  overflow: hidden;
  position: relative;
`;

const LoadingBar = styled('div')`
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #e0e0e0 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

export default function SectionLoading() {
  return (
    <LoadingContainer>
      <LoadingBar />
    </LoadingContainer>
  );
} 