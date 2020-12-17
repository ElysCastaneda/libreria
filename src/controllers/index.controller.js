const indexCtrl = {};

indexCtrl.renderIndex = (req, res) => {
    res.render('index')
};

indexCtrl.renderAgregar = (req, res) => {
    res.render('agregar')
};

module.exports = indexCtrl;