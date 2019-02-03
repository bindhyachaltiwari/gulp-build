// Import task modules and setting up variables.
var gulp = require('gulp'),
    hb = require('gulp-hb'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    bless = require('gulp-bless'),
    babel = require('gulp-babel'),
    map = require('map-stream'),
    handlebars = require('gulp-handlebars');
    wrap = require('gulp-wrap');
    declare = require('gulp-declare');
    access = require('gulp-accessibility'),//https://github.com/yargalot/gulp-accessibility
    // Set base directories
    bases = {
     src: 'src/',
     dist: 'dist/'
    },
    // Set paths
    paths = {
       libs: {
         js:[
           'src/assets/js/libs/jquery.min.js',
           'src/assets/js/libs/bootstrap.min.js',
           'src/assets/js/libs/handlebars-v4.0.5.js',
         ]
       },
       dist: {
          css: bases.dist+'assets/css',
          js: bases.dist+'assets/js',
          jslibs: bases.dist+'assets/js/libs',
          html: bases.dist+'/*.html',
          imgs:bases.dist+'assets/images',
          fonts: bases.dist+'assets/fonts',
          manifest:bases.dist+'assets/img'
       },
       src:{
          json: bases.src+'asstes/js/data/**/*.{js,json}',
          sass: bases.src+'assets/**/**/*.scss',
          js:bases.src+'assets/js/**/*.js',
          mainStyle : bases.src+'assets/sass/style.scss', 
          hbs: bases.src+'**/*.hbs',
          partialsHBS: bases.src+'templates/partials/**/*.hbs',
          pagesHBS: bases.src+'templates/pages/**/*.hbs',
          partialsHtml:bases.src+'ee/**/**.*'
       },
       modules:['src/assets/js/config.js',
                'src/assets/js/utils/*.js',     
                'src/assets/js/component/*.js'                          
              ],
       imgs: ['src/assets/images/**/**.*','src/assets/images/**.*'],
       manifest: ['src/assets/img/**/**.*','src/assets/img/**.*'],
       fonts: ['src/assets/fonts/**/**.*','src/assets/fonts/**.*'],
       accessibilityReports : 'reports/txt'
    };
  
  //***************** BUILD TASKS*********************
  gulp.task('templates', function(){
    gulp.src(paths.src.partialsHBS)
      .pipe(handlebars())
      .pipe(wrap('Handlebars.template(<%= contents %>)'))
      .pipe(declare({
        namespace: 'genric.templates',
        noRedeclare: true, // Avoid duplicate declarations 
      }))
      .pipe(concat('templates.js'))
      .pipe(gulp.dest('dist/assets/js/'));
  });

  // CSS tasks
  gulp.task('css', function () {
      return gulp.src(paths.src.mainStyle)
      .pipe(sass({errLogToConsole: true}))     
      /* Note:- If IE9 supported then use bless for the splitting of large CSS files */
        //.pipe(bless())
      .pipe(gulp.dest(paths.dist.css))
      .pipe(sass({outputStyle: 'compressed'}))
      .pipe(rename({suffix:'.min'}))
      .pipe(gulp.dest(paths.dist.css));
  });

  //JS Tasks
  gulp.task('js',function(){
      gulp.src(paths.libs.js)
      .pipe(concat('libs.js'))
      .pipe(gulp.dest(paths.dist.jslibs))

      gulp.src(paths.modules)
      .pipe(jshint('.jshintrc'))
      .pipe(jshint.reporter('default'))

      /* Use below command to fail the build if errors occur in js files. */
      //.pipe(jshint.reporter('fail'))  

      .pipe(concat('main.js'))
      .pipe(gulp.dest(paths.dist.js))
      
      /* if developer is writing code in ES6 then use babel. need and TESTTTTT*/
      //.pipe(babel())
      
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest(paths.dist.js));
  });


gulp.task('accessibility', function() {
  return gulp.src(paths.dist.html)
    .pipe(access({
      force: true,
      accessibilityLevel: 'WCAG2A',
      ignore: [
          'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
          'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
        ]
    }))
    .on('error', console.log)
    .pipe(access.report({
        reportType: 'txt'
    }))
    .pipe(rename({
      extname: '.txt'
    }))
    .pipe(gulp.dest(paths.accessibilityReports));
});

// Accessibility Tasks
gulp.task('markup', function(){
  return gulp.src([paths.src.pagesHBS], {
    })
    .pipe(hb({
      partials: paths.src.partialsHBS,
      data: paths.json
    }))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(bases.dist));
});

// clean up
gulp.task('clean', function () {
     gulp.src(bases.dist, {read: false})
      .pipe(clean({force: true}));
});

// Copy images
gulp.task('copy:imgs', function() {

  // images
   gulp.src(paths.imgs)
   .pipe(gulp.dest(paths.dist.imgs));

});
// Copy manifest
gulp.task('copy:manifest', function() {

  // images
   gulp.src(paths.manifest)
   .pipe(gulp.dest(paths.dist.manifest));

});

// Copy fonts
gulp.task('copy:fonts', function() {

  // fonts
   gulp.src(paths.fonts)
   .pipe(gulp.dest(paths.dist.fonts));

});
gulp.task('copy:html', function() {

  // html
   gulp.src(paths.src.partialsHtml)
   .pipe(gulp.dest(bases.dist));

});

// Copy all
gulp.task('copy:all', ['copy:imgs','copy:manifest', 'copy:fonts','copy:html']);

gulp.task('js-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('css-watch', ['css'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('json-watch', ['json'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('markup-watch', ['markup'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('default', [ 'copy:all','css', 'js', 'markup','accessibility'], function () {

    browserSync.init(null, {
        server: {
            baseDir: "dist"
        }
    });
    gulp.watch(paths.src.sass, ['css-watch']);
    gulp.watch(paths.src.js, ['js-watch']);
    gulp.watch(paths.src.json, ['json-watch']);
    gulp.watch(paths.src.hbs, ['markup-watch']);
});


gulp.task('build:prod', [ 'copy:all','css', 'js']);
gulp.task('build:dev', [ 'default']);