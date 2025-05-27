const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-email', async (req, res) => {
  const { to_email, humidity } = req.body;

  const data = {
    service_id: process.env.SERVICE_ID,
    template_id: process.env.TEMPLATE_ID,
    user_id: process.env.PUBLIC_KEY,  // đúng key gọi là user_id trong EmailJS API
    template_params: {
      to_email,
      humidity,
    },
  };

  try {
    const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', data);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error?.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error?.response?.data || error.message });
  }
});

app.get('/', (req, res) => {
  res.send('EmailJS backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
