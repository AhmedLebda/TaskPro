import MainLayout from "./pages/layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Error from "./pages/404";
import Login from "./pages/login/Login";
import DashboardLayout from "./pages/layouts/DashboardLayout";
import Notes from "./pages/dashboard/Notes";
import Users from "./pages/dashboard/users/Users";
import DashIndex from "./pages/dashboard/DashIndex";
import AddUserForm from "./pages/dashboard/users/AddUserForm";
import EditUserForm from "./pages/dashboard/users/EditUserForm";
import ProtectedRoute from "./components/ProtectedRoute";
const routes = [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "about",
                element: <About />,
            },
        ],
    },
    {
        path: "dashboard",
        element: <ProtectedRoute />,
        children: [
            {
                element: <DashboardLayout />,
                children: [
                    {
                        index: true,
                        element: <DashIndex />,
                    },
                    {
                        path: "notes",
                        element: <Notes />,
                    },
                    {
                        path: "users",
                        element: <Users />,
                    },

                    {
                        path: "users/add",
                        element: <AddUserForm />,
                    },
                    {
                        path: "users/edit/:userId",
                        element: <EditUserForm />,
                    },
                ],
            },
        ],
    },
];

export default routes;
