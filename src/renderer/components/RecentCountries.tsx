import type { FunctionComponent } from "react";
import FlagIcon from "./FlagIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TitleContainer from "./TitleContainer";
import Typography from "@mui/material/Typography";
import { Countries } from "renderer/static/translations.json";
import { CountryData } from "renderer/static/countries.json";
import { useAppSelector } from "renderer/redux/hooks";
import { selectRecent } from "renderer/stores/recent";

export interface RecentCountriesProps {
  onClick: (country: CountryData) => void;
}

const RecentCountries: FunctionComponent<RecentCountriesProps> = ({ onClick }) => {
  const recentStore = useAppSelector(selectRecent);

  return <>
    {recentStore.types.length > 0 && <>
      <Typography sx={{ textAlign: "center" }} variant="h4">Recently used</Typography>
      <List>
        {recentStore.types
          .map((x) =>
            <ListItem onClick={onClick.bind(this, x)} key={`recent-${x.country}-${x.label}`}>
              <ListItemButton>
                <ListItemIcon>
                  <FlagIcon country={x.country} />
                </ListItemIcon>
                <ListItemText primary={<TitleContainer>
                  <Typography>{Countries[x.country.toUpperCase()]}</Typography>
                  <Typography variant="caption" sx={{ flexGrow: 1 }}>{x.country}</Typography>
                  <Typography color="disabled" variant="caption">{x.endpoint}</Typography>
                </TitleContainer>} secondary={x.label} />
              </ListItemButton>
            </ListItem>)}
      </List>
    </>}</>
};

export default RecentCountries;
