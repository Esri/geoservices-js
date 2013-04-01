module.exports = function (grunt) {
  grunt.initConfig({
    pkg:   grunt.file.readJSON('package.json'),

    jshint: {
      files: [ 'gruntfile.js', 'src/**/*.js', 'test/**/*.js' ],
      options: {
        globals: {
          node: true
        }
      }
    },

    copy: {
      main: {
        files: [
          {
            cwd: 'src/',
            src: [ '*.js' ],
            dest: 'lib/',
            filter: 'isFile',
            expand: true
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', [ 'jshint', 'copy' ]);

};