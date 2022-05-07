// MUI
import Tooltip from "@mui/material/Tooltip";

// External
import { FunctionComponent } from "react";
import clsx from "clsx";

// Internal;
import { Countries } from "../translations.json";

export interface FlagIconProps {
  country: string;
  showName?: boolean;
  square?: boolean;
  noMargin?: boolean;
}

const FlagIcon: FunctionComponent<FlagIconProps> = ({ country, showName, square, noMargin }) => {
  const icon = <span className={clsx("fi", `fi-${country.toLowerCase()}`, { ["fis"]: square, ["mr"]: !noMargin })}></span>;
  if (showName)
    return <Tooltip title={Countries[country.toUpperCase()]} role="tooltip">{icon}</Tooltip>
  return icon
}

export default FlagIcon;
