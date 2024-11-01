import { Router } from "express";
import {getMateriasByTutor, getTutoresMaterias, assignMateriaToTutor, deleteTutorMateriaRelation } from "../controllers/TutoresMaterias.js";

const router = Router();

router.get("/tutores/:idTutores/materias", getMateriasByTutor);
router.get("/tutores-materias", getTutoresMaterias);
router.post("/tutores-materias", assignMateriaToTutor); 
router.delete("/tutores-materias/:idTutores/:idMaterias", deleteTutorMateriaRelation); 

export default router;
