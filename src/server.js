require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

// notes
const notes = require('./api/notes');
const NotesService = require('./sevices/postgres/NotesService');
const notesValidator = require('./validator/notes');

// users
const users = require('./api/users');
const UsersService = require('./sevices/postgres/UsersService');
const usersValidator = require('./validator/user');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./sevices/postgres/AuthenticationService');
const authenticationsValidator = require('./validator/authentication');
const tokenManager = require('./token/tokenManager');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./sevices/postgres/CollaborationsService');
const collaborationsValidator = require('./validator/collaborations');

// export
const _exports = require('./api/exports');
const producerService = require('./sevices/rabbitmq/producerService');
const exportsValidator = require('./validator/exports');

const init = async () => {
  const collaborationsService = new CollaborationsService();
  const notesService = new NotesService(collaborationsService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

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
      plugin: Jwt,
    },
  ]);

  // definisikan strategy authentication jwt
  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { id: artifacts.decoded.payload.id },
    }),
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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager,
        validator: authenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        notesService,
        validator: collaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: producerService,
        validator: exportsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
