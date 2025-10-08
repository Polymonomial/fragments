// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentdata,
  writeFragmentdata,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    // TODO
    if (!ownerId) throw new Error('Fragment must have a valid ownerId');
    if (!type || !Fragment.isSupportedType(type))
      throw new Error('Fragment must have a valid type');
    if (typeof size != `number` || size < 0)
      throw new Error('Fragment size must be a valid positive number');
    this.id = id || randomUUID();
    this.ownerId = ownerId;
    this.created = created || new Date().toISOString();
    this.updated = updated || new Date().toISOString();
    this.type = type;
    this.size = size;
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    // TODO
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerid, id) {
    // TODO
    // TIP: make sure you properly re-create a full Fragment instance after getting from db.
    const fragmentData = await readFragment(ownerid, id);
    return new Fragment(fragmentData);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    // TODO
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment (metadata) to the database
   * @returns Promise<void>
   */
  save() {
    // TODO
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    // TODO
    const data = readFragmentdata(this.ownerId, this.id).then((datas) => {
      return Buffer.from(datas);
    });
    return data;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // TODO
    // TIP: make sure you update the metadata whenever you change the data, so they match
    const strDATA = data.toString();
    this.size++;
    await writeFragmentdata(this.ownerId, this.id, strDATA);
    this.save();
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    // TODO
    return this.mimeType.startsWith('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    // TODO
    switch (this.mimeType) {
      case 'text/plain':
        return ['text/plain'];
      case 'text/markdown':
        return ['text/markdown', 'text/html', 'text/plain'];
      // case 'text/html':
      //   return ['text/html', 'text/plain'];
      // case 'text/csv':
      //   return ['text/csv', 'text/plain', 'application/json'];
      // case 'application/json':
      //   return ['application/json', 'text/plain', 'application/yml', 'application/yaml'];
      // case 'application/yaml':
      //   return ['application/yaml', 'plain/text'];
      // case 'image/png':
      //   return ['image/png', 'image/jpg', 'image/ webp', 'image/avif', 'image/gif'];
      // case 'image/jpg':
      //   return ['image/png', 'image/jpg', 'image/ webp', 'image/avif', 'image/gif'];
      // case 'image/webp':
      //   return ['image/png', 'image/jpg', 'image/ webp', 'image/avif', 'image/gif'];
      // case 'image/avif':
      //   return ['image/png', 'image/jpg', 'image/ webp', 'image/avif', 'image/gif'];
      // case 'image/gif':
      //   return ['image/png', 'image/jpg', 'image/ webp', 'image/avif', 'image/gif'];
      default:
        return [];
    }
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // TODO
    const SUPPORTED_TYPES = [
      'text/plain',
      'text/html',
      'application/json',
      'text/markdown',
      'text/csv',
      'application/yml',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/webp',
      'image/avif',
      // add more as needed
    ];
    const { type } = contentType.parse(value);
    return SUPPORTED_TYPES.includes(type);
  }
}

module.exports.Fragment = Fragment;
