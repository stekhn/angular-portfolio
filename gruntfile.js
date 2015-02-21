module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["dist", ".tmp"],

        copy: {
            dist: {
                files: [
                    { expand: true, src: ['src/index.html'], dest: 'dist/', filter: 'isFile', flatten: true },
                    { expand: true, src: ['src/sitemap.xml'], dest: 'dist/', filter: 'isFile', flatten: true },
                    { expand: true, src: ['src/favicon*'], dest: 'dist/', filter: 'isFile', flatten: true },
                    { expand: true, src: ['src/preview.jpg'], dest: 'dist/', filter: 'isFile', flatten: true },
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
            html: ['dist/index.html']
        },

        compass: {
            dist: {
                options: {
                    sassDir: 'src/style',
                    cssDir: 'src/style'
                }
            }
        },

        cssmin: {
            combine: {
                files: {
                    'dist/css/style.min.css': ['src/style/main.css']
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true,
            },
            dist: {
                files: {
                    '.tmp/ngAnnotate/app.js': ['src/script/app.js'],
                },
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
                src: [  'vendor/angular/angular.min.js',
                        'vendor/angular/angular-route.min.js',
                        'vendor/underscore/underscore.min.js',
                        '.tmp/uglify/app.min.js'
                    ],
                dest: 'dist/src/main.min.js',
            },
        },
         imagemin: {
            jpg: {
                options: {
                    progressive: true
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/project/',
                    src: ['*.jpg'],
                    dest: 'dist/img/project/',
                    ext: '.jpg'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    grunt.registerTask('default', [
        'clean', 'copy', 'compass', 'useminPrepare', 'cssmin', 'ngAnnotate', 'uglify', 'concat', 'usemin', 'imagemin'
    ]);
};