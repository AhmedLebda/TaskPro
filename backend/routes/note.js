import { Router } from "express";
import NoteControllers from "../controllers/noteControllers.js";
import requireAccessToken from "../middlewares/auth/requireAccess.js";

const router = Router();

router.use(requireAccessToken);

router
    .route("/")
    .get(NoteControllers.notes_list)
    .post(NoteControllers.note_create)
    .patch(NoteControllers.note_update)
    .delete(NoteControllers.note_delete);

export default router;
