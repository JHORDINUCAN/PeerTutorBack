import nodemailer from 'nodemailer';

async function enviarCorreoPrueba() {
    // Configuramos el transporte usando Gmail
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true para el puerto 465 (SSL)
        auth: {
            user: 'jhordinalexander2015@gmail.com', // Tu correo de Gmail
            pass: 'lofk ecij gnci yptr', // Contraseña o contraseña de aplicación de Gmail
        },
        logger: true,  // Habilitar logs para verificar la operación
        debug: true    // Modo debug para obtener más detalles
    });

    // Definir el correo que vamos a enviar
    let info = await transporter.sendMail({
        from: '"Prueba Nodemailer" <jhordinalexander2015@gmail.com>', // Remitente
        to: "tobybellota@gmail.com", // Destinatario
        subject: "Prueba de Nodemailer", // Asunto del correo
        text: "Este es un correo de prueba enviado usando Nodemailer y Gmail", // Cuerpo en texto plano
        html: "<b>Este es un correo de prueba enviado usando Nodemailer y Gmail</b>", // Cuerpo en HTML
    });

    console.log("Correo enviado: %s", info.messageId); // Mostrar el ID del mensaje en la consola
}

enviarCorreoPrueba().catch(console.error); // Ejecutar la función y manejar errores
