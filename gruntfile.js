module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    apidoc: {
      server: {
        src: 'api/',
        dest: 'apidoc/'
      }
    }
  });
  grunt.registerTask('default', []);
}