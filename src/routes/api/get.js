const { Fragment } = require('../../model/fragment');
module.exports = async (req, res) => {
  try {
    console.log('get handler reached', req.user, req.params);
    const { id } = req.params;
    const ownerId = req.user;
    //
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
    const fragmentdata = await fragment.getData();
    console.log('fragment 123data retrieved:', fragmentdata.toString());
    res.status(200).json({ status: 'ok', data: fragmentdata.toString() });

    if (req.oringinalUrl.endsWith('/info')) {
      return res.status(200).json({ status: 'ok', data: fragment });
    }
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
