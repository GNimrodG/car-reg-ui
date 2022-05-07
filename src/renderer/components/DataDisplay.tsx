import { FunctionComponent, useMemo } from "react";
import { getRelevantData } from "renderer/utils/query";
import Avatar from "@mui/material/Avatar";
import FlagIcon from "./FlagIcon";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useMakeLogos from "renderer/providers/MakeLogos";

export interface DataDisplayProps {
  data: any;
  country?: string;
  plate?: string;
}

const DataDisplay: FunctionComponent<DataDisplayProps> = ({ data, country, plate }) => {
  const makeLogos = useMakeLogos();

  const { Year, Make, Model, VIN, Color, Fuel } = useMemo(() => getRelevantData(data), [data]);

  return <Paper sx={{ padding: theme => theme.spacing(2) }}>
    {plate && <Typography variant="h5" align="center">{country && <FlagIcon country={country} showName />} {plate}</Typography>}

    <Typography variant="caption">Make</Typography>
    <Typography variant="h6" sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}>
      {makeLogos[Make?.toLowerCase() || ""] &&
        <><Avatar
          src={makeLogos[Make!.toLowerCase()]}
          variant="square"
          sx={{ display: "inline-block", "& .MuiAvatar-img": { objectFit: "contain" } }} />{" "}</>}
      {Make || "N/A"}</Typography>
    <Typography variant="caption">Model</Typography>
    <Typography variant="h6">{Model || "N/A"}</Typography>
    <Typography variant="caption">Year</Typography>
    <Typography variant="h6">{Year || "N/A"}</Typography>
    <Typography variant="caption">VIN</Typography>
    <Typography variant="h6">{VIN || "N/A"}</Typography>
    {Color && <>
      <Typography variant="caption">Color</Typography>
      <Typography variant="h6">{Color}</Typography>
    </>}
    {Fuel && <>
      <Typography variant="caption">Fuel type</Typography>
      <Typography variant="h6">{Fuel}</Typography>
    </>}
  </Paper>;
};

export default DataDisplay;
