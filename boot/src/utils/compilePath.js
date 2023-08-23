function compilePath(mainPath, src, lib) {
  return mainPath.replace(new RegExp(src), lib);
}

module.exports = compilePath;
