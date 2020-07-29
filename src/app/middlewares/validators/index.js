const yup = require('yup');

class Validators{
    async userCreateValidator(req, res, next){
        const userMask = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            pass: yup.string().required()
        });

        const userValidate = await userMask.isValid(req.body);

        if(!userValidate){
            return res.status(400).json({ msg: 'Dados incorretos'});
        };
        next();
    }

    async userUpdateValidator(req, res, next){
        const userMask = yup.object().shape({
            name: yup.string(),
            email: yup.string().email(),
        });

        const userValidate = await userMask.isValid(req.body, { strict: true });

        if(!userValidate){
            return res.status(400).json({ msg: 'Dados incorretos'});
        };

        next();
    }
}

module.exports = new Validators();