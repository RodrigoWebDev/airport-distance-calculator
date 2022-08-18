import { createRoot } from "react-dom/client";
import Home from "./pages/home";

const root = createRoot(document.getElementById("app"));
root.render(<Home />);