const MemoryDB = require('./memory-db');

const data = new MemoryDB();
const metadata = new MemoryDB();

function writeFragment(fragment) {
  const serialized = JSON.stringify(fragment);
  return metadata.put(fragment.ownerid, 'metadata', fragment.id, serialized);
}

async function readFragment(ownerid, fragmentid) {
  const serialized = await metadata.get(ownerid, fragmentid);
  return typeof serialized === 'string' ? JSON.parse(serialized) : serialized;
}

function writeFragmentdata(ownerid, id, buffer) {
  return data.put(ownerid, id, buffer);
}

function readFragmentdata(ownerid, id) {
  return data.get(ownerid, id);
}

async function listFragments(ownerId, expand = false) {
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) {
    return fragments;
  }

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
}

function deleteFragment(ownerId, id) {
  return Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);
}

module.exports.writeFragment = writeFragment;
module.exports.readFragment = readFragment;
module.exports.writeFragmentdata = writeFragmentdata;
module.exports.readFragmentdata = readFragmentdata;
module.exports.listFragments = listFragments;
module.exports.deleteFragment = deleteFragment;
