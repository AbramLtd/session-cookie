const express = require('express');
const nanoid = require('nanoid');
const cookieSession = require('./');

const app = express();

app.use(cookieSession({
  keys: ['a', 'b', 'c'],
},
{
  signed: true,
}));

app.get('/', (req, res) => {
  if (!req.session) req.session = nanoid();
  res.end(`${req.session}`);
});

app.listen(3000);
