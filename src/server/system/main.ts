import express, { RequestHandler } from 'express';
import { rootHandler } from './handlers';

import { createServer  } from 'vite';

import server from '@sh/service/infrastructure/$server';
// import { helloHandler } from '../../shared/service/handlers';
// import { helloHandler } from '@/shared/service/handlers';
import { helloHandler } from '@sh/service/handlers';

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

app.get('/api', rootHandler);
app.get('/hello/:name', helloHandler);

server(app, { basePath: "http://localhost:3000/" })




app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});