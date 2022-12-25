import { type FunctionComponent, Suspense, PropsWithChildren, useEffect } from "react";
import { styled } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Loading from "./components/Loading";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import UsageDisplay from "./components/UsageDisplay";
import { useAppDispatch, useAppSelector } from "./redux/hooks";
import { removeUser, selectUser, setSelectedUser, setUsers, updateCredit } from "./stores/user";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { importRecentData, type RecentState } from "./stores/recent";
import { z } from "zod";

const filter = createFilterOptions<UserListEntry>();

type UserListEntry = (string | {
  label: string;
  inputValue: string;
});

interface ExportedData {
  user: {
    users: string[];
    selectedUser: string | null;
  };
  recent: RecentState;
}

const exportedDataSchema = z.object({
  user: z.object({
    users: z.array(z.string()),
    selectedUser: z.string().nullable(),
  }),
  recent: z.object({
    types: z.array(z.object({
      country: z.string().length(2),
      fields: z.array(z.string()),
      placeholders: z.record(z.string(), z.string()).optional(),
      endpoint: z.string(),
      label: z.string().optional(),
    })),
    responses: z.array(z.object({
      data: z.string(),
      json: z.record(z.string(), z.any()),
      country: z.string().length(2),
      label: z.string().nullable(),
      fields: z.record(z.string(), z.string()),
      date: z.number().int().positive(),
    })),
  }),
});

const Main = styled("main")(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  gap: theme.spacing(1),
}));

const Layout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const globalStore = useAppSelector((state) => state);
  const userStore = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(updateCredit());
  }, []);

  const handleExport = () => {
    const data = JSON.stringify({
      user: {
        users: globalStore.user.users,
        selectedUser: globalStore.user.selectedUser
      },
      recent: globalStore.recent,
    } satisfies ExportedData);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = (e) => {
        const jsonData = JSON.parse(e.target?.result as string);
        if (!jsonData) return;
        const result = exportedDataSchema.safeParse(jsonData);
        if (!result.success) {
          console.error(result.error);
          return;
        }
        const data = result.data;
        dispatch(setUsers(data.user.users));
        dispatch(setSelectedUser(data.user.selectedUser));
        dispatch(importRecentData(data.recent));
      };
    };
    input.click();
  };

  return <>
    <AppBar position="sticky">
      <Toolbar>
        {/* User Selector */}
        <Box sx={{ flexGrow: 1, display: "flex", gap: 1 }}>
          <Autocomplete
            value={userStore.selectedUser || null}
            onChange={(_, newValue) => {
              if (typeof newValue === 'string') {
                dispatch(setSelectedUser(newValue));
              } else if (newValue && newValue.inputValue) {
                dispatch(setSelectedUser(newValue.inputValue));
              } else {
                dispatch(setSelectedUser(null));
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
                      dispatch(removeUser(option.toString()));
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
          <Tooltip title="Export your local configuration to a file">
            <Button onClick={handleExport}>
              EXPORT
            </Button>
          </Tooltip>
          <Tooltip title="Import configuration from a file">
            <Button onClick={handleImport}>
              IMPORT
            </Button>
          </Tooltip>
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
