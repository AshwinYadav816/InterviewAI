const { join } = require('path');

/**
 * Store Puppeteer's Chrome inside the project directory instead of the default
 * ~/.cache/puppeteer. On hosts like Render, the home-directory cache is NOT
 * preserved from the build step to the running server, so Chrome "disappears"
 * at runtime. Keeping it in the project dir (which IS preserved) fixes that.
 */
module.exports = {
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
