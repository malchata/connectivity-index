import fs from "fs";
import path from "path";
import crypto from "crypto";
import mime from "mime";
import express from "express";
import compression from "compression";
import { h } from "preact";
import render from "preact-render-to-string";
import stats from "./htdocs/static/js/components/stats";
import AllCountryList from "./htdocs/static/js/components/AllCountryList";
import Country from "./htdocs/static/js/components/Country";
import cheerio from "cheerio";

const staticDir = path.join(__dirname, "htdocs", "static");
const app = new express();
const envSettings = {
	port: process.env.PORT || 8080,
	inProd: process.env.PROD || false
};
const pageMarkup = {
	index: fs.readFileSync(path.join(__dirname, "htdocs", "index.html")).toString(),
	singleCountry: fs.readFileSync(path.join(__dirname, "htdocs", "single-country.html")).toString()
};
const contentHashes = {
	styles: crypto.createHmac("md5", fs.readFileSync(path.join(__dirname, "htdocs", "static", "css", "styles.css").toString())).digest("hex").substr(0, 8),
	scripts: crypto.createHmac("md5", fs.readFileSync(path.join(__dirname, "htdocs", "static", "js", "scripts.min.js").toString())).digest("hex").substr(0, 8)
};
const countryCodeRegEx = /[a-z]{2}/i;

app.use(compression());
app.use(express.static(staticDir, {
	setHeaders: (res, path, stat)=>{
		switch(mime.lookup(path)){
			case "text/css":
			case "text/javascript":
			case "application/javascript":
				res.removeHeader('X-Powered-By');
				res.setHeader("Service-Worker-Allowed", "/");

				if(path.indexOf("js/sw.js") !== -1){
					res.setHeader("Cache-Control", "private,no-cache,no-store,max-age=0");
				}
				else{
					res.setHeader("Cache-Control", "public,max-age=2592000");
				}
			break;

			case "image/jpeg":
			case "image/jpg":
			case "image/png":
			case "image/gif":
			case "image/webp":
			case "image/svg+xml":
			case "image/x-icon":
			case "image/vnd.microsoft.icon":
				res.setHeader("Service-Worker-Allowed", "/");
				res.setHeader("Cache-Control", "public,max-age=31536000");
			break;
		}
	}
}));

app.get("/", (req, res)=>{
	let $ = cheerio.load(pageMarkup.index),
		componentHtml = render(<AllCountryList stats={stats}/>);

	$("#full-country-list").html(componentHtml);

	if(envSettings.inProd === false){
		$("[data-analytics], [data-service-worker-script]").remove();
	}

	$("[data-styles]").attr("href", $("[data-styles]").attr("href") + "?v=" + contentHashes.styles);
	$("[data-scripts]").attr("src", $("[data-scripts]").attr("src") + "?v=" + contentHashes.scripts);

	res.setHeader("Cache-Control", "private,no-cache,no-store,max-age=0");
	res.setHeader("Service-Worker-Allowed", "/");
	res.setHeader("Link", "</css/styles.css?v=" + contentHashes.styles + ">;rel=preload;as=style,</js/scripts.min.js?v=" + contentHashes.scripts + ">;rel=preload;as=script,<https://www.google-analytics.com>;rel=preconnect");
	res.send($.html());
});

app.get("/index.html", (req, res)=>{
	res.redirect("/");
});

app.get("/country/:countryCode", (req, res)=>{
	let clean = {};

	if(countryCodeRegEx.test(req.params.countryCode) === true){
		clean.countryCode = req.params.countryCode;

		var countryData = stats.countries.filter((value)=>{
			return value.cc === clean.countryCode;
		})[0];

		if(typeof(countryData) !== "undefined"){
			let $ = cheerio.load(pageMarkup.singleCountry),
				componentHtml = render(<ul className="country-list"><Country maxAvg={stats.m.a.k} /*maxPeak={stats.m.p.k}*/ countryData={countryData}/></ul>);

			$("title").text(countryData.c + " | Connectivity Index");
			$("#single-country-listing").html(componentHtml);

			if(envSettings.inProd === false){
				$("[data-analytics], [data-service-worker-script]").remove();
			}

			$("[data-styles]").attr("href", $("[data-styles]").attr("href") + "?v=" + contentHashes.styles);
			$("[data-scripts]").attr("src", $("[data-scripts]").attr("src") + "?v=" + contentHashes.scripts);

			res.setHeader("Cache-Control", "private,no-cache,no-store,max-age=0");
			res.setHeader("Service-Worker-Allowed", "/");
			res.setHeader("Link", "</css/styles.css?v=" + contentHashes.styles + ">;rel=preload;as=style,<https://www.google-analytics.com>;rel=preconnect");
			res.send($.html());
		}
		else{
			res.redirect("/");
		}
	}
	else{
		res.redirect("/");
	}
});

app.listen(envSettings.port);
