const Movie = require('../models/movieModel')

exports.addMovie = (req, res) => {
    res.render('addMovie')
}

exports.addNewMovie = async (req, res) => {
    try {
        await Movie.create({
            title: req.body.title,
            language: req.body.language.split(',').map(l => l.trim()),
            image: req.file.filename,
            rating: req.body.rating,
            genre: req.body.genre.split(',').map(g => g.trim()),
            desc: req.body.desc,
        })

        res.redirect('/')
    } catch (err) {
        console.log(err);
        res.send("Error saving movie");
    }
}

exports.getAllMovies = async (req, res) => {
    try {
        const movies = await Movie.find();
        res.render('index', { movies })
    } catch (err) {
        console.log(err);
        res.send("Error fetching movies");
    }
}