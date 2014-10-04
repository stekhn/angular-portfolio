module.exports = function (grunt) {

	var FINAL_JS = "src.min.js";

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		requirejs: {

			// Minify and concatenate require-javascript project
			build: {

				options: {

					almond: true,

					baseUrl: "dev/src/",
					// mainConfigFile: "optimizer.js",
					out: "dist/src/" + FINAL_JS,
					name: "boot",
					paths: {
						
						'video': 'vendor/video',
						'videoOverlay': 'vendor/video.overlay',
						'videoCuepoints': 'vendor/video.cuepoints',
						'timeline': 'vendor/timeline',
						'story' : 'vendor/storyjs-embed',
						'browser': 'vendor/platform',
						'jquery' : 'vendor/jquery.min'
					},
					shim: {

						'videoOverlay': {
							deps: ['video']
						},
						'videoCuepoints': {
							deps: ['video']
						},
						'timeline': {
							deps: ['story']
						}
					}
				}
			}
		},

		copy: {

			// Get required assets 

			build: {

				files: [
					{expand: true, flatten: true, src: ['dev/src/vendor/offline.min.js'], dest: 'dist/src/vendor', filter: 'isFile' },
					{expand: true, flatten: true, src: ['dev/styles/browser.css'], dest: 'dist/styles', filter: 'isFile' },					// fonts
					{expand: true, flatten: true, src: ['dev/src/vendor/locale/de.js'], dest: 'dist/src/vendor/locale', filter: 'isFile' },	
					{expand: true, flatten: true, src: ['dev/src/vendor/timeline.js'], dest: 'dist/src/vendor', filter: 'isFile' },	
					{expand: true, flatten: true, src: ['dev/src/vendor/jquery.min.js'], dest: 'dist/src/vendor', filter: 'isFile' },	
					{expand: true, flatten: true, src: ['dev/data/timeline.json'], dest: 'dist/data', filter: 'isFile' },	
					{expand: true, flatten: true, src: ['dev/styles/timeline.css'], dest: 'dist/styles', filter: 'isFile' },
					{expand: true, flatten: true, src: ['dev/font/*'], dest: 'dist/font', filter: 'isFile' },					// fonts
					{expand: true, flatten: true, src: ['dev/media/*'], dest: 'dist/media/', filter: 'isFile' },				// media files
					{expand: true, flatten: true, src: ['dev/media/audio/*'], dest: 'dist/media/audio/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/icons/*'], dest: 'dist/media/icons/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/images/*'], dest: 'dist/media/images/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/fliptiles/*'], dest: 'dist/media/fliptiles/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/swiper/*'], dest: 'dist/media/swiper/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/timeline/*'], dest: 'dist/media/timeline/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/panorama/*'], dest: 'dist/media/panorama/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/panorama/panos/*'], dest: 'dist/media/panorama/panos', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/video/*'], dest: 'dist/media/video', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/header/*'], dest: 'dist/media/header', filter: 'isFile'},
					{expand: true, flatten: true, src: ['dev/media/szdigital/*'], dest: 'dist/media/szdigital', filter: 'isFile'},
					{
						cwd: 'dev/media/poi',  // set working folder / root to copy
						src: '**/*',		   // copy all files and subfolders
						dest: 'dist/media/poi',	// destination folder
						expand: true		   // required when using cwd
					}

				]
			}
		},

		replace: {

			// Create final index.html file
			build: {

				src: 'dev/index.html',
				dest: 'dist/',
				replacements: [
					{
						from: 'data-main="src/boot" src="src/vendor/require.js"',
						to: 'src="src/' + FINAL_JS + '"'
					}
					// regex replacement ('Fooo' to 'Mooo')
					//	from: /(f|F)(o{2,100})/g,
					//	to: 'M$2'
					//
					// callback replacement
					//	from: 'Foo', to: function (matchedWord) { ... return matchedWord + ' Bar'; }
				]
			}
		},

		compass: {

			// Create final css file
			build: {

				options: {

					sassDir: 'dev/styles',
					cssDir: 'dist/styles',
					environment: 'production'
				}
			},

			compile: {

				options: {

					sassDir: 'dev/styles',
					cssDir: 'dev/styles',
					environment: 'development'
				}
			}
		},

		shell: {

			options: {

				stdout: true
			},

			// start buster server and capture phantom js
			// process runs in background. Needs to be stopped manually.
			// optionally create shell script:
			// > buster server &
			// > phantomjs ~/.npm/buster/0.6.12/package/script/phantom.js &
			// => closes server with terminal
			buster: {

				command: "buster server & phantomjs ~/.npm/buster/0.6.12/package/script/phantom.js",

				options: {

					async: true
				}
			},

			// start tests as setup in test/buster.js
			test: {

				command: "clear & buster test"
			}
		},

		watch: {

			buster: {

				files: 'dev/js/*.js',
				tasks: ['shell:test'],
				options: {

					nospawn: true
					/* NOT
					verbose: false,
					log: false,
					quiet: true,
					stdout: false
					*/
				}
			},

			css: {

				files: 'dev/styles/partials/*',
				tasks: ['compass:compile'],
				options: {
					nospawn: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.loadNpmTasks('grunt-shell-spawn');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('build', ["requirejs:build", "copy:build", "replace:build", "compass:build"]);
	grunt.registerTask('buster', ['shell:buster', 'watch:buster']);
	grunt.registerTask('watch-css', ['watch:css']);
};
