const InvariantError = require('../../exceptions/InvariantError');
const imageHeadersSchema = require('./schema');

const uploadsValidator = {
  validateImageHeaders: (headers) => {
    const valdiateResult = imageHeadersSchema.validate(headers);

    if (valdiateResult.error) {
      throw new InvariantError(valdiateResult.error.message);
    }
  },
};

module.exports = uploadsValidator;
