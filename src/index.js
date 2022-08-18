import { createRoot } from "react-dom/client";
import Home from "./pages/home";

/* const app = document.getElementById("app");
ReactDOM.render(<Home />, app); */

const root = createRoot(document.getElementById("app"));
root.render(<Home />);