const Movie = require('../models/movieModel')
const fs = require('fs')

exports.addMovie = (req, res) => {
    res.render('addMovie')
}

exports.addNewMovie = async (req, res) => {
    try {
        await Movie.create({
            title: req.body.title,
            language: req.body.language.split(',').map(l => l.trim()),
            image: req.file.filename,
            duration: req.body.duration,
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

exports.MovieDetails = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('view-movie-detail', { movie })
    } catch (err) {
        console.log(err);
        res.send("Error fetching movies");
    }
}

exports.viewAllMovie = async (req, res) => {
    try {
        const movies = await Movie.find(req.params.id);
        res.render('view-all-movie', { movies })
    } catch (err) {
        console.log(err);
        res.send("Error fetching movies");
    }
}

exports.editMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        res.render('edit-movie', { movie })
    } catch (err) {
        console.log(err);
        res.send("Error fetching movies");
    }
}

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        let posterName = movie.image;

        if (req.file) {
            fs.unlinkSync(`public/uploads/${movie.image}`);
            posterName = req.file.filename;
        }

        movie.title = req.body.title;
        movie.language = req.body.language.split(',').map(l => l.trim());
        movie.image = posterName;
        movie.duration = req.body.duration;
        movie.rating = req.body.rating;
        movie.genre = req.body.genre.split(',').map(g => g.trim());
        movie.desc = req.body.desc;

        await movie.save();

        res.redirect('/movies/viewAllMovie')
    } catch (err) {
        console.log(err);
        res.send("Error saving movie");
    }
}

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        
        fs.unlinkSync(`public/uploads/${movie.image}`);

        await Movie.findByIdAndDelete(movie._id)
        
        res.redirect('/movies/viewAllMovie')
    } catch (err) {
        console.log(err);
        res.send("Error saving movie");
    }
}