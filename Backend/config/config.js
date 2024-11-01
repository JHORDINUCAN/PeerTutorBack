import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    trustServerCertificate: true,
    trustedConnection: false,
    enableArithAbort: true,
    instancename: process.env.DB_INSTANCE,
  },
  port: parseInt(process.env.DB_PORT)
};

const getConnection = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    console.log("Conexión a la base de datos exitosa");
    return pool;
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    throw error
  }
};

export { getConnection };
