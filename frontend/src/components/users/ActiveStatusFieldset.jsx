// MUI Components
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";

const ActiveStatusFieldset = ({ value, onChange }) => {
    return (
        <Grid item xs={12}>
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend">Active Status</FormLabel>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="active"
                            checked={value}
                            onChange={onChange}
                        />
                    }
                    label="Active"
                />
            </FormControl>
        </Grid>
    );
};

export default ActiveStatusFieldset;
