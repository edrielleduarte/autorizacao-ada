const express = require('express');
const roomUiiid = require('crypto');
const app = express();
const port = 9090;

app.use(express.json());

const Users = [];

app.post('/login', (req, res) => {
  const { userName } = req.body;

  const token = roomUiiid.randomUUID();
  Users.push({ userName, token: token });

  res.status(200).json({ 'O token foi gerado com sucesso:': token });
});

app.get('/protegida', (req, res) => {
  const session = req.headers.autorizacao;
  const User = Users.filter((v) => v.token === session);

  if (User.length === 0 || session !== User[0].token) {
    return res
      .status(401)
      .json({ mensagem: 'Você não esta autorizado, volte a rota de login!' });
  }

  res.status(200).json({ mensagem: 'Você está na rota protegida' });
});

app.listen(port, () => {
  console.log(`Servidor sendo executado na porta ${port}`);
});
