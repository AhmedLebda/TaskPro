import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Divider } from "@mui/material";

const About = () => {
    return (
        <Box>
            <Container>
                <Typography component="h1" variant="h2" gutterBottom>
                    About TaskPro
                </Typography>
                <Typography paragraph>
                    Welcome to TaskPro, a premier task and user management
                    solution designed specifically for small startup businesses.
                    My mission is to empower startups with a robust platform
                    that simplifies task management, enhances team
                    collaboration, and streamlines user information handling.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography component="h2" variant="h4" gutterBottom>
                    Key Features
                </Typography>
                <Box
                    component="ul"
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <li>
                        <b>Comprehensive Task Management:</b> The platform
                        allows regular users to create, track, and manage their
                        tasks effortlessly.
                    </li>
                    <li>
                        <b>Enhanced Manager Capabilities:</b> Managers can
                        assign tasks, oversee all activities, and handle user
                        information with advanced tools designed for optimal
                        team efficiency.
                    </li>
                    <li>
                        <b>Administrative Control:</b> Admin users have full
                        control over the system, including the ability to manage
                        all tasks and users, ensuring smooth and secure
                        operations.
                    </li>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography component="h2" variant="h4" gutterBottom>
                    Acknowledgements
                </Typography>
                <Typography paragraph>
                    I extend my gratitude to{" "}
                    <a href="https://www.youtube.com/@DaveGrayTeachesCode">
                        Dave Gray
                    </a>{" "}
                    for providing the foundational knowledge that inspired
                    TaskPro. His course was instrumental in shaping the core
                    principles of the application, which I&apos;ve built upon to
                    offer a more advanced and feature-rich platform.
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography component="h2" variant="h4" gutterBottom>
                    Get In Touch
                </Typography>
                <Typography paragraph>
                    I&apos;m excited to see how TaskPro can support your
                    business&apos;s growth. For more information or to connect
                    with me, feel free to check out my{" "}
                    <a href="https://github.com/AhmedLebda">GitHub profile</a>.
                </Typography>
            </Container>
        </Box>
    );
};

export default About;
