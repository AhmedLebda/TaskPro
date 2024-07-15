import { Router } from "express";
import NoteControllers from "../controllers/noteControllers.js";

const router = Router();

router
    .route("/")
    .get(NoteControllers.notes_list)
    .post(NoteControllers.note_create)
    .patch(NoteControllers.note_update)
    .delete(NoteControllers.note_delete);

export default router;
