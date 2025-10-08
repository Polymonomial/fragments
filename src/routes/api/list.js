const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  try {
    const ownerId = req.user;
    const fragment = await Fragment.byUser(ownerId);

    res.status(200).json({ status: 'ok', data: [fragment] });
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
