// MUI Components
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// Custom Components
import LinearLoading from "../general/LinearLoading";
import CustomPagination from "../general/CustomPagination";
// Custom Hook
import useUsersSelect from "../../hooks/ui/notes/useUsersSelect";
import { Divider } from "@mui/material";

const UsersSelect = ({ value, onChange }) => {
    const { selectOptions, totalPages, isLoading, isUsersSelectVisible } =
        useUsersSelect();

    // so if the current user isn't in the current page result the value would be the first user in the current page and avoid providing a value that doesn't exist on the current users page returned from the api
    const selectValue = selectOptions?.some((user) => user._id === value)
        ? value
        : selectOptions && selectOptions[0]._id;

    if (isLoading) return <LinearLoading />;
    return (
        isUsersSelectVisible && (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth required>
                    <InputLabel id="user">Assign to:</InputLabel>
                    <Select
                        labelId="user"
                        id="user"
                        value={selectValue}
                        label="user"
                        onChange={onChange}
                        name="user"
                    >
                        {selectOptions.map((user) => (
                            <MenuItem key={user._id} value={user._id}>
                                {user.username} ({user.roles.join(" , ")})
                            </MenuItem>
                        ))}
                        <Divider />
                        <CustomPagination
                            totalPages={totalPages}
                            size="small"
                            mt={2}
                        />
                    </Select>
                </FormControl>
            </Box>
        )
    );
};

export default UsersSelect;
