import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes";
// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const router = createBrowserRouter(routes);
// Create a client
const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
