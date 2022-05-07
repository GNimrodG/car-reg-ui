import { styled } from "@mui/material/styles";

const TitleContainer = styled("div")(({ theme }) => ({
  display: "inline-flex",
  gap: theme.spacing(1),
  width: "100%",
}));

export default TitleContainer;
