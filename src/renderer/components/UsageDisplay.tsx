import type { FunctionComponent } from "react";
import { Typography } from "@mui/material";
import { useAppSelector } from "renderer/redux/hooks";
import { selectUser } from "renderer/stores/user";

const UsageDisplay: FunctionComponent = () => {
  const userStore = useAppSelector(selectUser);

  switch (userStore.status) {
    case "loading":
      return <Typography>Loading available credits...</Typography>;
    case "failed":
      return <Typography color="error">Invalid username!</Typography>;
    default:
      return <Typography>{userStore.credits} credits remaining</Typography>;
  }
};

export default UsageDisplay;
