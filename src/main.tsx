import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import "./theme.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import App from "./App.tsx";
import { store } from "./store";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
