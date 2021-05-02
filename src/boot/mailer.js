const ejs = require('ejs');
const fs = require('fs');
const { utilities } = global;

const bootstrapMailer = () => {
    const { main_config, logger, env } = utilities;
    const emailConfigs = main_config.email;

    const { Mailer } = utilities.models;

    /**
     * #env MAILGUN_API_KEY
     */
    const mailgun = require('mailgun-js')({
        apiKey: env.MAILGUN_API_KEY,
        domain: emailConfigs.domain
    });

    const sendMail = async (recipients, subject, message, is_html = false, template = null, recipient_variables = null, attachment = null) => {
        const mail_options = {
            from: emailConfigs.from,
            to: recipients,
            subject,
        };

        /**
         * If recipient variables are set,
         * treat it as bulk mail
         */
        if (recipient_variables) {
            Object.assign(mail_options, { 'recipient-variables': recipient_variables });
        }

        /**
         * Rendering mail with EJS templates
         */
        if (template) {
            template = fs.readFileSync(template, { encoding: 'utf-8' });
            message = ejs.render(template, { value: message });
        }

        /**
         * Attachments along with mail
         * Should be of type: filepath = path.join(__dirname, 'sample.jpg');
         */
        if (attachment) {
            Object.assign(mail_options, attachment);
        }

        /**
         * Send mail as plaintext or html
         */
        if (is_html) {
            Object.assign(mail_options, { html: message });
        } else {
            Object.assign(mail_options, { text: message });
        }

        /**
         * Send emails in testmode
         */
        if (emailConfigs.testmode) {
            Object.assign(mail_options, { "o:testmode": true });
        }

        const dbPayload = {
            from: mail_options.from,
            to: (typeof mail_options.to == "object") ? JSON.stringify(mail_options.to) : mail_options.to,
            subject: mail_options.subject,
            testmode: emailConfigs.testmode,
        };

        mailgun.messages().send(mail_options, async function (error, body) {
            if (error) {
                logger.error(`bootMailer> Error in sending mail: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
            } else {
                dbPayload.mailgun_message_id = body.id;
                dbPayload.mailgun_message_text = body.message;
                if (recipient_variables) dbPayload.additional = JSON.stringify(recipient_variables);
                await new Mailer(dbPayload).save();
                logger.info(`bootMailer> ${JSON.stringify(body)}`);
            }
            return;
        });
    }

    return { sendMail };
}

module.exports = bootstrapMailer;