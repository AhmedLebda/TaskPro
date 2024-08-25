import { Router } from "express";
import NoteControllers from "../controllers/noteControllers";
import requireAccessToken from "../middlewares/auth/requireAccess";
import requireManagerialRole from "../middlewares/auth/requireManagerialAccess";
import checkNotePermission from "../middlewares/notes/checkNotePermissions";
import checkUserAssignPermissions from "../middlewares/notes/checkUserAssignPermissions";
import validateNoteUpdateInput from "../middlewares/notes/validateNoteUpdateInput";
import paginationSorting from "../middlewares/notes/paginationSorting";

const router = Router();

const notesListMiddlewares = [requireManagerialRole, paginationSorting];
const noteUpdateMiddlewares = [
    checkNotePermission,
    checkUserAssignPermissions,
    validateNoteUpdateInput,
];
const noteDeleteMiddlewares = [requireManagerialRole, checkNotePermission];

router.use(requireAccessToken);

router
    .route("/")
    .get(notesListMiddlewares, NoteControllers.notes_list)
    .post(checkUserAssignPermissions, NoteControllers.note_create)
    .patch(noteUpdateMiddlewares, NoteControllers.note_update)
    .delete(noteDeleteMiddlewares, NoteControllers.note_delete);

router.get("/:targetUserId", paginationSorting, NoteControllers.user_notes);

export default router;
