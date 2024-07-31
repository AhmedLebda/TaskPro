import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./pages/layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import PageNotFound from "./pages/PageNotFound";
import Login from "./pages/login/Login";
// Dashboard pages
import DashboardLayout from "./pages/layouts/DashboardLayout";
// ==> index
import DashIndex from "./pages/dashboard/index/DashIndex";
// ==> Users
import Users from "./pages/dashboard/users/Users";
import AddUserForm from "./pages/dashboard/users/AddUserForm";
import EditUserForm from "./pages/dashboard/users/EditUserForm";
// ==> notes
import Notes from "./pages/dashboard/notes/Notes";
import CreateNoteForm from "./pages/dashboard/notes/CreateNoteForm";
import EditNoteForm from "./pages/dashboard/notes/EditNoteForm";
const routes = [
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <PageNotFound />,
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
                    {
                        path: "notes",
                        element: <Notes />,
                    },
                    {
                        path: "notes/create",
                        element: <CreateNoteForm />,
                    },
                    {
                        path: "notes/edit/:noteId",
                        element: <EditNoteForm />,
                    },
                ],
            },
        ],
    },
];

export default routes;
