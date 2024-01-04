async function visualizar(id) {
    loadModal(true)
    const name = $('#name')
    const email = $('#email')
    const subject = $('#subject')
    const message = $('#message')

    name.val('')
    subject.val('')
    message.val('')
    email.val('')

    if (id != undefined) {
        try {
            const request = await axios.get(`/api/contatos/${id}`)
            const {contato} = request.data
            console.log(contato)
            name.val(contato.name)
            subject.val(contato.subject)
            message.val(contato.message)
            email.val(contato.email)
            
            loadModal(false)
        } catch (error) {
            console.log(error)
            if (error.response != undefined && error.response.data.erro != undefined) {
                toastErro(error.response.data.erro)
            } else {
                toastErro('Ocorreu um erro durante o processamento de dados, verifique sua rede e tente novamente')
            }
        }
    }
}