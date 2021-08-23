require('dotenv').config();
import bunyan from "bunyan"

const loggers ={
    'development' : () => bunyan.createLogger({name : 'development',level: 'debug'}),
    'production' : () => bunyan.createLogger({name : 'production',level: 'info'}),
    'test' : () => bunyan.createLogger({name : 'test',level: 'fatal'}), 
  }

  export default {
    development: {
      sitename: 'Tic-tac-toe [Development]',
      log: loggers.development,
    },
    production: {
      sitename: 'Tic-tac-toe [Production]',
      log: loggers.production,
    },
    test: {
      sitename: 'Tic-tac-toe [Test]',
      log: loggers.test,
    }
  };