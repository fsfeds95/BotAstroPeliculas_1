// Importar las dependencias necesarias
const Telegraf = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('6980968831:AAG41Ii-Go9JMiIyXJKpjQHBFHj9AzDBXPI');

// Comando /buscar para buscar películas por título en español o título original
bot.command('buscar', async (ctx) => {
  const title = ctx.message.text.split(' ').slice(1).join(' ');

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '74dc824830c7f93dc61b03e324070886',
        query: title,
        language: 'es-MX'
      }
    });

    const movie = response.data.results[0];
    if (movie) {
      const posterPath = movie.poster_path;
      const titleES = movie.title;
      const titleOriginal = movie.original_title;
      const genres = movie.genres.map((genre) => genre.name).join(', ');
      const releaseYear = movie.release_date.split('-')[0];
      const originalLanguage = movie.original_language;
      const overview = movie.overview;

      let imageUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
      imageUrl = imageUrl.replace('.jpg', '.svg') || imageUrl;

      await ctx.replyWithPhoto({ url: imageUrl }, { caption: `${titleES} (${titleOriginal})\nGéneros: ${genres}\nAño de estreno: ${releaseYear}\nIdioma original: ${originalLanguage}\nSinopsis: ${overview}` });
    } else {
      await ctx.reply('No se encontraron resultados para la búsqueda.');
    }
  } catch (error) {
    console.error(error);
    await ctx.reply('Ocurrió un error durante la búsqueda.');
  }
});

// Comando /id para buscar películas por ID
bot.command('id', async (ctx) => {
  const movieId = ctx.message.text.split(' ')[1];

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: '74dc824830c7f93dc61b03e324070886',
        language: 'es-MX'
      }
    });

    const movie = response.data;
    if (movie) {
      const posterPath = movie.poster_path;
      const titleES = movie.title;
      const titleOriginal = movie.original_title;
      const genres = movie.genres.map((genre) => genre.name).join(', ');
      const releaseYear = movie.release_date.split('-')[0];
      const originalLanguage = movie.original_language;
      const overview = movie.overview;

      let imageUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
      imageUrl = imageUrl.replace('.jpg', '.svg') || imageUrl;

      await ctx.replyWithPhoto({ url: imageUrl }, { caption: `${titleES} (${titleOriginal})\nGéneros: ${genres}\nAño de estreno: ${releaseYear}\nIdioma original: ${originalLanguage}\nSinopsis: ${overview}` });
    } else {
      await ctx.reply('No se encontraron resultados para la búsqueda.');
    }
  } catch (error) {
    console.error(error);
    await ctx.reply('Ocurrió un error durante la búsqueda.');
  }
});

// Iniciar el bot
bot.launch();