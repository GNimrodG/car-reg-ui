import { createRoot } from "react-dom/client";
import { MakeLogosProvider } from "./providers/MakeLogos";
import { RecentContextProvider } from "./providers/RecentContext";
import { UsersContextProvider } from "./providers/UsersContext";
import App from "./App";
import ThemeProvider from "./ThemeProvider";

import "flag-icons/css/flag-icons.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <ThemeProvider>
    <UsersContextProvider>
      <MakeLogosProvider>
        <RecentContextProvider>
          <App />
        </RecentContextProvider>
      </MakeLogosProvider>
    </UsersContextProvider>
  </ThemeProvider>
);

// calling IPC exposed from preload script
// window.electron.ipcRenderer.once("ipc-example", (arg) => {
// eslint-disable-next-line no-console
//   console.log(arg);
// });
// window.electron.ipcRenderer.sendMessage("ipc-example", ["ping"]);
