import fs from "fs";
import path from "path";
import mime from "mime";
import express from "express";
import compression from "compression";
import { h } from "preact";
import render from "preact-render-to-string";
import stats from "./src/js/components/stats.js";
import AllCountryList from "./src/js/components/AllCountryList.js";
import Country from "./src/js/components/Country.js";
import cheerio from "cheerio";

const app = new express();
const staticOptions = {
	etag: false,
	setHeaders: (res)=>{
		res.setHeader("Cache-Control", "public,max-age=31536000,stale-while-revalidate=86400");
		res.removeHeader("X-Powered-By");
		res.setHeader("Service-Worker-Allowed", "/");
	}
}
const envSettings = {
	port: process.env.PORT || 8080,
	inProd: process.env.PROD || false
};
const pageMarkup = {
	index: fs.readFileSync(path.join(__dirname, "index.html")).toString()
};

app.use("/css", express.static(path.join(__dirname, "css"), staticOptions));
app.use("/js", express.static(path.join(__dirname, "js"), staticOptions));

app.use(compression());

app.get("/", (req, res)=>{
	let $ = cheerio.load(pageMarkup.index),
		componentHtml = render(<AllCountryList stats={stats}/>);

	$("#full-country-list").html(componentHtml);

	res.setHeader("Cache-Control", "private,no-cache,no-store,max-age=0");
	res.send($.html());
});

app.listen(envSettings.port);
