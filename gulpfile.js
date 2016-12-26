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
	let src = "src/htdocs/**/*.html",
		dest = "dist/htdocs";

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
	let src = "src/htdocs/static/less/styles.less",
		dest = "dist/htdocs/static/css";

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

/*** Build JS Tasks ***/
const buildJS = ()=>{
	let src = ["src/htdocs/static/js/main.js"],
		dest = "dist/htdocs/static/js";

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

const buildServerComponents = ()=>{
	let src = ["src/htdocs/static/js/components/stats.js", "src/htdocs/static/js/components/AllCountryList.js", "src/htdocs/static/js/components/Utilities.js"],
		dest = "dist/htdocs/static/js/components";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(babel({
			presets: ["es2015"],
			plugins: [["transform-react-jsx", {"pragma": "h"}]]
		}))
		.pipe(uglify())
		.pipe(optimizeJS())
		.pipe(gulp.dest(dest));
};

const buildServer = ()=>{
	let src = "src/server.js",
		dest = "dist";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(babel({
			presets: ["es2015"],
			plugins: [["transform-react-jsx", {"pragma": "h"}]]
		}))
		.pipe(uglify())
		.pipe(optimizeJS())
		.pipe(gulp.dest(dest));
};

// Export tasks
exports.buildJS = buildJS;
exports.buildServerComponents = buildServerComponents;
exports.buildServer = buildServer;

/*** Image Optimization Task ***/
const optimizeImages = ()=>{
	let src = "src/htdocs/static/img/**/*.{jpg,gif,png,svg}",
		dest = "dist/htdocs/static/img";

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
exports.build = gulp.series(clean, gulp.parallel(minifyHTML, buildCSS, buildJS, buildServerComponents, buildServer, optimizeImages));

/*** Watch Task (Default) ***/
const watch = ()=>{
	livereload.listen();
	gulp.watch("src/htdocs/**/*.html", minifyHTML);
	gulp.watch("src/htdocs/static/less/**/*.less", buildCSS);
	gulp.watch("src/htdocs/static/js/**/*.js", buildJS);
	gulp.watch("src/htdocs/static/img/**/*.{jpg,gif,png,svg}", optimizeImages);
};

exports.default = watch;