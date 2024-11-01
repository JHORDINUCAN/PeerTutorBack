import { getConnection } from "../config/config.js";
import sql from 'mssql';
import Joi from 'joi';
import { enviarCorreo } from '../config/mailer.js';

const alumnoSchema = Joi.object({
    NombreCompAlum: Joi.string().min(3).max(100).required(),
    GrupoAlum: Joi.string().min(1).max(10).required(),
    NumeroAlum: Joi.string().min(1).max(15).required(),
    Tutores_idTutores: Joi.number().integer().required()
});

const getAlumnos = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query("SELECT * FROM Alumno");
        res.status(200).json(result.recordset);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// CREATE - Crear un nuevo alumno y enviar correo al tutor
const createAlumno = async (req, res) => {
    const { error } = alumnoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { NombreCompAlum, GrupoAlum, NumeroAlum, Tutores_idTutores } = req.body;

    try {
        const pool = await getConnection();
        await pool.request()
            .input('NombreCompAlum', sql.VarChar, NombreCompAlum)
            .input('GrupoAlum', sql.VarChar, GrupoAlum)
            .input('NumeroAlum', sql.VarChar, NumeroAlum)
            .input('Tutores_idTutores', sql.Int, Tutores_idTutores)
            .query(`INSERT INTO Alumno (NombreCompAlum, GrupoAlum, NumeroAlum, Tutores_idTutores) 
                    VALUES (@NombreCompAlum, @GrupoAlum, @NumeroAlum, @Tutores_idTutores)`);

        // Obtener el correo del tutor y la materia seleccionada
        const tutorData = await pool.request()
            .input('idTutores', sql.Int, Tutores_idTutores)
            .query(`SELECT T.EmailT, M.NombreMateria 
                    FROM Tutores T
                    INNER JOIN Tutores_Materias TM ON T.idTutores = TM.idTutores
                    INNER JOIN Materias M ON TM.idMaterias = M.idMateria
                    WHERE T.idTutores = @idTutores`);

        if (tutorData.recordset.length > 0) {
            const tutorEmail = tutorData.recordset[0].EmailT;
            const materiaNombre = tutorData.recordset[0].NombreMateria;

            // Enviar el correo al tutor usando la función de mailer.js
            await enviarCorreo(tutorEmail, NombreCompAlum, materiaNombre);
        }

        res.status(201).json({ message: "Alumno registrado y correo enviado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al registrar alumno o enviar correo" });
    }
};


// UPDATE - Actualizar un alumno existente
const updateAlumno = async (req, res) => {
    const { idAlumno } = req.params;
    const { error } = alumnoSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    const { NombreCompAlum, GrupoAlum, NumeroAlum, Tutores_idTutores } = req.body;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('NombreCompAlum', sql.VarChar, NombreCompAlum)
            .input('GrupoAlum', sql.VarChar, GrupoAlum)
            .input('NumeroAlum', sql.VarChar, NumeroAlum)
            .input('Tutores_idTutores', sql.Int, Tutores_idTutores)
            .input('idAlumno', sql.Int, idAlumno)
            .query(`UPDATE Alumno 
                    SET NombreCompAlum = @NombreCompAlum, GrupoAlum = @GrupoAlum, NumeroAlum = @NumeroAlum, Tutores_idTutores = @Tutores_idTutores 
                    WHERE idAlumno = @idAlumno`);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        res.status(200).json({ message: "Alumno actualizado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

// DELETE - Eliminar un alumno
const deleteAlumno = async (req, res) => {
    const { idAlumno } = req.params;

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('idAlumno', sql.Int, idAlumno)
            .query("DELETE FROM Alumno WHERE idAlumno = @idAlumno");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: "Alumno no encontrado" });
        }

        res.status(200).json({ message: "Alumno eliminado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error de servidor" });
    }
};

export { getAlumnos, createAlumno, updateAlumno, deleteAlumno };
