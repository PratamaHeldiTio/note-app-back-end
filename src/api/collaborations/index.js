const CollaborationHandler = require('./Handler');
const routes = require('./routes');

module.exports = {
  name: 'collaboration',
  version: '1.0.0',
  register: (server, { collaborationsService, notesService, validator }) => {
    const collaborationHandler = new CollaborationHandler(collaborationsService,
      notesService, validator);

    server.route(routes(collaborationHandler));
  },
};
