module.exports.dashboard = (req, res) => {
    try {
        res.render('dashboard', { title: 'Dashboard' })
    } catch (error) {
        console.log(error)
    }
}
module.exports.addAdmin = (req, res) => {
    try {
        res.render('add-admin', { title: 'Add-Admin' })
    } catch (error) {
        console.log(error)
    }
}
module.exports.viewAdmin = (req, res) => {
    try {
        res.render('view-admin', { title: 'View-Admin' })
    } catch (error) {
        console.log(error)
    }
}
module.exports.insertAdminData = (req, res) => {
    try {
        console.log(req.body);
        console.log(req.file);
    }
    catch (err) {
        console.log(err);
    }
}