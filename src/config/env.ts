import dotenv from "dotenv";

dotenv.config();

const {
  NODE_ENV,
  PORT,
  TYPEORM_HOST,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_PORT,
} = process.env;

const env = {
  nodeEnv: String(NODE_ENV),
  port: Number(PORT),
  typeorm: {
    host: String(TYPEORM_HOST),
    username: String(TYPEORM_USERNAME),
    password: String(TYPEORM_PASSWORD),
    database: String(TYPEORM_DATABASE),
    port: Number(TYPEORM_PORT)
  },
};

export default env;
