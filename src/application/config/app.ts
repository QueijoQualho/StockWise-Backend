import routes from "@routes/routes";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { setupSwagger } from "./swagger";
import path from "path";

const app = express();

app.use(helmet());
app.use(compression({ level: 9 }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "../../../uploads")));

routes(app);
setupSwagger(app);

export default app;
