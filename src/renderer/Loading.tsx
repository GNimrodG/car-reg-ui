// MUI
import MuiBackdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

// External
import { FunctionComponent } from "react";

export interface LoadingProps {
  global?: boolean;
  local?: boolean;
  message?: string;
  value?: number;
  height?: number | string;
  className?: string;
}

const LocalContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const ProgressBar = styled(CircularProgress)({
  display: "block",
});

interface BackdropProps {
  global?: boolean;
}

const Backdrop = styled(MuiBackdrop, { shouldForwardProp: (prop) => prop !== "global" })<BackdropProps>(({ global, theme }) => ({
  color: "#fff",
  flexDirection: "column",

  zIndex: global ? theme.zIndex.tooltip + 1 : theme.zIndex.speedDial + 1,
}));

const Title = styled("h1")({
  textAlign: "center",
})

const Loading: FunctionComponent<LoadingProps> = ({ global, local, message, value, height, className, }) => {
  if (local)
    return <LocalContainer className={className} style={{ height: height }}>
      <ProgressBar color="primary" variant={value ? "determinate" : "indeterminate"} value={value} />
    </LocalContainer>;

  return <Backdrop
    open={true}
    className={className}
    global={global}>
    {message && <Title>{message}</Title>}
    <ProgressBar color="primary" variant={value ? "determinate" : "indeterminate"} value={value} />
  </Backdrop>;
}

export default Loading;
