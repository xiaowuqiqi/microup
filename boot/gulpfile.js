const path = require('path');
const gulp = require('gulp');
const rimraf = require('rimraf'); // node小工具递归删除一个目录
const babel = require('gulp-babel');
const through2 = require('through2');
const getBabelCommonConfig = require('./src/bin/common/config/getBabelCommonConfig');

const libDir = path.resolve('lib');

//////////// compile
function babelify(js, dir = '') {
  const exclude = /(routes|entry)\.nunjucks\.(js|jsx)/;
  const babelConfig = getBabelCommonConfig({mode:'boot-compile'});
  return js
    .pipe(babel(babelConfig))
    .pipe(through2.obj(function (file, encoding, next) {
      const matches = file.path.match(exclude);
      if (matches) {
        const content = file.contents.toString(encoding);
        file.contents = Buffer.from(content
          .replace(`'{{ ${matches[1]} }}'`, `{{ ${matches[1]} }}`)
          .replace(`'{{ master }}'`, '{{ master }}'));
      }
      this.push(file);
      next();
    }))
    .pipe(gulp.dest(path.join(libDir, dir)));
}

const delLib = (done) => { // 删除陈旧 lib
  rimraf.sync(libDir); //同步形式删除
  done()
}

function compileAssets() { // assets 静态文件到 lib
  return gulp.src(['src/**/*.@(jpeg|jpg|png|svg|scss|less|html|ico|gif|css|json)','!src/exampleMaster/**/*']).pipe(gulp.dest(libDir));
}

function compileJS_TS() { // babel 编译 js 到 lib

  return babelify(gulp.src(['src/**/*.@(js|ts)?(x)', '!src/exampleMaster/**/*']));
}

exports.compile = gulp.series(delLib, gulp.parallel(compileAssets, compileJS_TS))
