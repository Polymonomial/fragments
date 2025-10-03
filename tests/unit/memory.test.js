const { writeFragment } = require('../../src/model/data/memory/index.js');
//const MemoryDB = require('./memory-db.js');

describe('memory db calls', () => {
  // beforeEach(() => {
  //   const data = new MemoryDB();
  //   const metadata = new MemoryDB();
  // });
  test('writeFragment() returns nothing', async () => {
    const result = writeFragment({ ownerid: '114514', id: '1919810', testdata: [] });
    expect(result).toBe(undefined);
  });
});
