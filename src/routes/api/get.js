const { Fragment } = require('../../model/fragment');
const path = require('path');
const markdownIt = require('markdown-it')();
module.exports = async (req, res) => {
  try {
    console.log('get handler reached', req.user, req.params);
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

    if (ext === '.md' && fragment.mimeType === 'text/markdown') {
      const markdownData = await fragment.getData();
      console.log('fkoff');
      const html = markdownIt.render(markdownData.toString()).trim();
      res.status(200).json({
        status: 'ok',
        data: {
          contentType: fragment.mimeType,
          size: fragment.size,
          data: html,
        },
      });
    } else {
      const fragmentdata = await fragment.getData();
      console.log('content of type:', fragment.mimeType);
      console.log('fragment 123data retrieved:', fragment);
      res.status(200).json({
        status: 'ok',
        data: {
          contentType: fragment.mimeType,
          size: fragment.size,
          data: fragmentdata.toString(),
        },
      });
    }
    // if (req.oringinalUrl.endsWith('/info')) {
    //   return res.status(200).json({ status: 'ok', data: fragment });
    // }
  } catch (error) {
    console.error('Error fetching fragment:', error);
    res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
