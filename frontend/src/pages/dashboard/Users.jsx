import useUsersQuery from "../../hooks/users/UseUsersQuery";
import Spinner from "../../components/Spinner";
import Alert from "@mui/material/Alert";
import UsersList from "../../components/users/UsersList";
const Users = () => {
    const { data, isLoading, error } = useUsersQuery();
    console.log(data);

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    return <UsersList data={data} />;
};

export default Users;
