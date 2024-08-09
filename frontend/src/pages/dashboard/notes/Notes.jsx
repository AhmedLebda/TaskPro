// MUI Components
import Spinner from "../../../components/general/Spinner";
import NoteCard from "../../../components/notes/NoteCard";
import Masonry from "@mui/lab/Masonry";
import Alert from "@mui/material/Alert";
// Custom Components
import ErrorAlert from "../../../components/general/ErrorAlert";
import CustomPagination from "../../../components/general/CustomPagination";
// Custom Hooks
import useNotes from "../../../hooks/ui/notes/useNotes";

const Notes = () => {
    const { allNotes, totalPages, isLoading, error } = useNotes();

    if (isLoading) {
        return <Spinner item="Notes" />;
    }

    if (error) {
        return (
            <ErrorAlert error={{ isVisible: true, message: error.message }} />
        );
    }

    if (!allNotes.length) {
        return <Alert severity="info">You don&apos;t have any notes</Alert>;
    }

    return (
        <>
            <Masonry columns={{ sm: 1, lg: 2, xl: 3 }} spacing={4}>
                {allNotes.map((note) => (
                    <NoteCard
                        key={note._id}
                        id={note._id}
                        title={note.title}
                        createdAt={note.createdAt}
                        text={note.text}
                        completed={note.completed}
                        ticket={note.ticket}
                        username={note.user.username}
                    />
                ))}
            </Masonry>
            <CustomPagination totalPages={totalPages} />
        </>
    );
};

export default Notes;
