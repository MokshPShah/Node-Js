module.exports.adminDashboard = (req, res) => {
    try {
        return res.status(200).send({ message: "Welcome to admin api" });
    } catch (error) {

    }
}