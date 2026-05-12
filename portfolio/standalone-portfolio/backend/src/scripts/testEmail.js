import 'dotenv/config';
import { sendMail } from '../utils/mailer.js';

(async () => {
  try {
    const to = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;
    if (!to) { console.error('No NOTIFY_EMAIL or SMTP_USER configured in .env'); process.exit(2); }
    console.log('Sending test email to', to);
    const res = await sendMail({ to, subject: 'Portfolio — Test email', html: '<p>This is a test email from the portfolio app.</p>' });
    console.log('sendMail result:', res);
    process.exit(0);
  } catch (err) {
    console.error('sendMail error:', err);
    process.exit(1);
  }
})();
