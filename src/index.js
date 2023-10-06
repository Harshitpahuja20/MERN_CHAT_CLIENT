import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import ContextValue from "./context/ContextValue";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ContextValue>
      <GoogleOAuthProvider clientId="27606210521-51isfs17n2jemd2nl86ounl4tiur7ecv.apps.googleusercontent.com">
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </GoogleOAuthProvider>
    </ContextValue>
  </React.StrictMode>
);
