const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.post('/message', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { nom, message } = req.body;
  const data = {
    nom,
    message,
    ip,
    date: new Date().toISOString()
  };
  fs.appendFileSync('messages.json', JSON.stringify(data) + ',\n');
  res.send("OK");
});

app.get('/admin', (req, res) => {
  const pass = req.query.pass;
  if (pass !== 'motdepasse123') return res.status(401).send("Accès refusé");
  const messages = fs.existsSync('messages.json') ? fs.readFileSync('messages.json', 'utf8') : 'Aucun message.';
  res.send(`<h1>Messages reçus</h1><pre>${messages}</pre>`);
});

app.listen(PORT, () => console.log("Serveur actif sur http://localhost:" + PORT));
