const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');
module.exports = (req, res) => {
  //console.log('POST handler reached', req.user, req.body);
  try {
    let type;
    let data;
    try {
      const parsed = contentType.parse(req);
      const ptype = parsed.type;
      const charset = parsed.parameters.charset;
      type = charset ? `${ptype};charset=${charset}` : ptype;
      console.log('Parsed content type:', type);
      if (!type) {
        return res
          .status(404)
          .json({ status: 'error', error: { code: 404, message: 'Missing type' } });
      }
      if (!Fragment.isSupportedType(type)) {
        return res.status(415).json({
          status: 'error',
          error: { code: 415, message: `Unsupported type: ${type}` },
        });
      }
    } catch (err) {
      console.error('Unknown or invalid Content-Type:', req.header('Content-Type', ''), err);
      return res.status(415).json({
        status: 'error',
        error: { code: 415, message: 'Unsupported or invalid Content-Type' },
      });
    }
    console.log('req.body type:', typeof req.body);
    if (type.startsWith('application/json')) {
      data = JSON.stringify(req.body);
    } else if (typeof req.body === 'string') {
      data = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      data = req.body;
      data = data.toString('utf8');
    } else if (req.body && typeof req.body === 'object') {
      data = req.body.data;
    }

    console.log('data received1:', data);
    if (!data) {
      return res
        .status(400)
        .json({ status: 'error', error: { code: 400, message: 'Missing data' } });
    }
    const fragment = new Fragment({ ownerId: req.user, type, size: Buffer.byteLength(data) });
    // Save the fragment to the database
    fragment.save();
    fragment.setData(data);
    // Respond with the created fragment
    // console.log('fragment:', fragment);
    const base = `${req.protocol}://${req.get('host')}`;
    const location = `${base}/v1/fragments/${fragment.id}`;
    res.set('Location', location);
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
