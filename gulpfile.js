var gulp = require("gulp");
var umd = require("gulp-umd");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");

gulp.task("umd", function() {
	return gulp.src("src/js/*")
		.pipe(umd({
			dependencies: function(file) {
				return [
					{
						name: "Knockout",
						amd: "knockout",
						cjs: "knockout",
						global: "ko",
						param: "ko"
					},
					{
						name: "Knockout Mapping",
						amd: "knockout-mapping",
						cjs: "knockout-mapping",
						global: "ko",
						param: "mapping"
					},
					{
						name: "jQuery",
						amd: "jquery",
						cjs: "jquery",
						global: "$",
						param: "jQuery"
					},
					{
						name: "Underscore",
						amd: "underscore",
						cjs: "underscore",
						global: "_",
						param: "_"
					}
				];
			},
			exports: function(file) {
				return 'ko';
			},
			namespace: function(file) {
				return 'ko';
			}
		}))
		.pipe(gulp.dest("dist"));
});

gulp.task("production", ["umd"], function(){
	return gulp.src("dist/*.js")
		.pipe(rename({suffix: ".min"}))
		.pipe(uglify())
		.pipe(gulp.dest("dist"))
});

gulp.task("dev", function(){
	return gulp.watch("src/**/*.js", ["umd"]);
});