import Box from "@mui/material/Box";
import DashboardDrawer from "../../components/dashboard/DashboardDrawer";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Footer";
const DashboardLayout = () => {
    return (
        <Box
            sx={{
                display: "flex",
            }}
        >
            <DashboardDrawer />
            <Box
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - 240px)` },
                    mt: "56px",
                    minHeight: "calc(100vh - 56px)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Outlet></Outlet>
                <Footer />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
