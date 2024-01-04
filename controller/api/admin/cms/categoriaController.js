const express = require('express')
const router = express.Router()
const Categoria = require('../../../../Database/cms/Categoria')
const multer = require('multer')
const moment = require('moment')
const fs = require('fs')
const Curso = require('../../../../Database/cms/Curso')
const Curso_Mensalidade = require('../../../../Database/cms/Curso_Mensalidade')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/categorias')
    },
    filename: function (req, file, cb) {
        cb(null, `categoria_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})

const storage_curso = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/upload/cms/cursos')
    },
    filename: function (req, file, cb) {
        cb(null, `curso_ft_${moment().format('YYYYMMDDHHmmSS')}.${file.originalname.split('.').pop()}`)
    }
})


const upload = multer({ storage: storage })
const upload_cursos = multer({ storage: storage_curso })

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const categoria = await Categoria.findByPk(id)
        if (categoria == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        res.json({ categoria: categoria })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.get('/:id/cursos/:cursoId', async (req, res) => {
    try {
        const { id, cursoId } = req.params
        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) return res.status(500).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        const curso = await Curso.findOne({ where: { id: cursoId, categoriaId: categoria.id },include:{required:false,model:Curso_Mensalidade,as:'mensalidades'} })
        if (!curso) {
            return res.status(500).json({ erro: 'Erro ao consultar, Curso informado não identificado na base de dados!' })
        }
        res.json({ curso: curso })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/:id/cursos/', upload_cursos.single('img'), async (req, res) => {
    try {

        const { id } = req.params
        console.log(req.body)
        let { nome, descricao, objetivo, status, contato, isWhats, duracao, carga_horaria, encontros, localizacao, modalidade, instituicao, documentacao } = req.body
        const file = req.file
        status = status == true || status == 'true'
        isWhats = isWhats == true || isWhats == 'true'

        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        }

        if (!nome || !descricao || !objetivo || !contato || !file) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Dados Importantes como "Nome", "Descrição", "Objetivos", "Contato" ou "Imagem" porem está vazios. Gentileza verifique todos os dados e tente novamente!' })
        }

        const exist = await Curso.findOne({ where: { nome: nome, categoriaId: categoria.id } })
        if (exist) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Já existe um curso com o mesmo nome vinculada a essa categoria' })
        }

        const img = `${file.path.replace('public', '')}`

        const newCurso = await Curso.create({
            categoriaId: categoria.id,
            nome,
            img,
            descricao,
            objetivo,
            status,
            contato,
            isWhats,
            duracao,
            carga_horaria,
            encontros,
            localizacao,
            modalidade,
            instituicao,
            documentacao
        })
        res.json({ resp: 'Curso cadastrado com sucesso e vinculado a categoria', curso: newCurso })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.put('/:id/cursos/', upload_cursos.single('img'), async (req, res) => {
    try {

        const { id } = req.params
        console.log(req.body)
        let { cursoId, nome, descricao, objetivo, status, contato, isWhats, duracao, carga_horaria, encontros, localizacao, modalidade, instituicao, documentacao } = req.body
        const file = req.file
        status = status == true || status == 'true'
        isWhats = isWhats == true || isWhats == 'true'

        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        }

        const curso = await Curso.findOne({ where: { id: cursoId, categoriaId: categoria.id } })
        if (!curso) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Erro ao consultar, Curso informado não identificado na base de dados!' })
        }

        if (!nome || !descricao || !objetivo || !contato) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Dados Importantes como "Nome", "Descrição", "Objetivos" ou "Contato" porem está vazios. Gentileza verifique todos os dados e tente novamente!' })
        }

        const exist = await Curso.findOne({ where: { nome: nome, categoriaId: categoria.id } })
        if (exist && exist.id != curso.id) {
            if (file) {
                fs.unlinkSync(file.path)
            }
            return res.status(400).json({ erro: 'Já existe um outro curso com o mesmo nome vinculada a essa categoria' })
        }

        const img = (file) ? `${file.path.replace('public', '')}` : curso.img

        await Curso.update({
            nome,
            img,
            descricao,
            objetivo,
            status,
            contato,
            isWhats,
            duracao,
            carga_horaria,
            encontros,
            localizacao,
            modalidade,
            instituicao,
            documentacao
        }, { where: { id: curso.id } })
        res.json({ resp: 'Curso atualizado com sucesso' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/:id/cursos/:cursoId/mensalidade', async (req, res) => {
    try {

        const { id, cursoId } = req.params
        console.log(req.body)
        let { titulo, bolsa, valor_final, valor_desconto,mensalidade } = req.body

        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) {
            return res.status(400).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        }

        const curso = await Curso.findOne({ where: { id: cursoId, categoriaId: categoria.id } })
        if (!curso) {
            return res.status(400).json({ erro: 'Erro ao consultar, Curso informado não identificado na base de dados!' })
        }

        if (!titulo) {
            return res.status(400).json({ erro: 'Dados Importantes como "titulo" está vazios. Gentileza verifique todos os dados e tente novamente!' })
        }

        if (!mensalidade || isNaN(parseFloat(mensalidade))) {
            return res.status(400).json({ erro: 'Valor inserido no campo "Mensalidade" é inválido' })
        }

        if (bolsa && isNaN(parseFloat(bolsa))) {
            return res.status(400).json({ erro: 'Valor inserido no campo "Bolsa" é inválido' })
        }

        if (valor_final && isNaN(parseFloat(valor_final))) {
            return res.status(400).json({ erro: 'Valor inserido no campo "Valor Final" é inválido' })
        }

        if (valor_desconto && isNaN(parseFloat(valor_desconto))) {
            return res.status(400).json({ erro: 'Valor inserido no campo "Valor Desconto" é inválido' })
        }

        const exist = await Curso_Mensalidade.findOne({ where: { titulo: titulo, cursoId: curso.id } })
        if (exist) {
            return res.status(400).json({ erro: 'Já existe uma outra mensalidade com o mesmo titulo vinculada a esse curso' })
        }

        await Curso_Mensalidade.create({
            titulo,
            mensalidade,
            bolsa,
            valor_desconto,
            valor_final,
            cursoId:curso.id
        })
        res.json({ resp: 'Mensalidade de curso adicionada com sucesso' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.delete('/:id/cursos/:cursoId/mensalidade/:mensalidadeId', upload_cursos.single('img'), async (req, res) => {
    try {

        const { id, cursoId,mensalidadeId } = req.params
        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) {
            return res.status(400).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        }
        const curso = await Curso.findOne({ where: { id: cursoId, categoriaId: categoria.id } })
        if (!curso) {
            return res.status(400).json({ erro: 'Erro ao consultar, Curso informado não identificado na base de dados!' })
        }
        const mensalidade = await Curso_Mensalidade.findOne({where:{cursoId:curso.id,id:mensalidadeId}})
        if (!mensalidade) {
            return res.status(400).json({ erro: 'Erro ao consultar, Mensalidade informado não identificado na base de dados!' })
        }
        await Curso_Mensalidade.destroy({ where: { id: mensalidade.id } })

        res.json({ resp: 'Mensalidade deletada com sucesso' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.delete('/:id/cursos/:cursoId', upload_cursos.single('img'), async (req, res) => {
    try {

        const { id, cursoId } = req.params
        const categoria = await Categoria.findByPk(id, { attributes: ['id'] })
        if (categoria == undefined) {
            return res.status(400).json({ erro: 'Erro ao consultar, Categoria informado não identificado na base de dados!' })
        }
        const curso = await Curso.findOne({ where: { id: cursoId, categoriaId: categoria.id } })
        if (!curso) {
            return res.status(400).json({ erro: 'Erro ao consultar, Curso informado não identificado na base de dados!' })
        }
        await Curso.destroy({ where: { id: curso.id } })

        res.json({ resp: 'Curso deletado com sucesso' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
    }
})

router.post('/', upload.single('img'), async (req, res) => {
    try {
        let { status, nome, descricao } = req.body
        status = (status == true || status == 'true') ? true : false
        if (nome == '' || nome == undefined) {
            return res.status(500).json({ erro: 'Dados importantes como "nome" estão vazios, gentileza verifique e tente novamente!' })
        }

        const exist = await Categoria.findOne({ where: { nome: nome } })
        if (exist != undefined) return res.status(500).json({ erro: 'Já existe um outro Categoria com os mesmos dados, gentileza tente novamente!' })

        const file = req.file
        if (file == undefined) return res.status(500).json({ erro: 'Dados importantes como "imagem" estão vazios, gentileza verifique e tente novamente!' })
        const img = `${file.path.replace('public', '')}`

        const newCategoria = await Categoria.create({
            status: status,
            nome: nome,
            img, img,
            descricao: descricao
        })
        res.json({ resp: "Categoria cadastrado com sucesso!", categoria: newCategoria })
    } catch (error) {
        console.log(error)
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file?.path, (err) => { if (err) { console.error(err) } });
    }
})

router.put('/', upload.single('img'), async (req, res) => {
    try {
        let { status, nome, categoriaId, descricao } = req.body
        const file = req.file
        status = (status == true || status == 'true') ? true : false
        const categoria = await Categoria.findByPk(categoriaId)
        if (categoria == undefined) return res.status(500).json({ erro: 'Não foi possível identificar cadastro do categoria na base de dados!' })
        if (nome == '' || nome == undefined) {
            return res.status(500).json({ erro: 'Dados importantes como "nome"  estão vazios, gentileza verifique e tente novamente!' })
        }
        const exist = await Categoria.findOne({ where: { nome: nome } })
        if (exist != undefined && exist.id != categoria.id) return res.status(500).json({ erro: 'Já existe um outro Categoria com os mesmos dados, gentileza tente novamente!' })

        let img = categoria.img
        if (file != undefined) {
            img = `${file.path.replace('public', '')}`
        }

        await Categoria.update({
            status: status,
            nome: nome,
            img, img,
            descricao: descricao
        }, { where: { id: categoria.id } })

        res.json({ resp: "Cadastro do Categoria atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ erro: 'Ocorreu um erro durante o processamento dos dados, gentileza tente novamente!' })
        fs.unlink(req.file?.path, (err) => { if (err) { console.error(err) } });
    }
})


module.exports = router