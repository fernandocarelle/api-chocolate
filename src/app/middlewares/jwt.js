const jwt = require('jsonwebtoken');
const {promisify} = require('util'); // para aceitar o await no verify linha 25 / Está entre {} para não importar a biblioteca toda
const logger = require('../../helper/logger');

module.exports = async (req, res, next) =>{
   //const authHeader = req.headers.authorization;
   const {authorization: authHeader} = req.headers; //desestruturado

    if(!authHeader){
        return res.status(401).json({erro: 'Token não enviado'});
    };

    const jwtParts = authHeader.split(' '); //array

    if(jwtParts.length != 2) {
        return res.status(401).json({erro: 'Token com formato inválido'});
    };

    const [Scheme, token] = jwtParts; // const prefixo = jwtParts[0]; const algumacoisa = jwtParts[1] ...
    

    if(Scheme != 'Bearer'){
        return res.status(401).json({erro: 'Token com prefixo inválido'});
    };

    // try catch = Estrutura de controles de erros / Se o try der errado, executa o catch
    
    try {
        const tokenDecoded = await promisify(jwt.verify)(
            token, 
            process.env.JWT_KEY,
        );
        return next(); // passar pro Controller
    }catch(error){
        logger.error(error);
        return res.status(401).json({ erro: 'Token com problema'});
    }

};