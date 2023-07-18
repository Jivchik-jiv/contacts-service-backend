import { Injectable } from '@nestjs/common';
import * as Mailgen from 'mailgen';
import * as sgMail from '@sendgrid/mail';
import * as dotenv from 'dotenv';
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

@Injectable()
export class EmailService {
  #mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      // Appears in header & footer of e-mails
      name: 'Contacts Service',
      link: 'http://localhost:3000',
    },
  });

  #createEmail = (verifyToken: string, userName: string) => {
    const email = {
      body: {
        name: userName,
        intro:
          "Welcome to Contacts Service! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with Contacts Service, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `http://localhost:3000/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    return this.#mailGenerator.generate(email);
  };

  sendEmail = (verifyToken: string, userName: string, email: string) => {

    const emailBody = this.#createEmail(verifyToken, userName);
    console.log("🚀 ~ file: email.service.ts:44 ~ EmailService ~ verifyLink:", `http://localhost:3000/users/verify/${verifyToken}`)

    const msg = {
      to: email,
      from: 'oleoli.pro@gmail.com',
      subject: 'Email confirmation for Contacts Service',
      html: emailBody,
    };

    return sgMail.send(msg);
  };
}
