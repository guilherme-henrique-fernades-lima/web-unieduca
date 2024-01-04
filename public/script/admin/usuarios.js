async function editar(id) {
    loadModal(true)
    const modalUsuarioLabel = $('#modalUsuarioLabel')
    const nome = $('#nome')
    const userId = $('#userId')
    const email = $('#email')
    const status = $('#status')
    const isResetable = $('#isResetable')

    modalUsuarioLabel.text('Adicionar Usuário')
    nome.val('')
    userId.val('')
    email.val('')
    status.val('true')
    email.attr('disabled',false)
    nome.attr('disabled',false)
    isResetable.addClass('d-none')

    if (id != undefined) {
      try {
        const request = await axios.get(`/api/usuarios/${id}`)
        const user = request.data
        nome.val(user.nome)
        email.val(user.email)
        status.val(`${user.status}`)
        email.attr('disabled',true)
        nome.attr('disabled',true)
        isResetable.removeClass('d-none')
        userId.val(user.id)
        modalUsuarioLabel.text('Editar Usuário')
        loadModal(false)
      } catch (error) {
        console.log(error)
        if (error.response != undefined && error.response.data.erro != undefined) {
          toastErro(error.response.data.erro)
        } else {
          toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
        }
      }
    }else{
      loadModal(false)
    }
  }


  async function salvar() {
    loadModal(true)
    const nome = $('#nome').val()
    const userId = $('#userId').val()
    const email = $('#email').val()
    const status = $('#status').val()
    const reset = $('#reset').is(':checked')

    try {
      const request = (userId == '' || userId == undefined)?
      await axios.post('/api/usuarios/',{nome:nome,email:email,status:status}):
      await axios.put(`/api/usuarios/status`,{status:status,id:userId,reset:reset})
      if (request.data.senha != undefined) {
        const modalUsuarioResp = new bootstrap.Modal('#modalUsuarioResp', {keyboard: false})
        const senhaRetorno = $('#senhaRetorno')
        senhaRetorno.val(request.data.senha)
        $('#btnCloseAdUser').click()
        modalUsuarioResp.show()
        loadModal(false)
      }else{
        toastMsm(request.data.resp)
        document.location.reload()
      }
    } catch (error) {
      console.log(error)
      if (error.response != undefined && error.response.data.erro != undefined) {
        toastErro(error.response.data.erro)
      } else {
        toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
      }
      loadModal(false)
    }
  }