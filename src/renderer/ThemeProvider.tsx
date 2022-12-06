import { blue } from "@mui/material/colors";
import { createTheme, StyledEngineProvider, ThemeProvider as MuiThemeProvider, } from "@mui/material/styles";
import { type FunctionComponent, useEffect, useState, PropsWithChildren } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import useMediaQuery from "@mui/material/useMediaQuery";

function useDarkTheme() {
  const [prefersDarkTheme, setPreference] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      if (e.matches !== prefersDarkTheme) setPreference(e.matches);
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handler);
    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return prefersDarkTheme;
}

const ThemeProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const prefersDarkTheme = useDarkTheme();
  const inPrint = useMediaQuery("@media print");
  const [themeType, setThemeType] = useState<"dark" | "light">(
    prefersDarkTheme ? "dark" : "light"
  );

  useEffect(() => {
    setThemeType(prefersDarkTheme && !inPrint ? "dark" : "light");
  }, [prefersDarkTheme, inPrint]);

  const theme = createTheme({
    palette: {
      mode: themeType,
      primary: blue,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1281,
        xl: 1800, // 1920
      },
    },
    components: {
      MuiLink: {
        defaultProps: {
          underline: "hover",
        },
      },
    },
  });

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

export default ThemeProvider;
