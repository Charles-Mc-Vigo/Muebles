const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.generateVerificationCode = () => {
	return crypto.randomInt(100000, 1000000).toString();
};

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.SENDER_EMAIL,
		pass: process.env.SENDER_PASSWORD,
	},
});

const APP_NAME = "Muebles App";

exports.sendVerificationEmail = async (userEmail, verificationCode) => {
	const mailOptions = {
		from: `${APP_NAME} <${process.env.EMAIL}>`,
		to: userEmail,
		subject: "Your Verification Code",
		text: `Dear User,\n\nThank you for registering with ${APP_NAME}. To complete your account setup, please verify your email address by entering the verification code below:\n\nVerification Code: ${verificationCode}\n\nIf you did not request this code or have any concerns, feel free to contact our support team.\n\nBest regards,\n${APP_NAME} Team`,
		html: `<p>Dear ${userEmail},</p>
               <p>Thank you for registering with <strong>${APP_NAME}</strong>. To complete your account setup, please verify your email address by entering the verification code below:</p>
               <p><strong>Verification Code:</strong> ${verificationCode}</p>
               <p>If you did not request this code or have any concerns, feel free to contact our support team.</p>
               <p>Best regards,<br>${APP_NAME} Team</p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.response);
	} catch (error) {
		console.error("Error sending email:", error);
	}
};

exports.sendPasswordResetVerificationCode = async (
	userEmail,
	verificationCode
) => {
	const mailOptions = {
		from: `${APP_NAME} <${process.env.EMAIL}>`,
		to: userEmail,
		subject: "Your Password-reset Verification Code",
		text: `Dear User,\n\nWe received a request to reset your password for your ${APP_NAME} account. Please use the following verification code to proceed with resetting your password:\n\nPassword Reset Code: ${verificationCode}\n\nIf you did not request this password reset, please contact our support team immediately.\n\nBest regards,\n${APP_NAME} Team`,
		html: `<p>Dear ${userEmail},</p>
               <p>We received a request to reset your password for your <strong>${APP_NAME}</strong> account. Please use the following verification code to proceed with resetting your password:</p>
               <p><strong>Password Reset Code:</strong> ${verificationCode}</p>
               <p>If you did not request this password reset, please contact our support team immediately.</p>
               <p>Best regards,<br>${APP_NAME} Team</p>`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.response);
	} catch (error) {
		console.error("Error sending email:", error);
	}
};
