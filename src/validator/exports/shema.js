const Joi = require('joi');

const exportNotesPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportNotesPayloadSchema;
