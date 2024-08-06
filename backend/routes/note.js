import { Router } from "express";
import NoteControllers from "../controllers/noteControllers.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";
import requireManagerialRole from "../middlewares/auth/requireManagerialAccess.js";
import noteCreationPermissions from "../middlewares/notes/noteCreationPermissions.js";

const router = Router();

router.use(requireAccessToken);

router
    .route("/")
    .get(NoteControllers.notes_list)
    .post(noteCreationPermissions, NoteControllers.note_create)
    .patch(NoteControllers.note_update)
    .delete(requireManagerialRole, NoteControllers.note_delete);

export default router;
