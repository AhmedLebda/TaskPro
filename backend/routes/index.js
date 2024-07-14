import { Router } from "express";
const router = Router();

router.get("/", (req, res) => res.json({ title: "Home Page" }));

export default router;
