import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" mt={1}>
            {"Copyright © "}
            <Link href="https://github.com/AhmedLebda">Ahmed Lebda</Link>{" "}
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <Container
            component="footer"
            sx={{
                mt: "auto",
                alignItems: "center",
                gap: { xs: 4, sm: 8 },
                py: { xs: 4, sm: 6 },
                textAlign: { sm: "center", md: "left" },
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: 2,
                    width: "100%",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Copyright />

                <Stack
                    direction="row"
                    justifyContent="left"
                    spacing={1}
                    useFlexGap
                    sx={{
                        color: "text.secondary",
                    }}
                >
                    <IconButton
                        color="inherit"
                        href="https://github.com/AhmedLebda"
                        aria-label="GitHub"
                        sx={{ alignSelf: "center" }}
                    >
                        <FacebookIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        href="#"
                        aria-label="X"
                        sx={{ alignSelf: "center" }}
                    >
                        <TwitterIcon />
                    </IconButton>

                    <IconButton
                        color="inherit"
                        href="#"
                        aria-label="LinkedIn"
                        sx={{ alignSelf: "center" }}
                    >
                        <LinkedInIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Container>
    );
}
