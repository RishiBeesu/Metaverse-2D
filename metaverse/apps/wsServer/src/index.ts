import { WebSocketServer } from "ws";
import { User } from "./User";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT: number;
    }
  }
}

const wss = new WebSocketServer({ port: 3001 });

wss.on("connection", function connection(ws) {
  console.log("yser connected");
  let user = new User(ws);
  ws.on("error", console.error);

  ws.on("close", () => {
    user?.destroy();
  });
});
