

async function editar(id) {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const preimg = $('#preimg')
        const nome = $('#nome')
        const status = $('#status')
        const funcionarioId = $('#funcionarioId')
        const competencia = $('#competencia')

        preimg[0].src = ''
        nome.val('')
        funcionarioId.val(null)
        competencia.val('')
        status.val('true')
        $('#list_redes_funcionarios').html('')
        
        if (id != undefined) {
            const request = await axios.get(`/api/cms/funcionario/${id}`)
            const { funcionario } = request.data
            console.log(funcionario)
            preimg[0].src = funcionario.img
            nome.val(funcionario.nome)
            funcionarioId.val(funcionario.id)
            competencia.val(funcionario.competencia)
            status.val(`${funcionario.status}`)
            let inner_redes = ''
            for (const rede of funcionario.redes) {
                inner_redes += `
                    <li class="list-group-item d-flex justify-content-between align-items-start">
                        <div class="ms-2 me-auto">
                          <div class="fw-bold">${rede.type == 1 ? 'Twitter' : (rede.type == 2) ? 'Facebook' : (rede.type == 3) ? 'Instagram' : (rede.type == 4) ? 'Linkedin' : 'Outros'} ${rede.logo}</div>
                          <a href="${rede.link}" target="_blank">${rede.link}</a>
                        </div>
                        <button class="btn btn-danger btn-sm" value="${rede.id}" onclick="removeRede(this.value)"><i class="bi bi-trash"></i></button>
                    </li>
                
                `
            }
            $('#list_redes_funcionarios').html(inner_redes)
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
        const funcionarioId = $('#funcionarioId').val()
        const competencia = $('#competencia').val()


        if (nome == '') {
            return toastErro("Dados inválidos. Gentileza preencher nome")
        }

        const formData = new FormData()
        formData.append('img', img)
        formData.append('nome', nome)
        formData.append('status', status)
        formData.append('competencia', competencia)
        if (funcionarioId != '' && funcionarioId != undefined) {
            formData.append('funcionarioId', funcionarioId)
        }
        const request = (funcionarioId == '' || funcionarioId == undefined) ? await axios.post('/api/cms/funcionario', formData) : await axios.put('/api/cms/funcionario', formData)
        toastMsm(request.data.resp)
        if (funcionarioId == '') {
            $('#funcionarioId').val(request.data.funcionario?.id)
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

async function remover(id) {
    if (confirm("Deseja realmente remover cadastro?")) {
        try {
            const request = await axios.delete(`/api/cms/funcionario/${id}`)
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


async function addRede() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const funcionarioId = $('#funcionarioId').val()
        const type_rede = $('#type_rede').val()
        const link_rede = $('#link_rede').val()

        if (!funcionarioId) {
            return toastErro("Dados inválidos. Recarreue a página e tente novamente!")
        }

        if (!link_rede) {
            return toastErro("Dados inválidos. Necessário informar a URL da rede que deseja cadastrar!")
        }

        const request = await axios.post('/api/cms/funcionario/rede', { funcionarioId, type: type_rede, link: link_rede })
        toastMsm(request.data.resp)
        $('#type_rede').val('')
        $('#link_rede').val('')
        editar(funcionarioId)
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

async function removeRede(id) {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const funcionarioId = $('#funcionarioId').val()

        if (!funcionarioId) {
            return toastErro("Dados inválidos. Recarreue a página e tente novamente!")
        }

        const request = await axios.delete(`/api/cms/funcionario/${funcionarioId}/rede/${id}`)
        toastMsm(request.data.resp)
        editar(funcionarioId)
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
