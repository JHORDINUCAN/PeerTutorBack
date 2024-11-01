import { getConnection } from "../config/config.js";
import sql from 'mssql';
import Joi from 'joi';

const tutoresMateriasSchema = Joi.object({
    idTutores: Joi.number().integer().required(),
    idMaterias: Joi.number().integer().required()
});

// READ - Obtener las materias de un tutor específico
const getMateriasByTutor = async (req, res) => {
    const { idTutores } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('idTutores', sql.Int, idTutores)
            .query(`
                SELECT M.NombreMateria 
                FROM Tutores_Materias TM
                INNER JOIN Materias M ON TM.idMaterias = M.idMateria
                WHERE TM.idTutores = @idTutores
            `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener materias del tutor" });
    }
};



// READ - Obtener todas las relaciones de tutores y materias
const getTutoresMaterias = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Tutores_Materias");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// CREATE - Asignar una materia a un tutor
const assignMateriaToTutor = async (req, res) => {
    const { error } = tutoresMateriasSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { idTutores, idMaterias } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('idTutores', sql.Int, idTutores)
            .input('idMaterias', sql.Int, idMaterias)
            .query(`INSERT INTO Tutores_Materias (idTutores, idMaterias) 
                    VALUES (@idTutores, @idMaterias)`);
        
        res.status(201).json({ message: "Materia asignada al tutor exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// DELETE - Eliminar la relación entre un tutor y una materia
const deleteTutorMateriaRelation = async (req, res) => {
    const { idTutores, idMaterias } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('idTutores', sql.Int, idTutores)
            .input('idMaterias', sql.Int, idMaterias)
            .query("DELETE FROM Tutores_Materias WHERE idTutores = @idTutores AND idMaterias = @idMaterias");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Relación no encontrada" });
        }

        res.status(200).json({ message: "Relación eliminada exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

export {getMateriasByTutor, getTutoresMaterias, assignMateriaToTutor, deleteTutorMateriaRelation };
