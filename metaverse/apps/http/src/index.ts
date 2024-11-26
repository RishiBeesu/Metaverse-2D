import express from "express";
import { rootRouter } from "./routes/v1";
import "dotenv/config";

// Create environment variable types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      JWT_SECRET: string;
      PORT: number;
    }
  }
  namespace Express {
    interface Request {
      role?: "Admin" | "User";
      userId?: string;
    }
  }
}

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
