const nodemailer = require('nodemailer');
const crypto = require('crypto');

exports.generateVerificationCode = () => {
    return crypto.randomInt(100000, 1000000).toString();
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_PASSWORD
    }
});

const APP_NAME = 'Muebles App'

exports.sendVerificationEmail = async (userEmail, verificationCode) => {
    const mailOptions = {
        from: `${APP_NAME} <${process.env.EMAIL}>`, 
        to: userEmail,
        subject: 'Your Verification Code',
        text: `Your verification code is ${verificationCode}. Please use this code to verify your account.`,
        html: `<p>Your verification code is <strong>${verificationCode}</strong>. Please use this code to verify your account.</p><p>This is just a test email for verification purposes.</p>`
    };

    try {
        const info = await transporter.sendMail(mailOptions); 
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
