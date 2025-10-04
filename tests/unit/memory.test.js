const {
  writeFragment,
  readFragment,
  writeFragmentdata,
  readFragmentdata,
} = require('../../src/model/data/memory/index.js');
//const MemoryDB = require('./memory-db.js');

describe('memory db calls', () => {
  // beforeEach(() => {
  //   const data = new MemoryDB();
  //   const metadata = new MemoryDB();
  // });
  test('writeFragment() returns nothing', async () => {
    const result = await writeFragment({ ownerid: '114514', id: '1919810', testdata: [] });
    expect(result).toBe(undefined);
  });

  test('writeFragment() correctely stores data', async () => {
    await writeFragment({
      ownerid: '114514',
      id: '1919810',
      testdata: [1, 9, 1, 9, 8, 1, 0],
    });
    const results = await readFragment('114514', '1919810');
    expect(results).toEqual({ ownerid: '114514', id: '1919810', testdata: [1, 9, 1, 9, 8, 1, 0] });
  });

  test(`writeFragment() returns a promise`, async () => {
    const result = writeFragment({ ownerid: '114514', id: '1919810', testdata: [] });
    expect(result).toBeInstanceOf(Promise);
  });

  test(`readFragment() returns undefined for unknown fragment`, async () => {
    await writeFragment({ ownerid: '114514', id: '1919810', testdata: 'yjsp' });
    const result = await readFragment('114513', '1919812');
    expect(result).toBe(undefined);
  });

  test(`readFragment() returns the correct fragment`, async () => {
    await writeFragment({ ownerid: '114514', id: '1919810', testdata: 'yjsp' });
    const result = await readFragment('114514', '1919810');
    expect(result).toEqual({ ownerid: '114514', id: '1919810', testdata: 'yjsp' });
  });

  test(`readFragment() returns a promise`, async () => {
    await writeFragment({ ownerid: '114514', id: '1919810', testdata: 'yjsp' });
    const result = readFragment('114514', '1919810');
    expect(result).toBeInstanceOf(Promise);
  });

  test(`writeFragmentData() returns nothing`, async () => {
    const result = await writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    expect(result).toBe(undefined);
  });

  test(`writeFragmentData() correctly stores data`, async () => {
    await writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    const result = await readFragmentdata('114514', '1919810');
    expect(result).toEqual(Buffer.from('yjsp'));
  });

  test(`writeFragmentData() returns a promise`, async () => {
    const result = writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    expect(result).toBeInstanceOf(Promise);
  });

  test(`readFragmentData() returns undefined for unknown fragment`, async () => {
    await writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    const result = await readFragmentdata('hajimi', 'mambo');
    expect(result).toBe(undefined);
  });

  test(`readFragmentData() returns correct fragment`, async () => {
    await writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    const result = await readFragmentdata('114514', '1919810');
    const resultSTR = result.toString();
    expect(resultSTR).toBe('yjsp');
  });

  test(`readFragmentData() returns a promise`, async () => {
    await writeFragmentdata('114514', '1919810', Buffer.from('yjsp'));
    const result = readFragmentdata('114514', '1919810');
    expect(result).toBeInstanceOf(Promise);
  });
});
