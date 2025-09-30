const validateKey = (key) => typeof key === 'string';

class MemoryDB {
  constructor() {
    /** @type {Record<string, any>} */
    this.db = {};
  }
  /**
   * Gets a value for the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns {Promise<any>}
   */

  get(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `Primary and secondary keys are required and must be strings, got: primarykey =${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    const db = this.db;
    const value = db[primaryKey] && db[primaryKey][secondaryKey];
    return Promise.resolve(value);
  }

  /**
   * Puts a value into the given primaryKey and secondaryKey
   * @param {string} primaryKey
   * @param {string} secondaryKey
   * @returns {Promise<void>}
   */

  query(primaryKey) {
    if (!validateKey(primaryKey)) {
      throw new Error(`The primary key you provided is invalid: primarykey =${primaryKey}`);
    }

    const db = this.db;
    const values = db[primaryKey] ? Object.values(db[primaryKey]) : [];
    return Promise.resolve(values);
  }

  async del(primaryKey, secondaryKey) {
    if (!(validateKey(primaryKey) && validateKey(secondaryKey))) {
      throw new Error(
        `Primary and secondary keys are required and must be strings, got: primarykey =${primaryKey}, secondaryKey=${secondaryKey}`
      );
    }
    if (!(await this.get(primaryKey, secondaryKey))) {
      throw new Error(`No entry found for primaryKey=${primaryKey}, secondaryKey=${secondaryKey}`);
    }

    const db = this.db;
    delete db[primaryKey][secondaryKey];
    return Promise.resolve();
  }
}

module.export = MemoryDB;
