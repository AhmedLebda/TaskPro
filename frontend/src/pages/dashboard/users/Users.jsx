// MUI Components
import Spinner from "../../../components/general/Spinner";
import Alert from "@mui/material/Alert";
// Custom Hooks
import useUsersQuery from "../../../hooks/users/UseUsersQuery";
// Custom Components
import UsersList from "../../../components/users/UsersList";
import CustomPagination from "../../../components/general/CustomPagination";
const Users = () => {
    const { data, isLoading, error } = useUsersQuery();

    const users = data?.data;
    const totalPages = data?.totalPages;

    if (isLoading) {
        return <Spinner item="Users" />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    return (
        <>
            <UsersList data={users} />

            <CustomPagination totalPages={totalPages} />
        </>
    );
};

export default Users;
