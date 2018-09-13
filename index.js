'use strict';

const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const API_KEY = require('./apiKey')

const server = express()

server.use(bodyParser.urlencoded({
	extended: true
}));

server.use(bodyParser.json());

server.post('/get-movie-details', (req, res) => {

	const movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
	const reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
	http.get(reqUrl, (responseFromAPI) => {
		let completeResponse = '';

		responseFromAPI.on('data', (chunk) => {
			completeResponse += chunk;
		});


		// console.log(responseFromAPI);
		
		responseFromAPI.on('end', () => {
			const movie = JSON.parse(completeResponse);
			let dataToSend = movieToSearch == 'The Godfather' ? 'I dont have the required info on that. Here is some info on The Godfather instead ' : '';
			dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}`;

			return res.json({
				speech: dataToSend,
				displayText: dataToSend,
				source: 'get-movie-details',
				responseFromAPI: movie
			});
		})
	}, (error) => {
		return res.json({
			speech: 'Something went wrong!',
			displayText: 'Something went wrong!',
			source: 'get-movie-details'
		})
	});
});

server.listen((process.env.PORT || 8080), () => {
	console.log('Server is up and running...');
});