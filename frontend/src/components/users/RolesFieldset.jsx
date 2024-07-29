// MUI Components
import Grid from "@mui/material/Grid";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

// List of all available roles
const roles = ["employee", "manager", "admin"];

const RolesFieldset = ({ isVisible = true, rolesValues, onChange }) => {
    return (
        <Grid item xs={12}>
            {isVisible && (
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
                                    />
                                }
                                label={role}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            )}
        </Grid>
    );
};

export default RolesFieldset;
