// MUI Components
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
// React-router-dom
import { useSearchParams } from "react-router-dom";

const CustomPagination = ({ totalPages }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = +searchParams.get("page") || 1;

    return (
        <Box display={"flex"} justifyContent={"center"} mt={6}>
            <Pagination
                count={totalPages}
                page={currentPage}
                size="large"
                color="secondary"
                onChange={(e, newPage) => {
                    setSearchParams({ page: newPage });
                }}
            />
        </Box>
    );
};

export default CustomPagination;
