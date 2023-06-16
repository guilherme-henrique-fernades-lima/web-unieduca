const express = require('express')
const router = express.Router()
const validator = require('validator');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const User = require('../../../Database/login/User');


//Rota de captura de usuario

router.get('/:id',async (req,res)=>{
    try {
        const id = req.params.id
        if (!isNaN(parseInt(id))) {
            const user = await User.findByPk(id)
            if (user != undefined) {
                res.json({id:user.id,nome:user.nome,email:user.email,status:user.status})
            }else{
                res.status(402).json({ erro: 'Dados não do usuário não identificado na base de dados!' })
            }
        }else{
            res.status(402).json({ erro: 'Ocorreu um erro durante o processamento dos dados, parametros inválidos!' })
        }
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

//Rota para inserir novo usuario

router.post('/', async (req, res) => {
    try {
        let { nome, status, email } = req.body
        if (nome != undefined && nome != '' && status != undefined && status != '' && email != undefined != '') {
            email = email.toLowerCase()
            status = (status == true || status == 'true') ? true : false

            if (!validator.isEmail(email)) {
                return res.status(400).json({ erro: 'Dados inválidos, e-mail informado reconhecido como inválido' })
            }
            const exist = await User.findOne({ where: { status: true, email: email } })
            if (exist != undefined) {
                return res.status(403).json({ erro: 'Já existe um usuário ativo com os dados informados' })
            }

            const senha = `aguia` + moment().format('DDHHMMmm')
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(senha, salt);

            const existUser = await User.findOne({where:{status:true}})
            status = (existUser == undefined)?true:status

            const adm = await User.create({
                nome: nome,
                status: status,
                email: email,
                senha: hash,
            })
            res.json({ resp: 'Ok', senha: senha })
        } else {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza preencher todos os campos necessários' })
        }

    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

//Rota para atualizar cadastro usuario


router.put('/', async (req, res) => {
    try {
        let { nome, email, senha_atual, senha_nova, senha_confirm } = req.body
        if (nome != undefined && nome != '' && email != undefined != '') {
            const user = await User.findByPk(req.session.user)
            if (user == undefined) {
                return res.status(500).json({ erro: 'Não foi possivél identificar cadastro de usuário na base de dados!' })
            }
            email = email.toLowerCase()

            if (!validator.isEmail(email)) {
                return res.status(400).json({ erro: 'Dados inválidos, e-mail informado reconhecido como inválido' })
            }

            const exist = await User.findOne({
                where: {
                    [Op.and]: [
                        { status: true, email: email },
                        { id: { [Op.ne]: user.id } }
                    ]
                }
            })

            if (exist != undefined) {
                return res.status(403).json({ erro: 'Já existe um outro usuário ativo com os dados de e-mail informados' })
            }

            let isCorect = (senha_atual == "" && senha_nova == "" && senha_confirm == "") ? true : false
            let hash = ''
            if (!isCorect) {
                isCorect = bcrypt.compareSync(senha_atual, user.senha);
                if (isCorect) {
                    if (senha_nova == senha_confirm) {
                        const salt = bcrypt.genSaltSync(10);
                        hash = bcrypt.hashSync(senha_nova, salt);
                    } else {
                        return res.status(400).json({ erro: 'Dados inválidos, as senhas não conferem' })
                    }
                } else {
                    return res.status(400).json({ erro: 'Dados inválidos, gentileza verifique todas as informações e tente novamente' })
                }
            } else {
                hash = user.senha
            }

            const adm = await User.update({
                nome: nome,
                email: email,
                senha: hash
            }, { where: { id: user.id } })

            res.json({ resp: 'Dados atualizados com sucesso!' })
        } else {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza preencher todos os campos necessários' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

//Rota para atualizar status do usuario


router.put('/status',async(req,res)=>{
    try {
        let { status, id,reset } = req.body
        if ( id != undefined && id != '') {
            const user = await User.findByPk(parseInt(id))
            if (user == undefined) {
                return res.status(500).json({ erro: 'Não foi possivél identificar cadastro de usuário na base de dados!' })
            }
            const existUser = await User.findOne({where:{email:user.email,status:true,id:{[Op.ne]:user.id}}})
            if (existUser != undefined) {
                return res.status(500).json({ erro: 'Erro, existe um outro usuário ativo com o e-mail informado!' })
            }
            status = (status == true || status == 'true') ? true : false
            reset = (reset == true || reset == 'true') ? true : false
            let senha = user.senha
            const newSenha = `aguia` + moment().format('DDHHMMmm')
            if (reset) {
                const salt = bcrypt.genSaltSync(10);
                senha = bcrypt.hashSync(newSenha, salt);
            }
            await User.update({
                status: status,
                senha:senha,
                isFirst:reset
            }, { where: { id: user.id } })

            if (reset) {
                res.json({resp:'ok',senha:newSenha})
            }else{
                res.json({ resp: 'Dados atualizados com sucesso!' })
            }

        } else {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza preencher todos os campos necessários' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

module.exports = router