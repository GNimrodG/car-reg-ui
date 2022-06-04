import { createRoot } from "react-dom/client";
import { MakeLogosProvider } from "./providers/MakeLogos";
import App from "./App";
import ThemeProvider from "./ThemeProvider";
import { StrictMode } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "renderer/redux/store";

import "flag-icons/css/flag-icons.min.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./components/Loading";

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <ThemeProvider>
          <MakeLogosProvider>
            <App />
          </MakeLogosProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
