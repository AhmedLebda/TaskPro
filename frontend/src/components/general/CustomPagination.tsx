// MUI Components
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
// React-router-dom
import { useSearchParams } from "react-router-dom";

interface CustomPaginationProps {
    totalPages: number;
    size?: "small" | "medium" | "large";
    mt?: number;
}

const CustomPagination = ({
    totalPages,
    size = "large",
    mt = 6,
}: CustomPaginationProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = Number(searchParams.get("page")) || 1;

    return (
        <Box display={"flex"} justifyContent={"center"} mt={mt}>
            <Pagination
                count={totalPages}
                page={currentPage}
                size={size}
                color="secondary"
                onChange={(_e, newPage) => {
                    setSearchParams({ page: String(newPage) });
                }}
            />
        </Box>
    );
};

export default CustomPagination;
