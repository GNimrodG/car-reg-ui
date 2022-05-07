import { FunctionComponent, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import useUserStore from "renderer/providers/UsersContext";

const UsageDisplay: FunctionComponent = () => {
  const userStore = useUserStore();

  const [credits, setCredits] = useState<number | "invalid" | "loading">("loading");

  useEffect(() => {
    let lastTimeout: NodeJS.Timeout | null = null;

    async function fetchData() {
      if (!userStore.selectedUser) {
        setCredits("invalid");
        return;
      }

      const result = await fetch(`https://www.regcheck.org.uk/ajax/getcredits.aspx?username=${userStore.selectedUser}`);

      if (result.ok) {
        const text = await result.text();
        setCredits(parseInt(text));
      } else {
        setCredits("invalid");
      }

      lastTimeout = setTimeout(fetchData, 60 * 1000);
    }

    fetchData();

    return () => {
      if (lastTimeout) clearTimeout(lastTimeout);
    }
  }, [userStore.selectedUser]);

  switch (credits) {
    case "loading":
      return <Typography>Loading available credits...</Typography>;
    case "invalid":
      return <Typography color="error">Invalid username!</Typography>;
    default:
      return <Typography>{credits} credits remaining</Typography>;
  }
};

export default UsageDisplay;
