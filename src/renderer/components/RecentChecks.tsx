import { FixedSizeList, ListChildComponentProps } from "react-window";
import { FunctionComponent, useCallback, useMemo } from "react";
import { dateFormatter, getRelevantData } from "renderer/utils/query";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import CancelIcon from "@mui/icons-material/Cancel";
import FlagIcon from "./FlagIcon";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import TitleContainer from "./TitleContainer";
import Typography from "@mui/material/Typography";
import useMakeLogos from "renderer/providers/MakeLogos";
import useRecentStore, { ResponseData } from "renderer/providers/RecentContext";

export interface RecentChecksProps {
  onClick: (country: ResponseData) => void;
}

const PlateContainer = styled("div")(({ theme }) => ({
  display: "inline-flex",
  flexDirection: "row",
  gap: theme.spacing(.5),
  alignItems: "center",
}));

const RecentChecks: FunctionComponent<RecentChecksProps> = ({ onClick }) => {
  const recentStore = useRecentStore();
  const makeLogos = useMakeLogos();

  const renderRow = useCallback(({ index, style }: ListChildComponentProps) => {
    const data = recentStore.responses[index].json;
    const plate = recentStore.responses[index].fields["RegistrationNumber"];
    const country = recentStore.responses[index].country;
    const date = recentStore.responses[index].date;

    const { Year, Make, Model, VIN } = useMemo(() => getRelevantData(data), [data]);

    return <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton onClick={onClick.bind(this, recentStore.responses[index])}>
        <ListItemIcon>
          {makeLogos[Make?.toLowerCase() || ""] ? <Avatar variant="square" src={makeLogos[Make!.toLowerCase()]} sx={{ "& .MuiAvatar-img": { objectFit: "contain" } }} /> : <Avatar><CancelIcon /></Avatar>}
        </ListItemIcon>
        <ListItemText
          sx={{ width: "80%", flexGrow: 0 }}
          primary={<TitleContainer>
            <Typography>{Make || "Unknown"} {Model || "Unknown"}</Typography>
            <Typography variant="caption">{Year || "Unknown year"}</Typography>
          </TitleContainer>}
          secondary={`${VIN || "Unknown VIN"}`} />
        <Typography variant="button" sx={{ flexGrow: 1, width: "30%" }}>{date ? dateFormatter.format(date) : "Unknown Time"}</Typography>
        <Typography variant="button" sx={{ flexGrow: 1 }}><PlateContainer><FlagIcon country={country} showName />{plate}</PlateContainer></Typography>
      </ListItemButton>
    </ListItem>;
  }, [recentStore.responses, makeLogos, onClick]);


  return <Paper
    sx={{ width: "100%", padding: theme => theme.spacing(2) }}>
    <Typography variant="h5" align="center">Recent Checks</Typography>
    {(recentStore.responses.length > 0) ?
      <FixedSizeList
        height={Math.min(recentStore.responses.length * 78, 400)}
        width={"100%"}
        itemSize={78}
        itemCount={recentStore.responses.length}
        overscanCount={5}>
        {renderRow}
      </FixedSizeList> : <Typography variant="h6">No recent checks</Typography>}
  </Paper>;
};

export default RecentChecks;
