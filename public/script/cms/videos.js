async function editar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const video = $('#video')
        const texto = $('#texto')
        const status = $('#status')
        const titulo = $('#titulo')
        const preimg = $('#preimg')


        const request = await axios.get('/api/cms/video')
        const videoEdit = request.data.video
        if (videoEdit != undefined) {
            titulo.val(videoEdit.titulo)
            texto.val(videoEdit.texto)
            status.val(`${videoEdit.status}`)
            video.val(videoEdit.video)
            if (videoEdit.img != null) {
                preimg[0].src = videoEdit.img
                preimg.removeClass('d-none')
            }

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
        const video = $('#video').val()
        const texto = $('#texto').val()
        const imagem = $('#imagem')[0].files[0]
        const status = $('#status').val()
        const titulo = $('#titulo').val()

        const formData = new FormData()
        formData.append('video', video)
        formData.append('titulo', titulo)
        formData.append('texto', texto)
        formData.append('img', imagem)
        formData.append('status', status)

        const request = await axios.put('/api/cms/video', formData)
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
