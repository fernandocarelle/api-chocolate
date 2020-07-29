const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

class UserController{

    //POST - CRIAR USUÁRIO
    async store(req, res){

        const user = await userModel.create(req.body);

        user.pass = undefined; // não aparece a senha criptografada na resposta, pois é desnecessário, acupa espaço e por questão de segurança.

        return res.status(201).json({ user });
    }

    // DELETE - DELETAR USUÁRIO
    async destroy(req, res){
        const { id } = req.params;
        await userModel.findByIdAndDelete(id);
        return res.json({ msg: 'Usuário Deletado' });
    }

    // PUT - ATUALIZAR USUÁRIO
    async update(req, res){

        const {id} = req.params;

        delete req.body.pass;

        const user = await userModel.findOneAndUpdate(id, req.body, {
            new: true,
        });

        user.pass = undefined;

        return res.json({ user });
    }

    // GET com ID - LISTAR 1 USUÁRIO
    async show(req, res){
        const {id} = req.params;
        const user = await userModel.findById(id);
        return res.json({ user });
    }

    // GET COM TODOS USUÁRIOS
    async index(req, res){
        const users = await userModel.find();
        return res.json({ users });
    }

    // LOGIN
    async auth(req, res){
        const {email, pass} = req.body;

        const user = await userModel.findOne({ email }); // email:email o JS entende por ser nomes iguais // email é um filtro para encontrar o usuário
        
        if(!user){
            console.log(`email: ${email} não existe`); //informa no console o email digitado, para saber internamente.
            return res.status(401).json({msg: "Credenciais inválidas"});
        }

        const corretUse = await bcrypt.compare(pass, user.pass);
        
        //função do bcrypt para comparar senha - ! diferente
        if(!corretUse){ 
            console.log(`email: ${email} está errando a senha`);
            return res.status(401).json({ msg: "Credenciais inválidas"});
        };

        const { _id: id } = user;
                                     //mudar a senha quando publicar a api   
        const token = jwt.sign({id}, process.env.JWT_KEY, {
            expiresIn: '10d', // validade do token / 1d = 1 dia / 1h = 1 hora ...
        });

        return res.json({ token });
    }
}

module.exports = new UserController();