const User = require("../Database/login/User")
const retorno = require('../functions/retorno')

async function auth(req,res,next) {
    try {
        req.session.user = 1
        const user = req.session.user
        if (user != undefined) {
            const adm = await User.findOne({where:{id:user,status:true},attributes:['id']})
            if (adm != undefined) {
                next()
            } else {
                retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/admin/login',erro:'Seu usuario não tem permissão para acessar, gentileza realize o login novamente!'})
            }
        } else {
            retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/admin/login',erro:'Nenhum usuário logado foi identificado, gentileza realizar o login'})
        }
    } catch (error) {
        retorno({req:req,res:res,path:req._parsedOriginalUrl.pathname,redirect:'/admin/login',erro:'Ops, sua sessão expirou! Por gentileza realize o login e tente novamente!'})
    }
}

module.exports = auth