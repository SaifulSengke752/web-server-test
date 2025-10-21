// server.js
require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const morgan = require('morgan');

const app = express();
const port = 3000;

app.use(express.json());
app.use(morgan('dev')); // logging request

// ====== Data User Dummy (anggap database) ======
const users = [
  { id: 1, username: 'admin', password: '12345' },
  { id: 2, username: 'user', password: 'password' }
];

// ====== Endpoint Login ======
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  // buat JWT token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login berhasil', token });
});

// ====== Middleware Autentikasi (JWT) ======
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: Token tidak ada' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token tidak valid' });
    req.user = user; // simpan payload token ke req
    next();
  });
};

// ====== ROUTES API ======

// Root endpoint (terproteksi)
app.get('/', authenticateToken, (req, res) => {
  res.send(`Congratulations! Your Express server is running. Port: ${port}`);
});

// GET API dengan parameter
app.get('/dummy-get/:guestName', authenticateToken, (req, res) => {
  const { guestName } = req.params;
  const { dresscode } = req.query;
  res.json({
    message: `This is a dummy GET API ${guestName}`,
    dresscode,
    user: req.user.username,
  });
});

// POST API
app.post('/dummy-post', authenticateToken, (req, res) => {
  const { body } = req;
  res.json({
    message: `This is a dummy POST API, you sent: ${JSON.stringify(body)}`,
    user: req.user.username,
  });
});

// DELETE API
app.delete('/dummy-delete/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  res.json({
    message: `Item with id ${id} has been deleted (dummy).`,
    user: req.user.username,
  });
});

// ====== Jalankan server ======
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
