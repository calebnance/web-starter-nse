// gulp all the things
const autoprefixer = require('gulp-autoprefixer');
const babel = require('babelify');
const browserify = require('browserify');
const buffer = require('gulp-buffer');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const clear = require('clear');
const concat = require('gulp-concat');
const data = require('gulp-data');
const fs = require('fs');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const htmlreplace = require('gulp-html-replace');
const notifier = require('node-notifier');
const nunjucksRender = require('gulp-nunjucks-render');
const path = require('path');
const purgecss = require('gulp-purgecss');
const rename = require('gulp-rename');
const replace = require('gulp-replace-task');
const requirejsOptimize = require('gulp-requirejs-optimize');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const stripDebug = require('gulp-strip-debug');
const tap = require('gulp-tap');
const uglify = require('gulp-uglify');

// grab the configuration file
const config = require('./gulp-config.json');

/******************************************************************************\
 * VARIABLES
\******************************************************************************/

// are we running in production?
const prod = process.env.NODE_ENV === 'production';

// dist directory
const distDir = !prod ? 'dist' : 'dist_prod';

// base file names
let cssOutputName = !prod ? `${config.outputFileName}.v${config.cssVersion}` : `${config.outputFileName}.v${config.cssVersion}.min`;
let jsOutputName = `${config.outputFileName}.v${config.jsVersion}`;

// production end points
var cdn = config.cdnBase;
var cssCDNPath = `${cdn}css/`;
var fontCDNPath = `${cdn}fonts/`;
var imgCDNPath = `${cdn}images/`;
var jsCDNPath = `${cdn}js/`;
var videoCDNPath = `${cdn}videos/`;

// dev file paths
var devPaths = {
  html: './src/**/*.+(nunjucks|json)',
  scss_watchAll: './src/scss/**/*.scss',
  scss_main: './src/scss/main.scss',
  js_all: './src/js/**/*.js',
  js_ES6: './src/js/jsES6/main.js',
  js_Require: './src/js/requireJS/main.js',
};

/******************************************************************************\
 * LOCAL SERVER TASK
\******************************************************************************/

gulp.task('server', shell.task([
  `nodemon server.js`
]));

/******************************************************************************\
 * DIST TASK
\******************************************************************************/

// tasks to always run, no matter the build type
const commonTasks = [
  'fonts',
  'images',
  'videos',
  'sass',
  'js',
  'html',
  'purgecss'
];

// tasks to run for local dev builds only
const devTasks = [
  'clearConsole',
  'watch'
];

// tasks to run for production only
const prodTasks = [
  // null
];

gulp.task('dist', (!prod ? commonTasks.concat(devTasks) : commonTasks.concat(prodTasks)));

/******************************************************************************\
 * WATCH TASKS
\******************************************************************************/

/* WATCH :: ALL */
gulp.task('watch', [
  'js:watch',
  'sass:watch',
  'html:watch'
]);

/* WATCH :: JS */
gulp.task('js:watch', () => {
  gulp.watch(devPaths.js_all, ['js', 'purgecss']);
});

/* WATCH :: SASS */
gulp.task('sass:watch', () => {
  gulp.watch(devPaths.scss_watchAll, ['sass', 'purgecss']);
});

/* WATCH :: HTML */
gulp.task('html:watch', () => {
  gulp.watch(devPaths.html, ['html', 'purgecss']);
});

/******************************************************************************\
 * CLEAN TASK
\******************************************************************************/

gulp.task('clean', () => {
  // remove both dist and dist_prod directories
  gulp.src('dist', { read: false }).pipe(clean());
  gulp.src('dist_prod', { read: false }).pipe(clean());
});

/******************************************************************************\
 * CLEAR CONSOLE TASK
\******************************************************************************/

gulp.task('clearConsole', () => {
  clear();
});

/******************************************************************************\
 * SASS TASK
\******************************************************************************/

gulp.task('sass', () => {
  var sourceFile = gulp.src([
    devPaths.scss_main,
  ])
  .pipe(
    sass().on('error', pingError)
  )
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  .pipe(rename({
    basename: cssOutputName
  }));

  // use production paths?
  if (prod) {
    // minify css
    sourceFile = sourceFile.pipe(cleanCSS());

    // replace assets to reflect cdn (or production path)
    sourceFile = sourceFile.pipe(replace({
      patterns: [
        {
          match: /..\/images\//g,
          replacement: imgCDNPath
        },
        {
          match: /..\/fonts\//g,
          replacement: fontCDNPath
        }
      ]
    }));
  }

  sourceFile.pipe(gulp.dest('./' + distDir + '/css'));
});

/******************************************************************************\
 * PURGE THE CSS
\******************************************************************************/

// (dependency: html, sass, & js need to finish first)
gulp.task('purgecss', ['html', 'sass', 'js'], () => {
  return gulp
    .src(`${distDir}/**/*.css`)
    .pipe(
      purgecss({
        content: [
          `${distDir}/**/*.html`,
          `${distDir}/**/*.js`,
        ],
        fontFace: true,
        keyframes: true
      })
    )
    .pipe(rename({
      basename: `purged_${cssOutputName}`
    }))
    .pipe(gulp.dest('./' + distDir));
});

/******************************************************************************\
 * JS
\******************************************************************************/

