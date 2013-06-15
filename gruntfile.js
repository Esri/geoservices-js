module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js', 'lib/**/*.js', 'test/**/*.js' ],
      options: {
        globals: {
          node: true
        }
      }
    },

    concat: {
      node: {
        files: {
          'lib/authentication.js': [ 'src/authentication.js', 'src/partials/node/authentication-tail.js' ],
          'lib/featureservice.js': [ 'src/partials/node/querystring.js', 'src/partials/node/request-head.js', 'src/request.js', 'src/featureservice.js', 'src/partials/node/featureservice-tail.js' ],
          'lib/geocode.js': [ 'src/partials/node/querystring.js', 'src/geocode.js', 'src/partials/node/geocode-tail.js' ],
          'lib/request.js': [ 'src/partials/node/querystring.js', 'src/partials/node/request-head.js', 'src/request.js', 'src/partials/node/request-tail.js' ]
        }
      },
      browser: {
        files: {
          'browser/arcgis.js': [
            'src/partials/browser/head.js',
            'src/partials/browser/querystring.js',
            'src/authentication.js',
            'src/featureservice.js',
            'src/geocode.js',
            'src/request.js',
            'src/partials/browser/tail.js'
          ]
        }
      }
    },

    complexity: {
      generic: {
        src: [ 'lib/authentication.js', 'lib/featureservice.js', 'lib/geocode.js', 'lib/request.js' ],
        options: {
          jsLintXML: 'report.xml', // create XML JSLint-like report
          errorsOnly: false, // show only maintainability errors
          cyclomatic: 5,
          halstead: 15,
          maintainability: 65
        }
      }
    },

    vows: {
      all: {
        options: {
          reporter: "spec",
          verbose: false,
          colors: true
        },
        src: [ "test/*.js" ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-vows');
  grunt.loadNpmTasks('grunt-complexity');

  grunt.registerTask('default', [ 'concat', 'jshint', 'vows', 'complexity' ]);

};
