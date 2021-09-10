const express = require('express');

const app = express();

app.get('/', (_req: any, res: any) => {
  res.send('TESTE DOCKER');
});

app.listen(3000);
