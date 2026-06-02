import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

async function run() {
  try {
    const login = await axios.post('http://localhost:5000/api/auth/login', { email: 'drazen90sea@gmail.com', password: 'draxly1790' });
    const token = login.data.token;
    console.log('token:', token ? 'received' : 'none');

    const form = new FormData();
    const filePath = 'C:/Users/Dazen17/Pictures/Saved Pictures/Drazen_Cyberpunk_Logo.jpg';
    form.append('image', fs.createReadStream(filePath));

    const res = await axios.post('http://localhost:5000/api/upload/image', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('upload response:', res.data);
  } catch (err) {
    console.error('error', err.response?.data || err.message);
    process.exit(1);
  }
}

run();
