function loadModal(load) {
    const loadModal =  document.querySelectorAll('.loadModal')
    const bodyModal = document.querySelectorAll('.bodyModal')
    const btnmodal = document.querySelectorAll('.btnmodal')
    if (load) {
        loadModal.forEach(l =>{
            l.classList.remove('d-none')
        })
        bodyModal.forEach(b =>{
            b.classList.add('d-none')
        })
        btnmodal.forEach(bt =>{
            bt.disabled = true
        })
    }else{
        loadModal.forEach(l =>{
            l.classList.add('d-none')
        })
        bodyModal.forEach(b =>{
            b.classList.remove('d-none')
        })
        btnmodal.forEach(bt =>{
            bt.disabled = false
        })
    }
    
}