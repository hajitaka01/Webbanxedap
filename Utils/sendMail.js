const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "your_mailtrap_username",  // Thay thế bằng thông tin thực tế
        pass: "your_mailtrap_password",  // Thay thế bằng thông tin thực tế
    },
});

module.exports = {
    sendmail: async function (to, subject, text, html) {
        return await transporter.sendMail({
            to: to,
            from: "bikeshop@example.com",  // Thay đổi thành email thực tế
            subject: subject,
            text: text,
            html: html || `<a href="${text}">Đặt lại mật khẩu</a>`
        })
    }
}