// MUI Components
import Spinner from "../../../components/Spinner";
import NoteCard from "../../../components/notes/NoteCard";
import Grid from "@mui/material/Grid";
import Masonry from "@mui/lab/Masonry";
import Alert from "@mui/material/Alert";
// Custom Components
import ErrorAlert from "../../../components/general/ErrorAlert";
// Custom Hooks
import useNotes from "../../../hooks/ui/notes/useNotes";

const Notes = () => {
    const { sortedNotes, isLoading, error } = useNotes();

    if (isLoading) {
        return <Spinner item="Notes" />;
    }

    if (error) {
        return (
            <ErrorAlert error={{ isVisible: true, message: error.message }} />
        );
    }

    if (!sortedNotes.length) {
        return <Alert severity="info">You don&apos;t have any notes</Alert>;
    }

    return (
        <>
            <Grid
                sx={{
                    justifyContent: {
                        xs: "center",
                        sm: "start",
                    },
                }}
                container
                spacing={0}
            >
                <Masonry columns={{ xs: 1, md: 2, lg: 3, xl: 4 }} spacing={3}>
                    {sortedNotes.map((note) => (
                        <Grid item key={note._id}>
                            <NoteCard
                                id={note._id}
                                title={note.title}
                                createdAt={note.createdAt}
                                text={note.text}
                                completed={note.completed}
                                ticket={note.ticket}
                                username={note.user.username}
                            />
                        </Grid>
                    ))}
                </Masonry>
            </Grid>
        </>
    );
};

export default Notes;
