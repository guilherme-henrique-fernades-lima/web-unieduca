async function remover(id) {
    if (confirm("Deseja realmente remover cadastro do serviço?")) {
      try {
        const request = await axios.delete(`/api/cms/duvida/${id}`)
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
        const duvida = $('#duvida')
        const status = $('#status')
        const duvidaId = $('#duvidaId')
        const resposta = $('#resposta')

        duvida.val('')
        resposta.val('')
        status.val('true')
        duvidaId.val('')
        if (id != undefined) {
            const request = await axios.get(`/api/cms/duvida/${id}`)
            const duvidaEdit = request.data.duvida
            duvida.val(duvidaEdit.duvida)
            resposta.val(duvidaEdit.resposta)
            status.val(`${duvidaEdit.status}`)
            duvidaId.val(duvidaEdit.id)
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
        loadModal(true)
        const duvida = $('#duvida').val()
        const status = $('#status').val()
        const duvidaId = $('#duvidaId').val()
        const resposta = $('#resposta').val()

        if (duvida == '' || resposta == '') {
            return toastErro("Dados inválidos. Gentileza preencher pergunta e resposta")
        }
        const data = {duvida:duvida,status:status,duvidaId:duvidaId,resposta:resposta}
        const request = (duvidaId == '' || duvidaId == undefined) ? await axios.post('/api/cms/duvida', data) : await axios.put('/api/cms/duvida', data)
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