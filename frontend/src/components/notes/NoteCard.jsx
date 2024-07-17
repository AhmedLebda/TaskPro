import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// Custom Components
import NoteCardSubHeader from "./NoteCardSubHeader";
import NoteCardAction from "./NoteCardAction";
// Icons

const NoteCard = ({ title, createdAt, text, completed }) => {
    return (
        <Card elevation={3}>
            <CardHeader
                action={<NoteCardAction />}
                title={title}
                subheader={
                    <NoteCardSubHeader
                        createdAt={createdAt}
                        completed={completed}
                    />
                }
            />
            <Divider />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default NoteCard;
