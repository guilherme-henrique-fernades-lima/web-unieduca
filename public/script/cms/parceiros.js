async function remover(id) {
    if (confirm("Deseja realmente remover cadastro do parceiro?")) {
        try {
            const request = await axios.delete(`/api/cms/parceiro/${id}`)
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

async function editar(id) {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const preimg = $('#preimg')
        const nome = $('#nome')
        const status = $('#status')
        const link = $('#link')
        const parceiroId = $('#parceiroId')

        preimg[0].src = ''
        nome.val('')
        status.val('true')
        parceiroId.val('')
        link.val('')
        if (id != undefined) {
            const request = await axios.get(`/api/cms/parceiro/${id}`)
            const parceiro = request.data.parceiro
            nome.val(parceiro.nome)
            status.val(`${parceiro.status}`)
            preimg[0].src = parceiro.img
            parceiroId.val(parceiro.id)
            link.val(parceiro.link)
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
        const parceiroId = $('#parceiroId').val()
        const link = $('#link').val()

        if (nome == '') {
            return toastErro("Dados inválidos. Gentileza preencher nome")
        }
        const formData = new FormData()
        formData.append('img', img)
        formData.append('nome', nome)
        formData.append('status', status)
        formData.append('link', link)
        if (parceiroId != '') {
            formData.append('parceiroId', parceiroId)
        }

        const request = (parceiroId == '' || parceiroId == undefined) ? await axios.post('/api/cms/parceiro', formData) : await axios.put('/api/cms/parceiro', formData)
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