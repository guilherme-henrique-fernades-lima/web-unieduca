async function remover(id) {
    if (confirm("Deseja realmente remover cadastro do serviço?")) {
        try {
            const request = await axios.delete(`/api/cms/servico/${id}`)
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