import path from 'path';

function absolutePath(relativePathByRoot) {
  let _path = null
  try {
    _path = relativePathByRoot.startsWith('.') ? path.resolve(relativePathByRoot) : require.resolve(relativePathByRoot)
  } catch (err){
    console.warn(relativePathByRoot+' not found, defaulting to using routes.nunjucks.js to handle directly.')
  }
  return _path
}

module.exports = absolutePath;
