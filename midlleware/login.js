const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
 console.log("teste->"+req.headers.token)
    try{
       
            const decode = jwt.verify(req.headers.token,"palavradificil");
    
        req.usuario=decode;
        next();
    }catch(error){
        return res.status(401).send({mensagem:"falha na autenticação"})
    }



}