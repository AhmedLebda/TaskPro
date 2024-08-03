import useUsersQuery from "../../../hooks/users/UseUsersQuery";
import Spinner from "../../../components/general/Spinner";
import Alert from "@mui/material/Alert";
import UsersList from "../../../components/users/UsersList";
const Users = () => {
    const { data, isLoading, error } = useUsersQuery();

    if (isLoading) {
        return <Spinner item="Users" />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    return <UsersList data={data} />;
};

export default Users;
