module.exports = function (grunt) {

  var mozjpeg = require('imagemin-mozjpeg');
  var sass = require('node-sass');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['dist', '.tmp'],

    copy: {
      dist: {
        files: [
          { expand: true, src: ['src/index.html'], dest: 'dist/', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/sitemap.xml'], dest: 'dist/', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/favicon.ico'], dest: 'dist/', filter: 'isFile', flatten: true },
          { expand: true, src: ['src/font/*'], dest: 'dist/font/', flatten: true },
          { expand: true, src: ['src/data/*'], dest: 'dist/data/', flatten: true },
          { expand: true, src: ['src/template/*'], dest: 'dist/template/', flatten: true },
          { expand: true, src: ['src/img/*'], dest: 'dist/img/', flatten: true }
        ]
      }
    },

    useminPrepare: {
      html: ['src/index.html']
    },

    usemin: {
      options: {
        blockReplacements: {
          js: function (block) {

            return '<script async src="' + block.dest + '"><\/script>';
          }
        }
      },
      html: ['dist/index.html']
    },

    sass: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      build: {
        files: {
          'src/style/main.css': 'src/style/main.scss'
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require('autoprefixer')({
            browsers: ['> 5%', 'last 2 versions', 'IE 8', 'IE 9']
          }),
          require('cssnano')()
        ],
        map: true
      },

      build: {
        files: {
          'dist/css/style.min.css': 'src/style/main.css'
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          '.tmp/ngAnnotate/app.js': [
            'src/script/app.js',
            'src/script/routes.js',
            'src/script/services/jsonLoader.js',
            'src/script/services/metaTags.js',
            'src/script/controllers/navCtrl.js',
            'src/script/controllers/metaCtrl.js',
            'src/script/controllers/projectCtrl.js',
            'src/script/controllers/projectMetaCtrl.js',
            'src/script/components/dashcaseFilter.js',
            'src/script/components/feedReader.js'
          ]
        }
      }
    },

    uglify: {
      dist: {
        files: {
          '.tmp/uglify/app.min.js': ['.tmp/ngAnnotate/app.js']
        }
      }
    },

    concat: {
      options: {
        separator: ';',
        sourceMap: true
      },
      dist: {
        src: [
          '../node_modules/angular/angular.min.js',
          '../node_modules/angular-route/angular-route.min.js',
          '.tmp/uglify/app.min.js'
        ],
        dest: 'dist/src/main.min.js'
      }
    },

    'json-minify': {
      dist: {
        files: 'dist/data/*.json'
      }
    },

    imagemin: {
      jpg: {
        options: {
          progressive: true,
          use: [mozjpeg()]
        },
        files: [{
          expand: true,
          cwd: 'src/img/project/',
          src: ['*.jpg'],
          dest: 'dist/img/project/',
          ext: '.jpg'
        }]
      }
    },

    watch: {

      css: {

        files: 'src/style/**/*.scss',
        tasks: ['sass', 'postcss']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-json-minify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('dist', [
    'clean', 'copy', 'useminPrepare', 'sass', 'postcss', 'ngAnnotate', 'uglify', 'concat', 'usemin', 'json-minify', 'imagemin'
  ]);
};
