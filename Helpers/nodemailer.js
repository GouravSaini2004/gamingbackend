const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'mrgoravsainimrt@gmail.com',
        pass: 'kcayjiwpvrhmviqx'
    },
    tls: { rejectUnauthorized: false }
});

module.exports = transporter