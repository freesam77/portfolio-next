import { keyframes } from "@emotion/react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const LoadingBarContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "4px",
  backgroundColor: theme.palette.grey[200],
  borderRadius: "2px",
  overflow: "hidden",
  marginBottom: theme.spacing(2),
}));

const LoadingBar = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "100%",
  background: `linear-gradient(90deg, 
    ${theme.palette.primary.light} 0%, 
    ${theme.palette.primary.main} 50%, 
    ${theme.palette.primary.light} 100%)`,
  backgroundSize: "200% 100%",
  animation: `${shimmer} 1.5s infinite linear`,
}));

export default function LoadingBarComponent() {
  return (
    <LoadingBarContainer>
      <LoadingBar />
    </LoadingBarContainer>
  );
} 