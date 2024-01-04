const Empresa = require("../Database/Empresa")
const Servico = require("../Database/cms/Servico")



async function getStaticData(req,res,next) {
    try {
        const empresa = await Empresa.findOne()
        if (empresa) {
            res.locals.empresa = empresa
        }
        const servicos = await Servico.findAll({where:{status:true},limit:6})
        if (servicos) {
            res.locals.servicos = servicos
        }
    } catch (error) {
        console.log(error)
        console.log('Erro ao consultar dados static')
    }finally{
        next()
    }
}


module.exports = getStaticData