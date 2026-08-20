import { GoogleOAuthProvider } from "@react-oauth/google";
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";
import { GOOGLE_CLIENT_ID } from "./config/env";
import { ToastProvider } from "./ui/Toast";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ToastProvider>
        <RouterProvider router={appRouter} />
      </ToastProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
