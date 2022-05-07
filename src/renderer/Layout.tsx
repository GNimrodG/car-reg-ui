import { FunctionComponent, Suspense } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Loading from "./Loading";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import UsageDisplay from "./components/UsageDisplay";
import useUserStore from "./providers/UsersContext";

const filter = createFilterOptions<UserListEntry>();

type UserListEntry = (string | {
  label: string;
  inputValue: string;
});

const Main = styled("main")(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  gap: theme.spacing(1),
}));

const Layout: FunctionComponent = ({ children }) => {
  const userStore = useUserStore();

  return <>
    <AppBar position="sticky">
      <Toolbar>
        {/* User Selector */}
        <Box sx={{ flexGrow: 1 }}>
          <Autocomplete

            value={userStore.selectedUser || null}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                userStore.setSelectedUser(newValue);
              } else if (newValue && newValue.inputValue) {
                userStore.setSelectedUser(newValue.inputValue);
              } else {
                userStore.setSelectedUser(null);
              }
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = userStore.users.includes(inputValue);
              if (!!inputValue && !isExisting)
                filtered.push({ label: `Add "${inputValue}"`, inputValue });
              return filtered;
            }}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              return option.inputValue;
            }}
            renderOption={(props, option) =>
              <li {...props}>
                {typeof option === "string" ? option : option.label}
                {" "}
                {typeof option === "string" &&
                  <IconButton
                    sx={{
                      marginLeft: "auto"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      userStore.removeUser(option.toString());
                    }}>
                    <DeleteIcon />
                  </IconButton>}
              </li>}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={userStore.users as UserListEntry[]}
            sx={{ width: 200 }}
            freeSolo
            renderInput={(params) => (
              <TextField {...params} size="small" label="User" />
            )}
          />
        </Box>
        <UsageDisplay />
      </Toolbar>
    </AppBar>

    <Container maxWidth="lg">
      <Main>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Main>
    </Container>
  </>;
};

export default Layout;
