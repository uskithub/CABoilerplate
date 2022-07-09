import express from "express";
import { createServer  } from "vite";

export function setupViteServer(app: express.Application): Promise<express.Application> {
    // ミドルウェアモードで Vite サーバを作成
    return createServer({
        server: { middlewareMode: "html" }
    })
        .then(vite => {
            // vite の接続インスタンスをミドルウェアとして使用
            return app.use(vite.middlewares);
        });
}