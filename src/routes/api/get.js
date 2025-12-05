const { Fragment } = require('../../model/fragment');
const path = require('path');
const markdownIt = require('markdown-it')();
const sharp = require('sharp');
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
    let typeCorrect;
    switch (ext) {
      case '.png':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('image/png')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to image/png`,
            },
          });
        } else {
          const imageData = await fragment.getData();
          const convertedImage = await sharp(imageData).png().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'image/png',
              size: convertedImage.length,
              data: convertedImage.toString('base64'),
            },
          });
        }
      case '.jpg':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('image/jpeg')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to image/jpg`,
            },
          });
        } else {
          const imageData = await fragment.getData();
          const convertedImage = await sharp(imageData).jpeg().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'image/jpeg',
              size: convertedImage.length,
              data: convertedImage.toString('base64'),
            },
          });
        }
      case '.webp':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('image/webp')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to image/webp`,
            },
          });
        } else {
          const imageData = await fragment.getData();
          const convertedImage = await sharp(imageData).webp().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'image/webp',
              size: convertedImage.length,
              data: convertedImage.toString('base64'),
            },
          });
        }
      case '.avif':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('image/avif')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to image/avif`,
            },
          });
        } else {
          const imageData = await fragment.getData();
          const convertedImage = await sharp(imageData).avif().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'image/avif',
              size: convertedImage.length,
              data: convertedImage.toString('base64'),
            },
          });
        }
      case '.gif':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('image/gif')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to image/gif`,
            },
          });
        } else {
          const imageData = await fragment.getData();
          const convertedImage = await sharp(imageData).gif().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'image/gif',
              size: convertedImage.length,
              data: convertedImage.toString('base64'),
            },
          });
        }
      case '.txt':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('text/plain')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to text/plain`,
            },
          });
        } else {
          const txtData = await fragment.getData();
          //const convertedImage = await sharp(imageData).png().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'text/plain',
              size: txtData.length,
              data: txtData.toString('utf8'),
            },
          });
        }
      case '.md':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('text/markdown')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to text/markdown`,
            },
          });
        } else {
          const txtData = await fragment.getData();
          //const convertedImage = await sharp(imageData).png().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'text/markdown',
              size: txtData.length,
              data: txtData.toString('utf8'),
            },
          });
        }
      case '.html':
        typeCorrect = await fragment.formats;
        console.log('typeCorrect:', typeCorrect);
        if (!typeCorrect.includes('text/html')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to text/html`,
            },
          });
        } else if (fragment.mimeType === 'text/markdown') {
          const markdownData = await fragment.getData();
          const html = markdownIt.render(markdownData.toString()).trim();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'text/html',
              size: html.length,
              data: html,
            },
          });
        } else {
          const txtData = await fragment.getData();
          //const convertedImage = await sharp(imageData).png().toBuffer();
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'text/html',
              size: txtData.length,
              data: txtData.toString('utf8'),
            },
          });
        }
      case '.csv':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('text/csv')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to text/csv`,
            },
          });
        } else {
          const rawData = await fragment.getData();
          // For CSV conversion, just return the data as CSV format
          const csvData = rawData.toString('utf8');
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'text/csv',
              size: csvData.length,
              data: csvData,
            },
          });
        }
      case '.json':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('application/json')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to application/json`,
            },
          });
        } else {
          const rawData = await fragment.getData();
          let jsonData;
          try {
            // Parse the data as JSON or convert to JSON format
            jsonData = JSON.parse(rawData.toString('utf8'));
          } catch {
            // If not valid JSON, wrap the string data as JSON
            jsonData = { data: rawData.toString('utf8') };
          }
          const jsonString = JSON.stringify(jsonData);
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'application/json',
              size: jsonString.length,
              data: jsonString,
            },
          });
        }
      case '.yaml':
        typeCorrect = await fragment.formats;
        if (!typeCorrect.includes('application/yaml')) {
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to application/yaml`,
            },
          });
        } else {
          const rawData = await fragment.getData();
          let yamlData;
          try {
            // If data is JSON, convert to YAML
            const jsonData = JSON.parse(rawData.toString('utf8'));
            const YAML = require('yaml');
            yamlData = YAML.stringify(jsonData);
          } catch {
            // If not JSON, treat as plain text and return as-is
            yamlData = rawData.toString('utf8');
          }
          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: 'application/yaml',
              size: yamlData.length,
              data: yamlData,
            },
          });
        }
      default:
        if (ext === '') {
          const fragmentdata = await fragment.getData();
          let responseData;

          // Handle different content types appropriately
          if (fragment.mimeType === 'application/json') {
            try {
              responseData = JSON.parse(fragmentdata.toString());
            } catch (error) {
              // If parsing fails, return as string
              console.error('Failed to parse JSON fragment data:', error);
              responseData = fragmentdata.toString();
            }
          } else if (fragment.mimeType.startsWith('image/')) {
            // For images, return as base64 encoded string
            responseData = fragmentdata.toString('base64');
          } else {
            // For text-based content, return as string
            responseData = fragmentdata.toString();
          }

          return res.status(200).json({
            status: 'ok',
            data: {
              contentType: fragment.mimeType,
              size: fragment.size,
              data: responseData,
            },
          });
        } else {
          // Unsupported extension
          return res.status(415).json({
            status: 'error',
            error: {
              code: 415,
              message: `Unsupported conversion from ${fragment.mimeType} to ${ext}`,
            },
          });
        }
    }
    // const raw = await fragment.getData();
    // let payload;

    // if (fragment.mimeType.startsWith('application/json')) {
    //   // For JSON fragments, the tests expect an actual JSON value here
    //   try {
    //     payload = JSON.parse(raw.toString('utf8'));
    //   } catch (error) {
    //     console.log(error); // If parsing fails for some reason, fall back to string
    //     payload = raw.toString('utf8');
    //   }
    // } else {
    //   // Non-JSON fragments are always returned as strings
    //   payload = raw.toString('utf8');
    // }

    // console.log('content of type:', fragment.mimeType);
    // console.log('fragment 123data retrieved:', fragment);

    // return res.status(200).json({
    //   status: 'ok',
    //   data: {
    //     contentType: fragment.mimeType,
    //     size: fragment.size,
    //     data: payload,
    //   },
    // });
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
