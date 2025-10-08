const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
module.exports = (req, res) => {
  console.log('POST handler reached', req.user, req.body);
  try {
    let type;
    let data;
    try {
      type = contentType.parse(req).type;
      if (!type) {
        return res
          .status(400)
          .json({ status: 'error', error: { code: 400, message: 'Missing type' } });
      }
    } catch (err) {
      console.error('Unknown or invalid Content-Type:', req.header('Content-Type'));
      return res.status(415).json({
        status: 'error',
        error: { code: 415, message: 'Unsupported or invalid Content-Type' },
      });
    }
    if (typeof req.body === 'string') {
      data = req.body;
    } else if (req.body && typeof req.body === 'object') {
      data = req.body.data;
    }
    if (!data) {
      return res
        .status(400)
        .json({ status: 'error', error: { code: 400, message: 'Missing data' } });
    }

    const fragment = new Fragment({ ownerId: req.user, type, size: Buffer.byteLength(data) });
    // Save the fragment to the database
    fragment.save();
    // Respond with the created fragment
    console.log('fragment:', fragment);
    res.status(201).json({ status: 'ok', data: fragment });
  } catch (error) {
    console.error('Error creating fragment:', error);
    res.status(500).json({
      status: 'error',
      error: {
        code: 500,
        message: error && error.message ? error.message : String(error) || 'Internal Server Error',
      },
    });
  }
};
