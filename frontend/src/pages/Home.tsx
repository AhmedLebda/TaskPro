import { Box, Divider, Typography } from "@mui/material";

function Home() {
    return (
        <div>
            <Typography
                component="h1"
                sx={{
                    typography: { xs: "h5", sm: "h4", md: "h3" },
                }}
                mb={2}
            >
                Welcome to TaskPro
            </Typography>
            <Divider />
            <Box>
                <Typography paragraph sx={{ mt: 4 }} gutterBottom>
                    Welcome to the staff portal of [Company Name]. Here, you
                    have access to the tools and resources needed to fulfill
                    your role effectively.
                </Typography>
                <Typography
                    component="h2"
                    variant="h5"
                    sx={{ fontStyle: "normal", mt: 4 }}
                    gutterBottom
                >
                    Contact Information:
                </Typography>

                <Box
                    component="ul"
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <li>
                        <b>Email:</b> [Contact Email]
                    </li>
                    <li>
                        <b>Phone:</b> [Contact Phone Number]
                    </li>
                    <li>
                        <b>Address:</b> [Company Address]
                    </li>
                </Box>

                <Typography
                    paragraph
                    sx={{
                        fontWeight: "bold",
                        color: "primary.main",
                        mt: 6,
                    }}
                    gutterBottom
                >
                    Owner: [Owner&apos;s Name]
                </Typography>
            </Box>
        </div>
    );
}

export default Home;
