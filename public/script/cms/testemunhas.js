

async function editar(id) {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const preimg = $('#preimg')
        const nome = $('#nome')
        const status = $('#status')
        const star = $('#star')
        const testemunhaId = $('#testemunhaId')
        const competencia = $('#competencia')
        const comentario = $('#comentario')

        preimg[0].src = ''
        nome.val('')
        star.val(5)
        testemunhaId.val(null)
        competencia.val('')
        comentario.val('')
        status.val('true')

        if (id != undefined) {
            const request = await axios.get(`/api/cms/testemunha/${id}`)
            const testemunha = request.data.testemunha

            preimg[0].src = testemunha.img
            nome.val(testemunha.nome)
            star.val(testemunha.star)
            testemunhaId.val(testemunha.id)
            competencia.val(testemunha.competencia)
            comentario.val(testemunha.comentario)
            status.val(`${testemunha.status}`)
        }

    } catch (error) {
        console.log(error)
        if (error.response != undefined && error.response.data.erro != undefined) {
            console.log(error.response)
            toastErro(error.response.data.erro)
        } else {
            toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
        }
    } finally {
        loadModal(false)
    }
}

async function salvar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const img = $('#img')[0].files[0]
        const nome = $('#nome').val()
        const status = $('#status').val()
        const star = $('#star').val()
        const testemunhaId = $('#testemunhaId').val()
        const competencia = $('#competencia').val()
        const comentario = $('#comentario').val()


        if (nome == '') {
            return toastErro("Dados inválidos. Gentileza preencher nome")
        }
        if (star > 5 || star < 1) {
            return toastErro("Quantidade de estrelas deve ser entre 1 e 5")
        }
        const formData = new FormData()
        formData.append('img', img)
        formData.append('nome', nome)
        formData.append('status', status)
        formData.append('star', star)
        formData.append('competencia', competencia)
        formData.append('comentario', comentario)
        
        if (testemunhaId != '' && testemunhaId != undefined) {
            formData.append('testemunhaId', testemunhaId)
        }
        const request = (testemunhaId == '' || testemunhaId == undefined) ? await axios.post('/api/cms/testemunha', formData) : await axios.put('/api/cms/testemunha', formData)
        toastMsm(request.data.resp)
        document.location.reload()
    } catch (error) {
        console.log(error)
        if (error.response != undefined && error.response.data.erro != undefined) {
            console.log(error.response)
            toastErro(error.response.data.erro)
        } else {
            toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
        }
    } finally {
        loadModal(false)
    }
}

async function remover(id) {
    if (confirm("Deseja realmente remover comentário?")) {
        try {
            const request = await axios.delete(`/api/cms/testemunha/${id}`)
            toastMsm(request.data.resp)
            document.location.reload()
        } catch (error) {
            if (error.response != undefined && error.response.data.erro != undefined) {
                console.log(error.response)
                toastErro(error.response.data.erro)
            } else {
                toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
            }
        }
    }
}