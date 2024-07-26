import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// Custom Components
import NoteCardSubHeader from "./NoteCardSubHeader";
import NoteCardAction from "./NoteCardAction";
import Paper from "@mui/material/Paper";

const NoteCard = ({
    id,
    title,
    createdAt,
    text,
    completed,
    ticket,
    username,
}) => {
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
                action={<NoteCardAction noteId={id} completed={completed} />}
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
                        fontStyle: "italic",
                        fontWeight: "bold",
                    }}
                >
                    Assigned to: {username}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoteCard;
