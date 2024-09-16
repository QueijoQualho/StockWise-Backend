import bunyan from "bunyan";
import BunyanFormat from "bunyan-format";

const logger = bunyan.createLogger({
  name: "TCC-Senai",
  streams: [
    {
      stream: BunyanFormat({ outputMode: "long" }),
    },
  ],
});

if (process.env.NODE_ENV === "test") {
  logger.level(bunyan.FATAL + 1);
}

export default logger;
