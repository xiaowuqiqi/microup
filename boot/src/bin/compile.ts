import path from 'path';
import gulp from 'gulp';
import rimraf from 'rimraf';
import babel from 'gulp-babel';
import aliases from 'gulp-style-aliases';
import getBabelCommonConfig from './common/config/getBabelCommonConfig';
import Store, {context} from '@/store';
import {style as alias} from './common/config/getAlias';

function babelify(js) {
  const {projectConfig: {babelConfig, browsers}, option: {mode, env, lib}} = context;

  const config = babelConfig(getBabelCommonConfig({mode, browsers}), mode, env);
  return js.pipe(babel(config)).pipe(gulp.dest(path.resolve(lib)));
}

const delLib = (done) => { // 删除陈旧 lib
  const libDir = path.resolve(context.option.lib);
  rimraf.sync(libDir); //同步形式删除
  done()
}

function compileStyles() {
  const {option: {src, lib}} = context;
  return gulp.src([
    path.resolve(`${src}/**/*.@(css|scss|less)`),
  ])
    .pipe(aliases(alias))
    .pipe(gulp.dest(path.resolve(lib)));
}

function compileAssets() {
  const {option: {src, lib}} = context;
  return gulp.src([
    path.resolve(`${src}/**/*.@(jpg|jpeg|png|ico|gif|svg|html|json|ttf|woff|eot|md|txt)`),
  ]).pipe(gulp.dest(path.resolve(lib)));
}


function compileJS_TS() {
  const source = [
    path.resolve(`${context.option.src}/**/*.js?(x)`),
    path.resolve(`${context.option.src}/**/*.ts?(x)`),
  ];
  return babelify(gulp.src(source));
}

export default function compile(program) {
  // 初始化全局参数context
  const store = new Store(program, 'compile', false)
  store.initContext()
  gulp.series(delLib, gulp.parallel(compileAssets, compileJS_TS, compileStyles))()
}
