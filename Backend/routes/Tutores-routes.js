import { Router } from "express";
import {getAllTutores, getTutores, createTutor, updateTutor, deleteTutor } from "../controllers/Tutores.js";

const router = Router();

router.get("/alltutores", getAllTutores);
router.get("/tutores", getTutores);
router.post("/tutores", createTutor);
router.put("/tutores/:idTutores", updateTutor);
router.delete("/tutores/:idTutores", deleteTutor);

export default router;
