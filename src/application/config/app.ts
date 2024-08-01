import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
// import routes from "./routes";

const app = express();

app.use(helmet());
app.use(compression({ level: 9 }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes(app);

export default app;
