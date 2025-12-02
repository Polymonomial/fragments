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
    if (req.originalUrl.endsWith('/info')) {
      console.log('info endpoint reached');
      return res.status(200).json({
        status: 'ok',
        data: {
          id: fragment.id,
          ownerId: fragment.ownerId,
          created: fragment.created,
          updated: fragment.updated,
          fragment,
        },
      });
      // console.log('info endpoint reached');
      // return res.status(200).json({ status: 'ok', data: fragment });
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
      // const fragmentdata = await fragment.getData();
      // console.log('content of type:', fragment.mimeType);
      // console.log('fragment 123data retrieved:', fragment);
      // res.status(200).json({
      //   status: 'ok',
      //   data: {
      //     contentType: fragment.mimeType,
      //     size: fragment.size,
      //     data: fragmentdata.toString(),
      //   },
      // });
      const raw = await fragment.getData();
      let payload;

      if (fragment.mimeType.startsWith('application/json')) {
        // For JSON fragments, the tests expect an actual JSON value here
        try {
          payload = JSON.parse(raw.toString('utf8'));
        } catch (error) {
          console.log(error); // If parsing fails for some reason, fall back to string
          payload = raw.toString('utf8');
        }
      } else {
        // Non-JSON fragments are always returned as strings
        payload = raw.toString('utf8');
      }

      console.log('content of type:', fragment.mimeType);
      console.log('fragment 123data retrieved:', fragment);

      return res.status(200).json({
        status: 'ok',
        data: {
          contentType: fragment.mimeType,
          size: fragment.size,
          data: payload,
        },
      });
    }
  } catch (error) {
    console.error('Error fetching fragment:', error);

    // 🔹 Fragment not found in DynamoDB
    if (error.message === 'Fragment not found') {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'Fragment not found' } });
    }

    // 🔹 Fragment metadata exists but S3 object is missing
    if (error.message === 'unable to read fragment data') {
      return res
        .status(404)
        .json({ status: 'error', error: { code: 404, message: 'Fragment not found' } });
    }

    // 🔹 Anything else really is a server error
    return res
      .status(500)
      .json({ status: 'error', error: { code: 500, message: 'idk, something broke' } });
  }
};
