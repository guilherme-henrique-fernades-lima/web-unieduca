async function editar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const titulo = $('#titulo')
        const texto = $('#texto')
        const preimg1 = $('#preimg1')


        const request = await axios.get('/api/cms/banner')
        const banner = request.data.banner
        console.log(banner)
        titulo.val(banner.titulo)
        texto.val(banner.texto)
        preimg1[0].src = banner.img

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
        const titulo = $('#titulo').val()
        const texto = $('#texto').val()
        const img = $('#img')[0].files[0]

        const formData = new FormData()
        if (img != undefined) formData.append('file', img)
        formData.append('titulo', titulo)
        formData.append('texto', texto)

        const request = await axios.put('/api/cms/banner', formData)
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