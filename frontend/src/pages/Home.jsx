import { Box, Link, Typography } from "@mui/material";

function Home() {
    return (
        <div>
            <Typography
                component="h1"
                sx={{ typography: { xs: "h5", sm: "h4", md: "h3" } }}
                mb={4}
            >
                Welcome to Dan D. Repairs!
            </Typography>

            <Box>
                <Typography
                    component="p"
                    sx={{ typography: { xs: "body2", sm: "body1" } }}
                    gutterBottom
                >
                    Located in Beautiful Downtown Foo City, Dan D. Repairs
                    provides a trained staff ready to meet your tech repair
                    needs.
                </Typography>
                <Typography
                    component="address"
                    sx={{ fontStyle: "normal" }}
                    gutterBottom
                >
                    <Box>Dan D. Repairs</Box>
                    <Box>555 Foo Drive</Box>
                    <Box>Foo City, CA 12345</Box>
                    <Box>
                        <Link href="tel:+1555555-5555">(555) 555-5555</Link>
                    </Box>
                </Typography>

                <Typography
                    component="p"
                    sx={{
                        typography: { xs: "body2", sm: "body1" },
                        fontWeight: "bold",
                    }}
                    color="text.secondary"
                    mt={4}
                    gutterBottom
                >
                    Owner: Dan Davidson
                </Typography>
            </Box>
        </div>
    );
}

export default Home;
