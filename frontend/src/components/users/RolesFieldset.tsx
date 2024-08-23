// MUI Components
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { InitialAddUserFormData, Role } from "../../config/types";

type RolesValues = InitialAddUserFormData["roles"];

interface RolesFieldsetProps {
    disabled?: boolean;
    rolesValues: RolesValues;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// List of all available roles
const roles: Role[] = ["employee", "manager", "admin"];

const RolesFieldset = ({
    disabled,
    rolesValues,
    onChange,
}: RolesFieldsetProps) => {
    return (
        <Grid item xs={12}>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Employee Role</FormLabel>
                <FormGroup
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                    }}
                >
                    {roles.map((role) => (
                        <FormControlLabel
                            key={role}
                            control={
                                <Checkbox
                                    name={role}
                                    checked={rolesValues[role]}
                                    onChange={onChange}
                                    disabled={role === "admin" || disabled}
                                />
                            }
                            label={role}
                        />
                    ))}
                </FormGroup>
            </FormControl>
        </Grid>
    );
};

export default RolesFieldset;
