const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host: 'smtp.gmail.com', port: 587, etc.
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS  // Your App Password (NOT your normal password)
    }
});

const sendEmail = async (to, resetLink) => {
    const mailOptions = {
        from: '"Spent.io Support" <noreply@spent.io>',
        to: to,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4f46e5;">Reset Your Password</h2>
                <p>You requested a password reset for your Spent.io account.</p>
                <p>Click the button below to set a new password. This link expires in 15 minutes.</p>
                <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p style="margin-top: 20px; font-size: 12px; color: #888;">If you did not request this, please ignore this email.</p>
            </div>
        `
    };

    return await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;