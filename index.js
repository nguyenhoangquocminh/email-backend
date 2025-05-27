const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Cấu hình transporter Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME, // Gmail của bạn
    pass: process.env.EMAIL_PASSWORD, // Mật khẩu app Gmail (App Password)
  },
});

app.post('/send-email', async (req, res) => {
  const { to_email, humidity } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: to_email,
    subject: 'Cảnh báo độ ẩm đất',
    html: `<p>Xin chào,</p>
           <p>Độ ẩm đất hiện tại là <strong>${humidity}</strong>%.</p>
           <p>Vì độ ẩm thấp hơn 50%, bạn nên bật máy bơm để tưới cây.</p>
           <p>Trân trọng,</p>
           <p>Hệ thống cảnh báo độ ẩm</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email đã gửi thành công' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).json({ success: false, message: 'Gửi email thất bại', error });
  }
});

app.get('/', (req, res) => {
  res.send('Backend Nodemailer đang chạy!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});
