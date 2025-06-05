import nodemailer from 'nodemailer';
import { env } from 'hono/adapter'
import News from '../types/News';
import emailTemplate from '../template/newsMessage';
import { Context } from 'hono/dist/types/context';
import { BlankEnv, BlankInput } from 'hono/types';


// dontenv.config();

export default async function runSendEmail(article: News[], usersEmail : string, authObject : {user : string, pass : string}) {
    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: authObject.user,
        pass: authObject.pass
    },
    });
    const info = await transporter.sendMail({
        from: 'Tech Glimpse Newslatter',
        to: usersEmail,
        subject: "Daily Newslatter",
        html: emailTemplate(article)
    })

    return info
}

export const getEmail = async (c : Context<BlankEnv, "/email", BlankInput>) => {
    const {EMAIL} = env<{ EMAIL: string }>(c)
    
    return c.json(EMAIL)
}
