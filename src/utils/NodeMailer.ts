import * as nodeMailer from 'nodemailer';
import * as SendGrid from 'nodemailer-sendgrid-transport';
import {api_key} from './NodeMailerApiKey'

export class NodeMailer{
    
    private static initializeTransport(){
        return nodeMailer.createTransport(SendGrid({
            auth : {
                api_key : api_key
            }
         } ));

    }

    static sendEmail(data:{to:[string],subject:string,html:string}): Promise<any> {
      return  NodeMailer.initializeTransport().sendMail({
            from:'abc@gmail.com',
            to:data.to,
            subject:data.subject,
            html:data.html})
    }
}
