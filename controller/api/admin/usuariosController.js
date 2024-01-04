const express = require('express')
const router = express.Router()
const validator = require('validator');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const User = require('../../../Database/login/User');

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

            const senha = `equi` + moment().format('DDHHMMmm')
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(senha, salt);

            const adm = await User.create({
                nome: nome,
                status: status,
                email: email,
                senha: hash
            })
            console.log(senha)
            res.json({ resp: 'Ok', senha: senha })
        } else {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza preencher todos os campos necessários' })
        }

    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/', async (req, res) => {
    try {
        let { nome, email, senha_atual, senha_nova, senha_confirm } = req.body
        if (nome != undefined && nome != '' && email != undefined != '') {
            const user = await User.findByPk(req.session.user_admin)
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
            const newSenha = `equi` + moment().format('DDHHMMmm')
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

router.put("/senha/", async (req, res) => {
    try {
        const { senha, confirm } = req.body;
        const email = req.session.email;
        if (email == undefined) {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza recarregue a página e tente realizar o processo novamente!' })
        }
        if (senha == confirm && senha != "") {
            const user = await User.findOne({ where: { email: email, status: true } });
            if (user != undefined) {
                const recuperaSenha = await RecuperaSenha.findOne({
                    where: { userId: user.id,type:'adm', aprovado: true },
                });
                if (recuperaSenha != undefined) {
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(senha, salt);
                    await User.update(
                        {
                            senha: hash,
                        },
                        { where: { id: user.id } }
                    )
                } else {
                    return res.status(400).json({ erro: 'Sem autorização para alterar sua senha, gentileza recarregue a página e tente novamente!' })
                }
            } else {
                return res.status(400).json({ erro: 'Dados inválidos, não foi possível identificar seu usuário na base de dados!' })
            }
        } else {
            return res.status(400).json({ erro: 'Dados inválidos, gentileza verifique os dados informados e tente novamente!' })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }

})

module.exports = router