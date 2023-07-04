async function editar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        const titulo = $('#titulo')
        const subtitulo = $('#subtitulo')
        const texto1 = $('#texto1')
        const texto2 = $('#texto2')
        const status = $('#status')
        const video = $('#video')
        const preimg1 = $('#preimg1')
        const preimg2 = $('#preimg2')


        const request = await axios.get('/api/empresa')
        const sobre = request.data.sobre
        console.log(sobre)
        titulo.val(sobre.titulo)
        subtitulo.val(sobre.subtitulo)
        texto1.val(sobre.texto1)
        texto2.val(sobre.texto2)
        status.val(`${sobre.status}`)
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
        console.log("insert")
    }
}

async function salvar() {
    try {
        //Ao iniciar a função ele da o loop no modal
        const nome = $('#nome').val()
        const descricao = $('#descricao').val()
        const likedin = $('#likedin').val()
        const facebook = $('#facebook').val()
        const instagram = $('#instagram').val()
        const whatsapp = $('#whatsapp').val()
        const telefone = $('#telefone').val()
        const twitter = $('#twitter').val()
        const endereco = $('#endereco').val()
        const email = $('#email').val()
        const horario_abertura = $('#horario_abertura').val()
        const logo = $('#logo')[0].files[0]
        
        const formData = new FormData()

        formData.append('nome', nome)
        formData.append('descricao', descricao)
        formData.append('likedin', likedin)
        formData.append('facebook', facebook)
        formData.append('instagram', instagram)
        formData.append('whatsapp', whatsapp)
        formData.append('telefone', telefone)
        formData.append('twitter', twitter)
        formData.append('endereco', endereco)
        formData.append('email', email)
        formData.append('horario_abertura', horario_abertura)
        formData.append('logo', logo)

        const request = await axios.put('/api/empresa', formData)
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

const whatsapp = document.getElementById('whatsapp') // Seletor do campo de telefone

whatsapp.addEventListener('keypress', (e) => mascaraZap(e.target.value)) // Dispara quando digitado no campo
whatsapp.addEventListener('change', (e) => mascaraZap(e.target.value)) // Dispara quando autocompletado o campo

const mascaraZap= (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2")
    whatsapp.value = valor // Insere o(s) valor(es) no campo
}


const telefone = document.getElementById('telefone') // Seletor do campo de telefone

telefone.addEventListener('keypress', (e) => mascaraTelefone(e.target.value)) // Dispara quando digitado no campo
telefone.addEventListener('change', (e) => mascaraTelefone(e.target.value)) // Dispara quando autocompletado o campo

const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2")
    telefone.value = valor // Insere o(s) valor(es) no campo
}