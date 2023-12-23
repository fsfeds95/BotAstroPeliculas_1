const { Telegraf } = require('telegraf');
const axios = require('axios');

const token = '6980968831:AAG41Ii-Go9JMiIyXJKpjQHBFHj9AzDBXPI'; // Reemplaza con el token de tu bot de Telegram
const apiKey = '74dc824830c7f93dc61b03e324070886'; // API key de TheMovieDB

const bot = new Telegraf(token);

bot.start((ctx) => ctx.reply('¡Hola! Envía el comando /buscar seguido del título de una película para buscar información de películas.'));

bot.command('buscar', async (ctx) => {
  const query = ctx.message.text.split(' ').slice(1).join(' ');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`
    );

    if (response.data.results.length > 0) {
      const movie = response.data.results[0];
      const posterPath = movie.poster_path;
      const title = movie.title;
      const originalTitle = movie.original_title;
      const genres = movie.genres.map((genre) => genre.name).join(', ');
      const releaseYear = movie.release_date.split('-')[0];
      const originalLanguage = movie.original_language;
      const overview = movie.overview;
      const trailer = await getMovieTrailer(movie.id);

      const posterUrl = getPosterUrl(posterPath);
      const trailerUrl = `https://www.youtube.com/watch?v=${trailer}`;

      ctx.replyWithPhoto({ url: posterUrl }, { caption: `${title} (${originalTitle})` });
      ctx.reply(`Géneros: ${genres}`);
      ctx.reply(`Año de estreno: ${releaseYear}`);
      ctx.reply(`Idioma original: ${originalLanguage}`);
      ctx.reply(`Sinopsis: ${overview}`);
      ctx.reply(`Trailer: ${trailerUrl}`);
    } else {
      ctx.reply('No se encontraron películas con ese título.');
    }
  } catch (error) {
    console.error(error);
    ctx.reply('Ocurrió un error al buscar la película.');
  }
});

bot.command('id', async (ctx) => {
  const movieId = ctx.message.text.split(' ').slice(1).join(' ');

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    );

    const movie = response.data;
    const posterPath = movie.poster_path;
    const title = movie.title;
    const originalTitle = movie.original_title;
    const genres = movie.genres.map((genre) => genre.name).join(', ');
    const releaseYear = movie.release_date.split('-')[0];
    const originalLanguage = movie.original_language;
    const overview = movie.overview;
    const trailer = await getMovieTrailer(movie.id);

    const posterUrl = getPosterUrl(posterPath);
    const trailerUrl = `https://www.youtube.com/watch?v=${trailer}`;

    ctx.replyWithPhoto({ url: posterUrl }, { caption: `${title} (${originalTitle})` });
    ctx.reply(`Géneros: ${genres}`);
    ctx.reply(`Año de estreno: ${releaseYear}`);
    ctx.reply(`Idioma original: ${originalLanguage}`);
    ctx.reply(`Sinopsis: ${overview}`);
    ctx.reply(`Trailer: ${trailerUrl}`);
  } catch (error) {
    console.error(error);
    ctx.reply('Ocurrió un error al obtener la película.');
  }
});

async function getMovieTrailer(movieId) {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`
    );

    const videos = response.data.results.filter((video) => video.type === 'Trailer');

    if (videos.length > 0) {
      return videos[0].key;
    } else {
      return '';
    }
  } catch (error) {
    console.error(error);
    return '';
  }
}

function getPosterUrl(posterPath) {
  if (posterPath) {
    const baseUrl = 'https://image.tmdb.org/t/p/original';
    const posterUrl = `${baseUrl}${posterPath}`;

    return posterUrl.endsWith('.svg') ? posterUrl : `${posterUrl}.jpg`;
  } else {
    return '';
  }
}

bot.launch();