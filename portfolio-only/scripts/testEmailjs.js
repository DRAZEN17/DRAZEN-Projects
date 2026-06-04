const data = {
  service_id: 'service_mldbaqb',
  template_id: 'drazen',
  user_id: 'P74UmbnQ434eIiLET',
  template_params: {
    from_name: 'Test User',
    from_email: 'test@example.com',
    subject: 'API test',
    message: 'Hello from API test',
  },
};

async function run() {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const text = await res.text();
    console.log('status:', res.status);
    console.log('response:', text);
  } catch (err) {
    console.error('error:', err);
  }
}

run();
