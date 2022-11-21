
import nodemailer from "nodemailer";

function reportError(errormessage: Error) {

    const sender = "apc.errors@gmail.com";
    const receiver = sender;
    const pass = process.env.EMAIL_PASS;
    const subjectSuffix = "Push Render";

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: sender,
            pass: pass
        }
    });
    var mailOptions = {
        from: sender,
        to: receiver,
        subject: `Error Message - ${subjectSuffix}`,
        text: `
        Timestamp = ${Date.now()} | ${new Date().toISOString()} 
        ${errormessage.stack}
        `,
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

export function enableReporting() {
    if (!process.env.EMAIL_PASS) {
        console.error("EMAIL_PASS not set in .env file");
        process.exit(1);
    }

    process.on('uncaughtException', function (exception) {
        reportError(exception);
    });
}