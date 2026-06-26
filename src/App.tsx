import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";
import { ToastProvider } from "./ui/Toast";

function App() {
  return (
    <ToastProvider>
      <RouterProvider router={appRouter} />
    </ToastProvider>
  );
}

export default App;
