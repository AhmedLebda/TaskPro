import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
// Custom Components
import NoteCardSubHeader from "./NoteCardSubHeader";
import NoteCardAction from "./NoteCardAction";
import Paper from "@mui/material/Paper";
import { getUserRole } from "../../utils/AuthHelpers";
import { RequestedUser } from "../../config/types";

interface NoteCardProps {
    id: string;
    title: string;
    createdAt: string;
    text: string;
    completed: boolean;
    ticket: number;
    user: RequestedUser;
}

const NoteCard = ({
    id,
    title,
    createdAt,
    text,
    completed,
    ticket,
    user,
}: NoteCardProps) => {
    const noteOwnerRole = getUserRole(user.roles);

    return (
        <Card elevation={3}>
            <Paper
                elevation={0}
                sx={{
                    px: 2,
                    pt: 1,
                    color: "primary.main",
                    fontWeight: 900,
                }}
            >
                #{ticket}
            </Paper>
            <CardHeader
                action={
                    <NoteCardAction
                        noteId={id}
                        completed={completed}
                        user={user}
                    />
                }
                title={title}
                subheader={
                    <NoteCardSubHeader
                        createdAt={createdAt}
                        completed={completed}
                    />
                }
                sx={{ pt: 1 }}
            />
            <Divider />
            <CardContent>
                <Typography variant="body1" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>

            <CardContent>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        color: "primary.main",
                        textAlign: "right",
                        fontWeight: "bold",
                    }}
                >
                    Assigned to: {user.username}
                    <Box component="span" color="secondary.main" ml={1}>
                        ( {noteOwnerRole} )
                    </Box>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoteCard;
