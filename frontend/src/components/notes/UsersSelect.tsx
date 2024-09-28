import { ReactNode } from "react";
// MUI Components
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Select, { SelectChangeEvent } from "@mui/material/Select";
// Custom Components
import CustomPagination from "../general/CustomPagination";
// Custom Hook
import useUsersSelect from "../../hooks/ui/notes/useUsersSelect";

interface UsersSelectProps {
    value: string;
    onChange: (
        event: SelectChangeEvent<string | null>,
        child: ReactNode
    ) => void;
}

const UsersSelect = ({ value, onChange }: UsersSelectProps) => {
    const { selectOptions, totalPages, isLoading, isUsersSelectVisible } =
        useUsersSelect();

    // so if the current user isn't in the current page result the value would be the first user in the current page and avoid providing a value that doesn't exist on the current users page returned from the api
    const selectValue = selectOptions?.some((user) => user._id === value)
        ? value
        : selectOptions && selectOptions[0]._id;

    if (isLoading) return <LinearProgress />;

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
                        {selectOptions &&
                            selectOptions.map((user) => (
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
