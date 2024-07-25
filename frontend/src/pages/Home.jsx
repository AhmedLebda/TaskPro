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
                Welcome to [App Name] Staff Portal
            </Typography>
            <Divider />
            <Box>
                <Typography
                    component="p"
                    sx={{ typography: { xs: "body2", sm: "body1" }, mt: 4 }}
                    gutterBottom
                >
                    Welcome to the staff portal of [Company Name]. Here, you
                    have access to the tools and resources needed to fulfill
                    your role effectively.
                </Typography>
                <Typography
                    component="h2"
                    variant="h6"
                    sx={{ fontStyle: "normal", mt: 4 }}
                    gutterBottom
                >
                    Contact Information:
                </Typography>

                <ul>
                    <li>Email: [Contact Email]</li>
                    <li>Phone: [Contact Phone Number]</li>
                    <li>Address: [Company Address]</li>
                </ul>

                <Typography
                    component="p"
                    sx={{
                        typography: { xs: "body2", sm: "body1" },
                        fontWeight: "bold",
                    }}
                    color="primary.main"
                    mt={4}
                    gutterBottom
                >
                    Owner: [Owner&apos;s Name]
                </Typography>
            </Box>
        </div>
    );
}

export default Home;
