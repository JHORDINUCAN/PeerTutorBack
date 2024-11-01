import { Router } from "express";
import { getAlumnos, createAlumno, updateAlumno, deleteAlumno } from "../controllers/Alumno.js";

const router = Router();

router.get("/alumnos", getAlumnos); 
router.post("/alumnos", createAlumno); 
router.put("/alumnos/:idAlumno", updateAlumno); 
router.delete("/alumnos/:idAlumno", deleteAlumno); 

export default router;
