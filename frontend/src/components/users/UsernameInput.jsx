import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

const UsernameInput = ({ value, onChange, disabled }) => {
    return (
        <Grid item xs={12}>
            <TextField
                autoComplete="given-name"
                name="username"
                fullWidth
                id="username"
                label="username"
                autoFocus
                value={value}
                onChange={onChange}
                disabled={disabled}
            />
        </Grid>
    );
};

export default UsernameInput;
