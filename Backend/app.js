import express from "express";
import cors from "cors";
const app = express();
import tutoresRoutes from "./routes/Tutores-routes.js";
import alumnosRoutes from "./routes/Alumno-routes.js";
import tutoresmateriasRoutes from "./routes/TutoresMaterias-routes.js";

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(tutoresRoutes);
app.use(alumnosRoutes);
app.use(tutoresmateriasRoutes);

export default app;
