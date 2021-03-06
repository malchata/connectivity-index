// gulp modules
const gulp = require("gulp");
const util = require("gulp-util");
const changed = require("gulp-changed");
const plumber = require("gulp-plumber");
const livereload = require("gulp-livereload");
const streamify = require("gulp-streamify");
const htmlmin = require("gulp-htmlmin");
const sass = require("gulp-sass");
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
const flow = require("gulp-flowtype");
const imagemin = require("gulp-imagemin");
const jpegRecompress = require("imagemin-jpeg-recompress");
const del = require("del");

/*** Module Options ***/
const moduleOpts = {
	htmlmin: {
		collapseWhitespace: true,
		removeComments: true
	},
	autoprefixer: {
		browsers: ["last 2 versions", "> 5%", "ie >= 10", "iOS >= 8"]
	},
	babel: {
		presets: ["es2015"],
		plugins: [["transform-react-jsx", {"pragma": "h"}], ["transform-strict-mode", {"strict": false}]]
	},
	jpegRecompress: {
		min: 30,
		max: 70,
		method: "smallfry",
		accurate: true,
		strip: true
	}
}

/*** HTML Minification Task ***/
const minifyHTML = ()=>{
	let src = "src/htdocs/**/*.html",
		dest = "dist/htdocs";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(htmlmin(moduleOpts.htmlmin))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

exports.minifyHTML = minifyHTML;

// Compile CSS
const buildCSS = ()=>{
	let src = "src/htdocs/static/scss/styles.scss",
		dest = "dist/htdocs/static/css";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([autoprefixer(moduleOpts.autoprefixer), autorem(), cssnano()]))
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
			plugins: [["transform-react-jsx", {"pragma": "h"}], ["transform-strict-mode", {"strict": false}]]
		}).bundle()
		.pipe(source("scripts.min.js"))
		.pipe(plumber())
		.pipe(streamify(uglify()))
		.pipe(streamify(optimizeJS()))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

const buildServiceWorker = ()=>{
	let src = "src/htdocs/static/js/sw.js",
		dest = "dist/htdocs/static/js";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(babel({
			presets: ["es2015"],
			plugins: [["transform-react-jsx", {"pragma": "h"}], ["transform-strict-mode", {"strict": false}]]
		}))
		.pipe(uglify())
		.pipe(optimizeJS())
		.pipe(gulp.dest(dest))
		.pipe(livereload());
}

const buildServerComponents = ()=>{
	let src = ["src/htdocs/static/js/components/stats.js", "src/htdocs/static/js/components/Utilities.js", "src/htdocs/static/js/components/AllCountryList.js", "src/htdocs/static/js/components/Country.js", "src/htdocs/static/js/components/CountryStat.js"],
		dest = "dist/htdocs/static/js/components";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(babel({
			presets: ["es2015"],
			plugins: [["transform-react-jsx", {"pragma": "h"}], ["transform-strict-mode", {"strict": false}]]
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
			plugins: [["transform-react-jsx", {"pragma": "h"}], ["transform-strict-mode", {"strict": false}]]
		}))
		.pipe(uglify())
		.pipe(optimizeJS())
		.pipe(gulp.dest(dest));
};

const typeCheck = ()=>{
	let src = "src/**/*.js";

	return gulp.src(src)
		.pipe(flow())
}

// Export tasks
exports.buildJS = buildJS;
exports.buildServiceWorker = buildServiceWorker;
exports.buildServerComponents = buildServerComponents;
exports.buildServer = buildServer;
exports.typeCheck = typeCheck;

/*** Image Optimization Task ***/
const optimizeImages = ()=>{
	let src = "src/htdocs/static/img/**/*.{jpg,gif,png,svg}",
		dest = "dist/htdocs/static/img";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(changed(dest))
		.pipe(imagemin([jpegRecompress(moduleOpts.jpegRecompress)]))
		.pipe(gulp.dest(dest))
		.pipe(livereload());
};

const optimizeFavicons = ()=>{
	let src = "src/htdocs/static/favicons/*.{png,ico}",
		dest = "dist/htdocs/static";

	return gulp.src(src)
		.pipe(plumber())
		.pipe(changed(dest))
		.pipe(imagemin())
		.pipe(gulp.dest(dest))
		.pipe(livereload());
}

exports.optimizeImages = optimizeImages;
exports.optimizeFavicons = optimizeFavicons;

/*** Copy Manifest Task ***/
const copyFiles = ()=>{
	let src = "src/htdocs/static/manifest.webmanifest",
		dest = "dist/htdocs/static";

	return gulp.src(src)
		.pipe(gulp.dest(dest));
}

exports.copyFiles = copyFiles;

/*** Clean Task ***/
const clean = ()=>{
	return del("dist");
};

exports.clean = clean;

/*** Build Task ***/
exports.build = gulp.series(clean, gulp.parallel(minifyHTML, buildCSS, buildJS, buildServiceWorker, buildServerComponents, buildServer, optimizeImages, optimizeFavicons, copyFiles));

/*** Watch Task (Default) ***/
const watch = ()=>{
	livereload.listen();
	gulp.watch("src/htdocs/**/*.html", minifyHTML);
	gulp.watch("src/htdocs/static/scss/**/*.scss", buildCSS);
	gulp.watch(["src/htdocs/static/js/**/*.js", "!src/htdocs/static/js/sw.js"], buildJS, buildServerComponents);
	gulp.watch("src/htdocs/static/js/sw.js", buildServiceWorker);
	gulp.watch("src/server.js", buildServer);
	gulp.watch("src/htdocs/static/img/**/*.{jpg,gif,png,svg}", optimizeImages);
	gulp.watch("src/htdocs/static/manifest.webmanifest", copyFiles);
};

exports.default = watch;
