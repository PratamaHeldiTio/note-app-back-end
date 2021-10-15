const exportNotesPayloadSchema = require('./shema');
const InvariantError = require('../../exceptions/InvariantError');

const exportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validateResult = exportNotesPayloadSchema.validate(payload);

    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = exportsValidator;
