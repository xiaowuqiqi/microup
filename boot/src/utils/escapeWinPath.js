module.exports = function escapeWinPath(path) {
  if (!path) return null;
  return path.replace(/\\/g, '/');
};
