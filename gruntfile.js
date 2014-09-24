module.exports = function(grunt) {

	grunt.initConfig({
	  	connect: {
		    server: {
		    	options: {
		    		keepalive: true,
			        port: 8000,
			        base: ''
			    }
		    }
	  	}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['connect:server']);

};