module.exports = function(grunt) {
  grunt.initConfig({

  pkg: grunt.file.readJSON('package.json'),
  jasmine: {
    pivotal: {
      src : ['public/javascripts/*.js', 'public/js/*.js'],
      options: {
        specs : 'spec/javascripts/*Spec.js',
        vendor: [
          "lib/js/vendor/*.js"
        ]
      }
    }
  }
});

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Test task
  grunt.registerTask('test', ["jasmine"]);
};
