import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail= async (options)=>{
    const mailGenerator = new Mailgen({
        theme:"default",
        product:{
            name:"task manager",
            link:"https://taskmangerlink.com"
        }
    })

    const emailTextual=mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml=mailGenerator.generate(options.mailgenContent)

     const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_SMTP_USER,
            pass:process.env.MAILTRAP_SMTP_PASS
        }
    })
    const mail ={
        from:"mail.taskmanager@example.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHtml
    }

    try{
        await transporter.sendMail(mail)
    }catch(error){
        console.error("email service faild check ur mailtrao credential in .env file")
        console.error(error)
    }

}


const emailVerificationMailgenContent=(username,verficationUrl)=>{
    return {
        body:{
            name:username,
            intro:"Welcom to our app!we are happy to have you.",
            action:{
                instructions:"to verify your email please click on the following button",
                button:{
                    color:"#1aae5a",
                    text:"Verify your email",
                    link:verficationUrl
                }
            },
            outro:"need help ,or have quesions? just reply to this email. we'd love to help"
        }
    }
}

const forgetPasswordMailgenContent=(username,passwordResetUrl)=>{
    return {
        body:{
            name:username,
            intro:"We got a request to reset the password of your account",
            action:{
                instructions:"to reset you password please click on the following button",
                button:{
                    color:"#2f1da8",
                    text:"Verify your email",
                    link:passwordResetUrl
                }
            },
            outro:"need help ,or have quesions? just reply to this email. we'd love to help"
        }
    }
}

const contactMailgenContent = ({ name, email, message }) => {
    return {
        body: {
            name: "Admin",
            intro: `You received a new contact form message.`,
            table: {
                data: [
                    { key: "Name", value: name },
                    { key: "Email", value: email }
                ]
            },
            outro: message
        }
    }
}

const contactReplyMailgenContent = ({ name, reply }) => {
    return {
        body: {
            name,
            intro: "Thanks for reaching out. Here is our response:",
            outro: reply
        }
    }
}



export{
    emailVerificationMailgenContent,
    forgetPasswordMailgenContent,
    contactMailgenContent,
    contactReplyMailgenContent,
    sendEmail
}