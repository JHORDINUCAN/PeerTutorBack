import { getConnection } from "../config/config.js";
import sql from 'mssql';
import Joi from 'joi';

// Esquema de validación para los tutores
const tutorSchema = Joi.object({
    NombreT: Joi.string().min(1).max(100).required(),
    ApellidoT: Joi.string().min(1).max(100).required(),
    EmailT: Joi.string().email().required(),
    Turno: Joi.boolean().required(),
    FechaRegistro: Joi.date().required()
});

// READ - Obtener todos los tutores
const getAllTutores = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT idTutores, NombreT, ApellidoT FROM Tutores");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al obtener tutores" });
    }
};

// READ - Obtener todos los tutores
const getTutores = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Tutores");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// CREATE - Crear un nuevo tutor
const createTutor = async (req, res) => {
    const { error } = tutorSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { NombreT, ApellidoT, EmailT, Turno, FechaRegistro } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('NombreT', sql.VarChar, NombreT)
            .input('ApellidoT', sql.VarChar, ApellidoT)
            .input('EmailT', sql.VarChar, EmailT)
            .input('Turno', sql.Bit, Turno)
            .input('FechaRegistro', sql.DateTime, FechaRegistro)
            .query(`INSERT INTO Tutores (NombreT, ApellidoT, EmailT, Turno, FechaRegistro) 
                    VALUES (@NombreT, @ApellidoT, @EmailT, @Turno, @FechaRegistro)`);
        
        res.status(201).json({ message: "Tutor creado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// UPDATE - Actualizar un tutor existente
const updateTutor = async (req, res) => {
    const { idTutores } = req.params;
    const { error } = tutorSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { NombreT, ApellidoT, EmailT, Turno, Materias_idMateria, FechaRegistro } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NombreT', sql.VarChar, NombreT)
            .input('ApellidoT', sql.VarChar, ApellidoT)
            .input('EmailT', sql.VarChar, EmailT)
            .input('Turno', sql.Bit, Turno)
            .input('Materias_idMateria', sql.Int, Materias_idMateria)
            .input('FechaRegistro', sql.DateTime, FechaRegistro)
            .input('idTutores', sql.Int, idTutores)
            .query(`UPDATE Tutores 
                    SET NombreT = @NombreT, ApellidoT = @ApellidoT, EmailT = @EmailT, Turno = @Turno, Materias_idMateria = @Materias_idMateria, FechaRegistro = @FechaRegistro 
                    WHERE idTutores = @idTutores`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Tutor no encontrado" });
        }

        res.status(200).json({ message: "Tutor actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// DELETE - Eliminar un tutor
const deleteTutor = async (req, res) => {
    const { idTutores } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('idTutores', sql.Int, idTutores)
            .query("DELETE FROM Tutores WHERE idTutores = @idTutores");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Tutor no encontrado" });
        }

        res.status(200).json({ message: "Tutor eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

export {getAllTutores, getTutores, createTutor, updateTutor, deleteTutor };
