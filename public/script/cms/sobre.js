async function editar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        loadModal(true)
        const titulo = $('#titulo')
        const subtitulo = $('#subtitulo')
        const texto1 = $('#texto1')
        const texto2 = $('#texto2')
        const status = $('#status')
        const video = $('#video')
        const preimg1 = $('#preimg1')
        const preimg2 = $('#preimg2')


        const request = await axios.get('/api/cms/sobre')
        const sobre = request.data.sobre
        console.log(sobre)
        titulo.val(sobre.titulo)
        subtitulo.val(sobre.subtitulo)
        texto1.val(sobre.texto1)
        texto2.val(sobre.texto2)
        status.val(sobre.status)
        video.val(sobre.video)
        preimg1[0].src = sobre.img1
        preimg2[0].src = sobre.img2

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
        const subtitulo = $('#subtitulo').val()
        const texto1 = $('#texto1').val()
        const texto2 = $('#texto2').val()
        const status = $('#status').val()
        const img1 = $('#img1')[0].files[0]
        const img2 = $('#img2')[0].files[0]
        const video = $('#video').val()

        const formData = new FormData()
        formData.append('img1', img1)
        formData.append('img2', img2)
        formData.append('titulo', titulo)
        formData.append('subtitulo', subtitulo)
        formData.append('video', video)
        formData.append('status', status)
        formData.append('texto1', texto1)
        formData.append('texto2', texto2)

        const request = await axios.put('/api/cms/sobre', formData)
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