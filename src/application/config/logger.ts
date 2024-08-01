import bunyan from 'bunyan';
import BunyanFormat from 'bunyan-format';

const logger = bunyan.createLogger({
  name: 'typeorm-template',
  streams: [
    {
      stream: BunyanFormat({ outputMode: 'long' }),
    },
  ],
});

export default logger;