gulp.task('js', () => {
  // which js modules format?
  if (config.js.jsES6.active) {
    // use ES6 Modules
    gulp.start('jsES6');
  } else if (config.js.requireJs.active) {
    // use RequreJS
    gulp.start('jsRequire');
  }
});

gulp.task('jsRequire', () => {
  var stream = gulp.src(devPaths.js_Require);

  if(!prod) {
    stream = stream
      .pipe(sourcemaps.init())
      .pipe(requirejsOptimize({
        optimize: 'none'
      }))
      .pipe(sourcemaps.write())
      .pipe(rename({
        basename: jsOutputName
      }))
  } else {
    // minify and strip debug:
    // consoles and alerts never make it to production
    stream = stream
      .pipe(requirejsOptimize({
        optimize: 'uglify'
      }))
      .pipe(stripDebug())
      .pipe(rename({
        basename: jsOutputName + '.min'
      }))
  }

  stream = stream.pipe(gulp.dest('./' + distDir + '/js'));
});

gulp.task('jsES6', () => {
  var stream = gulp.src(devPaths.js_ES6, { read: false })
    .pipe(tap((file) => {
      file.contents = browserify(file.path, {
        debug: true
      }).transform(babel, {
        presets: ['es2015']
      }).bundle();
    }))
    .pipe(buffer());

  if(!prod) {
    stream = stream
      .pipe(rename({
        basename: jsOutputName
      }));
  } else {
    stream = stream
      .pipe(uglify())
      .pipe(rename({
        basename: jsOutputName + '.min'
      }));
  }

  stream = stream.pipe(gulp.dest('./' + distDir + '/js'));
});

/******************************************************************************\
 * HTML TASK
\******************************************************************************/

/* HTML (dependency: compileHTML) */
gulp.task('html', ['compileHTML'], () => {
  var sourceFile = null;
  var cssPath = !prod ? `css/${cssOutputName}.css` : `${cssCDNPath}${cssOutputName}.css`;
  var jsPath = !prod ? `js/${jsOutputName}.js` : `${jsCDNPath}${jsOutputName}.js`;
  var jsFullPath = `<script src="${jsPath}"></script>`;
  var htmlreplaceData = {};

  // use requireJs format instead?
  if (config.js.requireJs.active) {
    // use RequreJS
    jsFullPath = `<script data-main="${jsPath}" src="${config.js.requireJs.path}"></script>`;
  }

  // set build paths
  htmlreplaceData = {
    css: `<link type="text/css" rel="stylesheet" href="${cssPath}">`,
    js: jsFullPath,
  };

  // set source file(s)
  sourceFile = gulp.src([
    `${distDir}/**/*.html`,
  ]);

  // replace html
  sourceFile = sourceFile.pipe(htmlreplace(htmlreplaceData, {
    keepUnassigned: true
  }));

  // if production build
  if (prod) {
    // replace assets to reflect cdn (or production path)
    sourceFile = sourceFile.pipe(replace({
      patterns: [
        {
          match: /="images\//g,
          replacement: "=\"" + imgCDNPath
        },
        {
          match: /="videos\//g,
          replacement: "=\"" + videoCDNPath
        },
        {
          match: /="js\//g,
          replacement: "=\"" + jsCDNPath
        }
      ]
    }));

    // minify html
    // options: https://github.com/kangax/html-minifier#options-quick-reference
    sourceFile = sourceFile.pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }));
  }

  return sourceFile.pipe(gulp.dest('./' + distDir));
});

/* HTML :: COMPILE */
gulp.task('compileHTML', () => {

  return gulp.src('./src/html/pages/*.nunjucks')
    .pipe(
      data(function(file) {
        // set path to json file, specific to the HTML page we are compiling!
        var pathToFile = './src/html/data/' + path.basename(file.path, '.nunjucks') + '.json';

        // delete cache, we always want the latest json data..
        delete require.cache[require.resolve(pathToFile)];

        // log that we are grabbing data
        console.log('grabbing data from: ' + pathToFile);

        return require(pathToFile);
      }).on('error', pingError)
    )
    .pipe(
      nunjucksRender({
        path: './src/html/templates'
      }).on('error', pingError)
    )
    .pipe(gulp.dest('./' + distDir));
});

/******************************************************************************\
 * Fonts
\******************************************************************************/

gulp.task('fonts', () => {

  return gulp.src('./src/assets/fonts/**/*')
    .pipe(gulp.dest('./' + distDir + '/fonts'));
});

/******************************************************************************\
 * Images
\******************************************************************************/

gulp.task('images', () => {

  return gulp.src('./src/assets/images/**/*')
    .pipe(gulp.dest('./' + distDir + '/images'));
});

/******************************************************************************\
 * Videos
\******************************************************************************/

gulp.task('videos', () => {

  return gulp.src('./src/assets/videos/**/*')
    .pipe(gulp.dest('./' + distDir + '/videos'));
});

/******************************************************************************\
 * PING ERROR TO DEV
\******************************************************************************/

function pingError(error) {
  // if you want details of the error in the console
  console.log('=============================');
  console.log('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=');
  console.log(error.toString());
  console.log('=+=+=+=+=+=+=+=+=+=+=+=+=+=+=');
  console.log('=============================');

  // display a message to the dev!
  notifier.notify({
    // 'contentImage': '',
    'icon': false,
    'message': 'The file you just edited has an error..',
    'sound': 'Basso',
    'timeout': 10,
    'title': 'Web Starter NSE',
    'wait': true
  });

  this.emit('end');
}
