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
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Test task
  grunt.registerTask('test', ["jasmine"]);
  // Default task
  grunt.registerTask('default', ["concat", "uglify"]);
};
