import { Countries } from "renderer/translations.json";
import { FunctionComponent, memo } from "react";
import countries, { CountryData } from "renderer/countries.json";
import FlagIcon from "./FlagIcon";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TitleContainer from "./TitleContainer";
import Typography from "@mui/material/Typography";

export interface AvailableCountriesProps {
  onClick: (country: CountryData) => void;
}

const AvailableCountries: FunctionComponent<AvailableCountriesProps> = ({ onClick }) => {
  console.count("AvailableCountries");

  return <>
    <Typography sx={{ textAlign: "center" }} variant="h5">Supported countries</Typography>
    <List>
      {countries
        .sort((a, b) => (Countries[a.country.toUpperCase()] + a.label) > (Countries[b.country.toUpperCase()] + b.label) ? 1 : -1)
        .map(x =>
          <ListItem onClick={onClick.bind(this, x)} key={`${x.country}-${x.label}`}>
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
  </>;
};

export default memo(AvailableCountries, (prev, next) => prev.onClick === next.onClick);
