import express, { RequestHandler } from 'express';
// import { rootHandler, helloHandler } from './handlers';

import { createServer  } from 'vite';

const app = express();
const port = process.env.PORT || '3000';

// ミドルウェアモードで Vite サーバを作成
createServer({
  server: { middlewareMode: 'html' }
})
.then(vite => {
  // vite の接続インスタンスをミドルウェアとして使用
  app.use(vite.middlewares);
});

// app.get('/', rootHandler);
// app.get('/hello/:name', helloHandler);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});