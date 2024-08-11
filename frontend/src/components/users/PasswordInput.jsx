import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const PasswordInput = ({ value, onChange, disabled }) => {
    return (
        <Grid item xs={12}>
            <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </Grid>
    );
};

export default PasswordInput;
