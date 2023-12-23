const Telegraf = require('telegraf');
const axios = require('axios');
const fs = require('fs');
require('.env').config();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.start((ctx) => ctx.reply('¡Hola! Puedes buscar películas ingresando el título en español, el título original o el ID de la película.'));

bot.command('buscar', async (ctx) => {
  const title = ctx.message.text.split(' ').slice(1).join(' ');
  const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${encodeURIComponent(title)}&language=es`);

  if (response.data.results.length === 0) {
    ctx.reply('No se encontraron resultados para esa búsqueda.');
  } else {
    const movie = response.data.results[0];
    const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const genres = movie.genres.map((genre) => genre.name).join(', ');

    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const resizedImage = await sharp(image.data).resize(1280, 720).toBuffer();

    ctx.replyWithPhoto({ source: resizedImage });

    ctx.reply(`Título en español: ${movie.title}`);
    ctx.reply(`Título original: ${movie.original_title}`);
    ctx.reply(`Géneros: ${genres}`);
    ctx.reply(`Año de estreno: ${movie.release_date.slice(0, 4)}`);
    ctx.reply(`Idioma original: ${movie.original_language}`);
    ctx.reply(`Sinopsis: ${movie.overview}`);

    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.MOVIEDB_API_KEY}`);
    const trailerKey = videoResponse.data.results[0].key;
    const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

    ctx.reply(`Trailer: ${trailerUrl}`);
  }
});

bot.command('id', async (ctx) => {
  const movieId = ctx.message.text.split(' ')[1];
  const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.MOVIEDB_API_KEY}&language=es`);

  if (response.data) {
    const movie = response.data;
    const imageUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    const genres = movie.genres.map((genre) => genre.name).join(', ');

    const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const resizedImage = await sharp(image.data).resize(1280, 720).toBuffer();

    ctx.replyWithPhoto({ source: resizedImage });

    ctx.reply(`Título en español: ${movie.title}`);
    ctx.reply(`Título original: ${movie.original_title}`);
    ctx.reply(`Géneros: ${genres}`);
    ctx.reply(`Año de estreno: ${movie.release_date.slice(0, 4)}`);
    ctx.reply(`Idioma original: ${movie.original_language}`);
    ctx.reply(`Sinopsis: ${movie.overview}`);

    const videoResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.MOVIEDB_API_KEY}`);
    const trailerKey = videoResponse.data.results[0].key;
    const trailerUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

    ctx.reply(`Trailer: ${trailerUrl}`);
  } else {
    ctx.reply('No se encontró una película con ese ID.');
  }
});

bot.launch();
