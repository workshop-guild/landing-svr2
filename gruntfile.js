module.exports = function(grunt){
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    apidoc: {
      server: {
        src: 'api/',
        dest: 'apidoc/'
      }
    },
    watch: {
      apidoc: {
        files: ['api/**/*.js'],
        tasks: ['apidoc'],
        options: {
          livereload: 1337
        }
      }
    }
  });
  grunt.registerTask('default', []);
}