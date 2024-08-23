// MUI Components
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { ChangeEvent } from "react";

interface ActiveStatusFieldsetProps {
    value: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
}

const ActiveStatusFieldset = ({
    value,
    onChange,
    disabled,
}: ActiveStatusFieldsetProps) => {
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
                            disabled={disabled}
                        />
                    }
                    label="Active"
                />
            </FormControl>
        </Grid>
    );
};

export default ActiveStatusFieldset;
