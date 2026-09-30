import { createRoot } from "react-dom/client";
import "../index.css";
import Popup from "./popup";

const root = createRoot(document.getElementById("root")!);
root.render(<Popup />);
