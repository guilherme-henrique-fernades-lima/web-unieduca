const express = require('express')
const router = express.Router()

const User = require('../../../Database/login/User')
const RecuperaSenha = require('../../../Database/login/RecuperaSenha');

const bcrypt = require('bcrypt');
const moment = require('moment');
const fs = require('fs');
const ejs = require('ejs');
const { Op } = require('sequelize');

router.get('/', async (req, res) => {
    try {
        let email = req.flash('email')
        email = (email == undefined || email.length == 0) ? undefined : email
        res.render('admin/login', { email: email })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/logout', async (req, res) => {
    try {
        req.session.user = undefined
        res.redirect('/')
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    try {
        let { email, senha } = req.body
        req.flash('email', email)
        if (email != undefined && email != '') {
            email = email.toLowerCase()
            const user = await User.findOne({ where: { status: true, email: email } })
            if (user != undefined) {
                if (bcrypt.compareSync(senha, user.senha)) {
                    req.session.user = user.id
                    await User.update({ lastLogin: moment() }, { where: { id: user.id } })
                    if (user.isFirst ) {
                        res.redirect('/admin/login/alterar')
                    }else{
                        res.redirect('/admin')
                    }
                } else {
                    req.flash('erro', 'Credenciais inválidas, gentileza tente novamente ou clique em "Esqueceu a senha"')
                    res.redirect('/admin/login')
                }
            } else {
                req.flash('erro', 'Não foi possível identificar nenhum usuário ativo com essas informações, gentileza entre em contato com um usuario ADMINISTRADOR')
                res.redirect('/admin/login')
            }
        } else {
            req.flash('erro', 'E-mail inválido, gentileza informar um e-mail correto')
            res.redirect('/admin/login')
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.get('/esqueceu', async (req, res) => {
    try {
        let email = req.flash('email')
        email = (email == undefined || email.length == 0) ? undefined : email
        res.render('admin/esqueceu', { email: email })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/esqueceu', async (req, res) => {
    try {
        let email = req.body.email
        if (email == undefined || email == "") {
            req.flash("erro", "E-mail informado contem vazio como valor");
            return res.redirect("/admin/login/esqueceu");
        }
        email = email.toLowerCase();
        const user = await User.findOne({ where: { email: email, status: true } });
        if (user == undefined) {
            req.flash("erro", "Não foi identificado nenhum usuario com esse endereço de email, por gentileza realize o seu cadastro");
            return res.redirect("/admin/login/esqueceu");
        }

        const recuperaSenha = await RecuperaSenha.findOne({
            where: {
                userId: user.id,
                [Op.or]: [{ status: true }, { aprovado: true }],
            },
        });
        if (recuperaSenha != undefined) {
            await RecuperaSenha.update(
                { status: false, aprovado: false, updatedAt: moment().format() },
                { where: { id: recuperaSenha.id } }
            );
        }
        let idUnica = Math.floor(Math.random() * 9999);
        while (idUnica.toString().length < 4) {
            idUnica = "0" + idUnica;
        }
        await RecuperaSenha.create({
            userId: user.id,
            status: true,
            uniqid: idUnica.toString(),
            aprovado: false,
        });

        const date = moment().format("YYYYMMDD");
        try {
            let html = await ejs.renderFile("public/html/envioEmail.ejs", {
                idUnica: idUnica,
                nome: user.nome,
            });
            await fs.writeFileSync(`public/html/${date}.html`, html);
            const htmlstream = await fs.createReadStream(`public/html/${date}.html`);
            console.log(idUnica)
            // await remetente.sendMail(
            //     {
            //         to: user.email, // list of receivers
            //         subject: "Codigo verificação alteração de senha!! ✔", // Subject line
            //         //text: `Olá, seu codigo para validação é ${codigo}`, // plain text body
            //         html: htmlstream, // html body
            //     },
            //     function (error) {
            //         if (error) {
            //             console.log(error);
            //         } else {
            //             fs.unlinkSync(`public/html/${date}.html`);
            //             console.log("Email enviado com sucesso");
            //             req.flash("msm", "Email enviado com sucesso");
            //         }
            //     }
            // );

            req.session.email = user.email;
            res.redirect("/admin/login/codigo");
        } catch (err) {
            console.log("==========");
            console.log(err);
            fs.unlinkSync(`public/html/${date}.html`);
            req.flash("erro", 'Ocorreu um erro durante o envio de e-mail, gentileza tente novamente. Caso o erro persista entre em contato com o suporte!');
            return res.redirect("/admin/login/esqueceu");
        }
    } catch (error) {
        console.log(error)
        req.flash("erro", "Ocorreu um erro durante o processamento de dados!");
        res.redirect('/admin')
    }
})

router.get('/codigo', async (req, res) => {
    try {
        let email = req.session.email;
        if (email != undefined) {
            const user = await User.findOne({ where: { email: email, status: true } });
            if (user != undefined) {
                const recuperaSenha = await RecuperaSenha.findOne({
                    where: { userId: user.id, status: true },
                });
                if (recuperaSenha != undefined) {
                    res.render("admin/codigo", { user: { email: user.email }});
                } else {
                    req.flash("erro", "Necessario solicitar outro envio de e-mail com código de autorização!");
                    res.redirect("/user/esqueceu");
                }
            } else {
                req.flash("erro", "Necessario solicitar outro envio de e-mail com código de autorização!");
                res.redirect("/user/esqueceu");
            }
        } else {
            req.flash("erro", "Necessario solicitar outro envio de e-mail com código de autorização!");
            res.redirect("/admin/login/esqueceu");
        }
    } catch (error) {
        console.log(error)
        req.flash("erro", "Ocorreu um erro durante o processamento de dados!");
        res.redirect('/admin/login')
    }
})

router.post("/codigo", async (req, res) => {
    try {
        const codigo = req.body.codigo;
        const email = req.session.email;
        if (codigo != undefined && codigo != "") {
            const user = await User.findOne({ where: { email: email, status: true } });
            if (user != undefined) {
                const recuperaSenha = await RecuperaSenha.findOne({
                    where: { userId: user.id, uniqid: codigo, status: true },
                });
                if (recuperaSenha != undefined) {
                    await RecuperaSenha.update(
                        { aprovado: true, updatedAt: moment().format() },
                        { where: { id: recuperaSenha.id } }
                    )
                    res.redirect(`/admin/login/alterar/`);
                } else {
                    req.flash("erro", "Codigo inválido, gentileza tente novamente!");
                    res.redirect("/admin/login/codigo");
                }
            } else {
                req.flash("erro", "Usuario não identificado na base de dados, tente novamente!");
                res.redirect("/admin/login/esqueceu");
            }
        } else {
            req.flash("erro", "Codigo inválido ou inexistente, gentileza tente novamente!");
            res.redirect("/admin/login/codigo");
        }
    } catch (error) {
        console.log(error)
        req.flash("erro", "Ocorreu um erro durante o processamento de dados!");
        res.redirect('/admin/login')
    }
});


router.get("/alterar/", async (req, res) => {
    try {
        const email = req.session.email;
        const id = req.session.user
        if (email != undefined || id != undefined) {
            const user = (email != undefined) ? await User.findOne({ where: { email: email, status: true } }) :
                (id != undefined) ? await User.findOne({ where: { id: id, status: true } }) : undefined
            if (user != undefined) {
                const recuperaSenha = await RecuperaSenha.findOne({
                    where: { userId: user.id,  aprovado: true },
                })
                if (recuperaSenha != undefined || user.isFirst == true) {
                    if (recuperaSenha != undefined) {
                        await RecuperaSenha.update(
                            { status: false, updatedAt: moment().format() },
                            { where: { id: recuperaSenha.id } })
                    }
                    res.render("admin/alterar");
                } else {
                    req.flash("erro", "Código de alteração expirou, gentileza reenviar e-mail novamente!");
                    res.redirect("/admin/login/esqueceu");
                }
            } else {
                req.flash("erro", "Erro ao identificar seu usuario na base de dados do sistema, gentileza tente novamente caso o erro persista entre em contato com o suporte!");
                res.redirect("/admin/login/esqueceu");
            }
        } else {
            erro = "Ocorreu um erro ao identificar o usuário, gentileza tente novamente!";
            req.flash("erro", erro);
            res.redirect("/admin/login");
        }
    } catch (error) {
        console.log(error)
        req.flash("erro", "Ocorreu um erro durante o processamento de dados!");
        res.redirect('/admin/login')
    }
});

router.post("/alterar/", async (req, res) => {
    try {
        const { senha, confirm } = req.body;
        const email = req.session.email;
        const id = req.session.user;
        if (email != undefined || id != undefined) {
            if (senha == confirm && senha != "") {
                if (senha.length < 6) {
                    req.flash('erro','Senha deve conter no mínimo 6 caracteres')
                    return res.redirect('/admin/login/alterar')
                }
                const user = (email != undefined) ? await User.findOne({ where: { email: email, status: true } }) :
                    (id != undefined) ? await User.findOne({ where: { id: id, status: true } }) : undefined
                if (user != undefined) {
                    const recuperaSenha = await RecuperaSenha.findOne({
                        where: { userId: user.id, aprovado: true },
                    });
                    if (recuperaSenha != undefined || user.isFirst == true) {
                        const salt = bcrypt.genSaltSync(10);
                        const hash = bcrypt.hashSync(senha, salt);
                        await User.update(
                            {
                                senha: hash,
                                isFirst:false
                            },
                            { where: { id: user.id } }
                        )
                        if (recuperaSenha) {
                            await RecuperaSenha.update(
                                { aprovado: false, status: false },
                                { where: { id: recuperaSenha.id } }
                            );
                        }
                        req.session.user = user.id;
                        res.redirect("/admin");

                    } else {
                        req.flash("erro", "Sem autorização para alterar, gentileza encaminhar e-mail novamente");
                        res.redirect("/admin/login/esqueceu");
                    }
                } else {
                    erro = "Erro ao identificar seu usuario, gentileza solicitar envio de e-mail novamente";
                    req.flash("erro", erro);
                    res.redirect("/admin/login/esqueceu");
                }
            } else {
                req.flash("erro", "Senhas inválidas, as senhas não conferem gentileza tentar novamente!");
                res.redirect("/admin/login/alterar/");
            }
        } else {
            req.flash("erro", "Ocorreu um erro durante o processo de alteração de senha, gentileza tente novamente!");
            res.redirect("/admin/login/esqueceu");
        }
    } catch (error) {
        console.log(error)
        req.flash("erro", "Ocorreu um erro durante o processamento de dados!");
        res.redirect('/admin/login')
    }
});


module.exports = router