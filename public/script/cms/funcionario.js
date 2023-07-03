async function salvar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const nome = $('#nome').val()
        const competencia = $('#competencia').val()
        const foto = $('#foto').val()
        const status = $('#status').val()


        const formData = new FormData()
        formData.append('nome', nome)
        formData.append('competencia', competencia)
        formData.append('foto', foto)
        formData.append('status', status)


        const request = await axios.put('/api/cms/funcionario', formData)
        toastMsm(request.data.resp)

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