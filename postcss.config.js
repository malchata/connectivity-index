module.exports = {
	plugins: [
		require("autoprefixer"),
		require("autorem")({
			browsers: ["last 2 versions", "> 5%", "ie >= 10", "iOS >= 8"]
		}),
		require("cssnano")
	]
};
