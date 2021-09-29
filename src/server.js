require('dotenv').config();
const Hapi = require('@hapi/hapi');
const notes = require('./api/notes');
const NotesService = require('./sevices/postgres/NotesService');
const notesValidator = require('./validator/notes');
const users = require('./api/users');
const UsersService = require('./sevices/postgres/UsersService');
const usersValidator = require('./validator/user');

const init = async () => {
  const notesService = new NotesService();
  const usersService = new UsersService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: notesService,
        validator: notesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: usersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
