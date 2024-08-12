// MUI Components
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
// React-router-dom
import { useSearchParams } from "react-router-dom";

const CustomPagination = ({ totalPages, size = "large", mt = 6 }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = +searchParams.get("page") || 1;

    return (
        <Box display={"flex"} justifyContent={"center"} mt={mt}>
            <Pagination
                count={totalPages}
                page={currentPage}
                size={size}
                color="secondary"
                onChange={(e, newPage) => {
                    setSearchParams({ page: newPage });
                }}
            />
        </Box>
    );
};

export default CustomPagination;
