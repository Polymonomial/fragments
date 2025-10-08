const { createSuccessResponse } = require('../../response');
const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  try {
    const ownerId = req.user;

    const fragment = await Fragment.byUser(ownerId);

    if (!fragment) {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'Fragment not found!' } });
    }

    res.status(200).json({ status: 'ok', data: [fragment] });
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
