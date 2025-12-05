const { Fragment } = require('../../model/fragment');
const contentType = require('content-type');

module.exports = async (req, res) => {
  try {
    console.log('update handler reached', req.user, req.params);
    const zaFrag = await Fragment.byId(req.user, req.params.id);
    if (!zaFrag) {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'Fragment not found!' } });
    }

    // Parse content type from request header
    let type;
    try {
      const parsed = contentType.parse(req);
      const ptype = parsed.type;
      const charset = parsed.parameters.charset;
      type = charset ? `${ptype};charset=${charset}` : ptype;
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: `Missing or invalid Content-Type header: ${error.message}` },
      });
    }

    // Check if content type matches the existing fragment type
    if (type !== zaFrag.type) {
      return res.status(400).json({
        status: 'error',
        error: {
          code: 400,
          message: `Content-Type ${type} does not match existing fragment type ${zaFrag.type}`,
        },
      });
    }

    // Process request body similar to post.js
    let data;
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'Missing request body data' },
      });
    }

    if (type.startsWith('application/json')) {
      data = JSON.stringify(req.body);
    } else if (typeof req.body === 'string') {
      data = req.body;
    } else if (Buffer.isBuffer(req.body)) {
      data = req.body;
      // Only convert to string for text-based content types, keep binary data as Buffer for images
      if (!type.startsWith('image/')) {
        data = data.toString('utf8');
      }
    } else if (req.body && typeof req.body === 'object') {
      data = req.body.data || req.body;
    }

    if (!data) {
      return res.status(400).json({
        status: 'error',
        error: { code: 400, message: 'No data provided' },
      });
    }

    // Update the fragment data
    await zaFrag.setData(data);

    return res.status(200).json({ status: 'ok', data: zaFrag });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: { code: 500, message: `idk, something broke: ${error.message}` },
    });
  }
};
