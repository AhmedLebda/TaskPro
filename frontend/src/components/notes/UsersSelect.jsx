// MUI Components
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// Custom Components
import LinearLoading from "../general/LinearLoading";
// Custom Hook
import useUsersSelect from "../../hooks/ui/notes/useUsersSelect";

const UsersSelect = ({ value, onChange }) => {
    const { data, isLoading, isUsersSelectVisible } = useUsersSelect();

    if (isLoading) return <LinearLoading />;
    return (
        isUsersSelectVisible && (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth required>
                    <InputLabel id="user">Assign to:</InputLabel>
                    <Select
                        labelId="user"
                        id="user"
                        value={value}
                        label="user"
                        onChange={onChange}
                        name="user"
                    >
                        {data.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        )
    );
};

export default UsersSelect;
