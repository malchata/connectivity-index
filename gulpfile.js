// gulp modules
const gulp = require("gulp");
const util = require("gulp-util");
const changed = require("gulp-changed");
const plumber = require("gulp-plumber");
const livereload = require("gulp-livereload");
const streamify = require("gulp-streamify");
const htmlmin = require("gulp-htmlmin");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const autorem = require("autorem");
const cssnano = require("cssnano");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
const optimizeJS = require("gulp-optimize-js");
const imagemin = require("gulp-imagemin");
const pngQuant = require("imagemin-pngquant");
const jpegRecompress = require("imagemin-jpeg-recompress");
const del = require("del");

/*** HTML Minification Task ***/
const minifyHTML = ()=>{
	let src = "src/**/*.{html,ejs}",
		dest = "dist";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

exports.minifyHTML = minifyHTML;

// Compile CSS
const buildCSS = ()=>{
	let src = "src/less/styles.less",
		dest = "dist/css";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(less().on("error", function(err){
			util.log(err);
			this.emit("end");
		}))
		.pipe(postcss([
			autoprefixer({
				browsers: ["last 2 versions"]
			}), autorem(), cssnano()
		]))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

exports.buildCSS = buildCSS;

/*** Build JS Task ***/
const buildJS = ()=>{
	let src = "src/js/main.js",
		dest = "dist/js";

	return browserify({
			entries: src,
			debug: true
		})
		.transform(babelify, {
			presets: ["es2015"],
			plugins: [["transform-react-jsx", {"pragma": "h"}]]
		})
		.bundle()
		.pipe(source("scripts.min.js"))
		.pipe(plumber())
		.pipe(streamify(uglify()))
		.pipe(streamify(optimizeJS()))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

exports.buildJS = buildJS;

/*** Image Optimization Task ***/
const optimizeImages = ()=>{
	let src = "src/img/**/*.{jpg,gif,png,svg}",
		dest = "dist/img";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(changed(dest))
		.pipe(imagemin([
			jpegRecompress({
				max: 90
			}),
			pngQuant({
				quality: "45-90"
			})
		]))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

exports.optimizeImages = optimizeImages;

/*** Clean Task ***/
const clean = ()=>{
	return del("dist");
};

exports.clean = clean;

/*** Build Task ***/
exports.build = gulp.series(clean, gulp.parallel(minifyHTML, buildCSS, buildJS, optimizeImages));

/*** Watch Task (Default) ***/
const watch = ()=>{
	livereload.listen();
	gulp.watch("src/**/*.{html,ejs}", minifyHTML);
	gulp.watch("src/less/**/*.less", buildCSS);
	gulp.watch("src/js/**/*.js", buildJS);
	gulp.watch("src/img/**/*.{jpg,gif,png,svg}", optimizeImages);
};

exports.default = watch;