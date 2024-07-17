import useNotesQuery from "../../hooks/UseNotesQuery";
import Spinner from "../../components/Spinner";
import Alert from "@mui/material/Alert";
import NoteCard from "../../components/notes/NoteCard";
import { Grid } from "@mui/material";

const Notes = () => {
    const { data, isLoading, error } = useNotesQuery();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    console.log(data);
    return (
        <>
            <Grid
                sx={{
                    flexGrow: 1,
                    justifyContent: {
                        xs: "center",
                        sm: "start",
                    },
                }}
                container
                spacing={2}
            >
                {data.map((note) => (
                    <Grid item key={note._id}>
                        <NoteCard
                            title={note.title}
                            createdAt={note.createdAt}
                            text={note.text}
                            completed={note.completed}
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Notes;
