import Message from '../models/Message.js';
import Analytics from '../models/Analytics.js';
import { sendMail } from '../utils/mailer.js';

export const createMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });
  const doc = await Message.create({
    name, email, subject, message,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  });
  await Analytics.create({ type: 'contact_submit', refId: String(doc._id) });

  if (process.env.NOTIFY_EMAIL) {
    sendMail({
      to: process.env.NOTIFY_EMAIL,
      subject: `New contact: ${subject || 'No subject'}`,
      html: `<p><b>${name}</b> &lt;${email}&gt;</p><p>${message}</p>`,
    }).catch(() => {});
  }
  res.status(201).json({ ok: true, id: doc._id });
};

export const listMessages = async (_req, res) => {
  const data = await Message.find().sort('-createdAt');
  res.json({ data });
};

export const markRead = async (req, res) => {
  const m = await Message.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(m);
};

export const removeMessage = async (req, res) => {
  await Message.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
};
