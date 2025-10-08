const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user;
    // console.log(id);
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
    res.status(200).json({ status: 'ok', data: fragment });
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
