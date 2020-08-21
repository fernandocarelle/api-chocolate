require('dotenv').config();

const cors = require('cors');
const express = require('express');
require('express-async-errors');
const morgan = require("morgan");
const helmet = require('helmet');
const routes = require("./routes");
const logger = require('./helper/logger');

const path = require('path');

const app = express();

app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true })); //para receber arquivos

app.use(
  '/images',
  express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
);

app.use(morgan("dev"));
app.use(routes);

app.use((error, req, res, next) => {
    logger.error(error);
    return res.status(500).json({erro: 'Houve um erro na API'});
});

app.listen(process.env.PORT || 3000, () =>
logger.info(`API OK NA PORTA: ${process.env.PORT || 3000}`)
);


// process.env.PORT / Variável ambiente para evitar a troca de porta caso a 3000 não esteja disponível

//app.listen(3000, () => console.log("API 2 OK"));
