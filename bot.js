const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const config = require('./config.js');

const bot = new TelegramBot(config.telegramToken, {polling: true});
const app = express();
const PORT = 8225;

app.use(express.json());

// Ruta para recibir los mensajes
app.post(`/bot${config.telegramToken}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Comando /buscar
bot.onText(/\/buscar (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
      params: {
        api_key: config.movieDbKey,
        query: query,
        language: 'es'
      }
    });

    const movie = response.data.results[0];
    if (movie) {
      const posterUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
      const posterCaption = `Título: ${movie.title}\nTítulo original: ${movie.original_title}\nGénero: ${movie.genres.map(genre => genre.name).join(', ')}\nAño de estreno: ${movie.release_date.substring(0, 4)}\nIdioma original: ${movie.original_language}\nSinopsis: ${movie.overview}\nTrailer: https://www.youtube.com/watch?v=${movie.video_key}`;

      bot.sendPhoto(chatId, posterUrl, { caption: posterCaption });
    } else {
      bot.sendMessage(chatId, 'No se encontró ninguna película con ese título');
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Ocurrió un error al buscar la película');
  }
});

// Comando /id
bot.onText(/\/id (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const movieId = match[1];

  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: config.movieDbKey,
        language: 'es'
      }
    });

    const movie = response.data;
    if (movie) {
      const posterUrl = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
      const posterCaption = `Título: ${movie.title}\nTítulo original: ${movie.original_title}\nGénero: ${movie.genres.map(genre => genre.name).join(', ')}\nAño de estreno: ${movie.release_date.substring(0, 4)}\nIdioma original: ${movie.original_language}\nSinopsis: ${movie.overview}\nTrailer: https://www.youtube.com/watch?v=${movie.video_key}`;

      bot.sendPhoto(chatId, posterUrl, { caption: posterCaption });
    } else {
      bot.sendMessage(chatId, 'No se encontró ninguna película con ese ID');
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, 'Ocurrió un error al buscar la película');
  }
});

// Manejar el error de autenticación de Telegram
bot.on("polling_error", (error) => {
  console.error(error);
});

app.listen(PORT, () => {
  console.log(`Bot listening on port ${PORT}`);
});
