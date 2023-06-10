function retorno(prop) {
    console.log(prop.path)
    if (prop.path.toLowerCase().includes('/api')) {
        console.log(prop)
        prop.res.status(400).json({erro:prop.erro})
    }else{
        prop.req.flash('erro',prop.erro)
        prop.res.redirect(prop.redirect)
    }
}

module.exports = retorno