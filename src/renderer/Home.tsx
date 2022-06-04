import { Countries, Fields } from "./translations.json";
import { CountryData } from "./countries.json";
import { FunctionComponent, useCallback, useState } from "react";
import { handleResponse, serializeQuery } from "renderer/utils/query";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import AvailableCountries from "renderer/components/AvailableCountries";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import DataDisplay from "renderer/components/DataDisplay";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Loading from "renderer/Loading";
import RecentChecks from "renderer/components/RecentChecks";
import RecentCountries from "renderer/components/RecentCountries";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import useRecentStore, { ResponseData } from "renderer/providers/RecentContext";
import useUserStore from "renderer/providers/UsersContext";
import IconButton from "@mui/material/IconButton";

const Home: FunctionComponent = () => {
  const userStore = useUserStore();
  const recentStore = useRecentStore();

  const [dialog, setDialog] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<null | CountryData>(null);
  const [requestData, setRequestData] = useState<{ [key: string]: string }>({});

  const [loading, setLoading] = useState(false);
  const [resultDialog, setResultDialog] = useState(false);
  const [data, setData] = useState<null | { raw: string, json: any | null, plate: string, country: string, label?: string, date?: number }>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDialogClose = useCallback(() => {
    setDialog(false);
    setSelectedCountry(null);
    setRequestData({});
  }, []);

  const handleDialogSuccess = useCallback(async (_: any, force = false) => {
    handleDialogClose();
    if (!selectedCountry) return;

    const cached = recentStore.responses.find(x =>
      x.country === selectedCountry.country &&
      x.label === (selectedCountry.label || null) &&
      Object.entries(x.fields).every(([key, value]) => requestData[key].toString().toLowerCase() === value.toString().toLowerCase()));

    const plate = requestData.RegistrationNumber?.toUpperCase();

    if (cached && !force) {
      setData({ raw: cached.data, json: cached.json, plate, country: selectedCountry.country, label: selectedCountry.label, date: cached.date });
      setResultDialog(true);
      return;
    }

    setLoading(true);
    const endpoint = selectedCountry.endpoint;

    recentStore.addType(selectedCountry);
    const result = await fetch(`https://www.regcheck.org.uk/api/reg.asmx${endpoint}`, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: serializeQuery({ ...requestData, username: userStore.selectedUser }),
    });

    if (result.ok) {
      const text = await result.text();
      const json = handleResponse(text);
      setData({ raw: text, json, plate, country: selectedCountry.country, label: selectedCountry.label, date: Date.now() });
      recentStore.addResponse(text, json, requestData, selectedCountry);
    } else {
      setError(await result.text());
    }
    setLoading(false);
    setResultDialog(true);
  }, [requestData, selectedCountry, userStore.selectedUser, recentStore]);

  const handleTypeSelect = useCallback((x: CountryData) => {
    if (!userStore.selectedUser) {
      setError("Please select a user first!");
      setResultDialog(true);
      return;
    }
    setDialog(true);
    setSelectedCountry(x);
  }, [userStore.selectedUser]);

  const dismissResult = useCallback(() => {
    setResultDialog(false);
    setData(null);
    setError(null);
  }, []);

  const handleCheckSelect = useCallback((x: ResponseData) => {
    setData({ raw: x.data, json: x.json, plate: x.fields["RegistrationNumber"], country: x.country, label: x.label || undefined, date: x.date });
    setResultDialog(true);
  }, []);

  return <>
    {loading && <Loading global />}

    <Dialog
      open={dialog && !loading}
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 2,
        }}
        onClick={handleDialogClose}
        size="large">
        <CloseIcon />
      </IconButton>
      {!!selectedCountry && <>
        <DialogTitle>
          {Countries[selectedCountry.country.toUpperCase()]}{selectedCountry.label ? ` ${selectedCountry.label}` : ""}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={e => { e.preventDefault(); handleDialogSuccess(e); }}>
            {selectedCountry.fields.map((field, i) =>
              <TextField
                key={`${selectedCountry.country}-${i}`}
                required
                fullWidth
                margin="normal"
                placeholder={selectedCountry.placeholders[field] || undefined}
                autoFocus={i === 0}
                label={Fields[field]}
                value={requestData[field] || ""}
                onChange={e => setRequestData({ ...requestData, [field]: e.target.value })} />)}
          </form>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={handleDialogSuccess.bind(this, true)}>Force refetch</Button>
          <Button color="error" onClick={handleDialogClose}>Cancel</Button>
          <Button color="primary" onClick={handleDialogSuccess}>Send</Button>
        </DialogActions>
      </>}
    </Dialog>

    <Dialog
      open={resultDialog}
      onClose={dismissResult}
      maxWidth="lg"
      fullWidth>
      <IconButton
        aria-label="close"
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          zIndex: 2,
        }}
        onClick={dismissResult}
        size="large">
        <CloseIcon />
      </IconButton>
      {!!data && <>
        <DialogTitle>
          {Countries[data.country.toUpperCase()]}{data.label ? ` ${data.label}` : ""}
        </DialogTitle>
        <DialogContent sx={({
          display: "flex",
          flexDirection: "column",
          width: "100%",
        })}>
          <DataDisplay data={data.json} country={data.country} plate={data.plate} date={data.date} />
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Raw JSON data</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ width: "100%" }}>
              <TextField value={JSON.stringify(data.json, null, 4)} disabled multiline fullWidth />
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Raw XML data</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ width: "100%" }}>
              <TextField value={data.raw} disabled multiline fullWidth />
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={dismissResult}>Close</Button>
        </DialogActions>
      </>}
      {!!error && <>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={dismissResult}>Close</Button>
        </DialogActions>
      </>}
    </Dialog>

    <RecentCountries onClick={handleTypeSelect} />

    <RecentChecks onClick={handleCheckSelect} />

    <AvailableCountries onClick={handleTypeSelect} />
  </>;
};

export default Home;
