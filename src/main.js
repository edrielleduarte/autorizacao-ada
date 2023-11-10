const express = require('express');
const uuid = require('crypto');
const app = express();
const port = 9090;

app.use(express.json());

const Users = [];

const validacao = (req, res, next) => {
  const { userName } = req.body;

  const token = uuid.randomUUID();
  Users.push({ userName, token: token });
  next();
};

// app.get('/', validacao, (req, res) => {
//   res.send('Retornou!');
// });

app.post('/login', validacao, (req, res) => {
  const userName = req.body.userName;
  const user = Users.filter((user) => user.userName === userName);

  res.status(200).json(user);
});

app.get('/protegida', (req, res) => {
  const session = req.headers.autorizacao;
  const user = Users.filter((v) => v.token === session);

  if (user.length === 0) {
    return res.json('Usuário não encontrado');
  }

  if (user[0].token !== session || user.length === 0) {
    return res
      .status(401)
      .json({ mensagem: 'Você não esta autorizado, volte a rota de login!' });
  }

  res.status(200).json({ mensagem: 'Você está na rota protegida' });
});

app.listen(port, () => {
  console.log(`Servidor sendo executado na porta ${port}`);
});
