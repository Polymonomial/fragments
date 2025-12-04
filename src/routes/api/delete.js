const { Fragment } = require('../../model/fragment');
const path = require('path');
module.exports = async (req, res) => {
  try {
    console.log('delete handler reached', req.user, req.params);
    let { id } = req.params;
    const ownerId = req.user;
    const ext = path.extname(req.path);

    if (ext) {
      id = id.slice(0, -ext.length);
    }
    if (!id) {
      return res
        .status(400)
        .json({ status: 'error', error: { code: 400, message: 'Missing fragment id' } });
    }
    const fragment = await Fragment.byId(ownerId, id);

    if (!fragment) {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'Fragment not found!' } });
    }

    await Fragment.delete(ownerId, id);
    return res.status(200).json({ status: 'ok', message: 'Fragment deleted successfully' });
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
