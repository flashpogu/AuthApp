import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { store, persistor } from "./redux/store.ts";
import { Provider } from "react-redux";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </PersistGate>
);
