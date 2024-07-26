import useNotesQuery from "../../../hooks/notes/useNotesQuery";
import Spinner from "../../../components/Spinner";
import Alert from "@mui/material/Alert";
import NoteCard from "../../../components/notes/NoteCard";
import { Grid } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { useSearchParams } from "react-router-dom";
import useAuthContext from "../../../hooks/auth/useAuthContext";

const Notes = () => {
    const { data, isLoading, error } = useNotesQuery();
    const { getUserData } = useAuthContext();
    const userId = getUserData().id;
    const [searchParams] = useSearchParams();
    const view = searchParams.get("view");
    const sortedNotesData =
        view === "all"
            ? data?.sort((note) => (note.completed ? 1 : -1))
            : data
                  ?.filter((note) => note.user._id === userId)
                  .sort((note) => (note.completed ? 1 : -1));

    if (isLoading) {
        return <Spinner item="Notes" />;
    }

    if (error) {
        return <Alert severity="error">Error: {error.message}</Alert>;
    }

    if (!sortedNotesData.length) {
        return <Alert severity="info">You don&apos;t have any notes</Alert>;
    }
    console.log(data);
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
                    {sortedNotesData.map((note) => (
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
