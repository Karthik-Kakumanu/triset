const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..', '..');
const storageDir = path.join(rootDir, 'storage');

module.exports = { rootDir, storageDir };
