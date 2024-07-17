import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const router = createBrowserRouter(routes);

function App() {
    return <RouterProvider router={router} />;
}

export default App;
