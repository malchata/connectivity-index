import fs from "fs";
import path from "path";
import express from "express";
import compression from "compression";
import { h } from "preact";
import render from "preact-render-to-string";
import stats from "./htdocs/static/js/components/stats";
import * as Utilities from "./htdocs/static/js/components/Utilities.js";
import AllCountryList from "./htdocs/static/js/components/AllCountryList";
import Country from "./htdocs/static/js/components/Country.js";
import cheerio from "cheerio";

const staticDir = path.join(__dirname, "htdocs", "static");
const app = new express();
const port = process.env.PORT || 8080;
const countryCodeRegEx = /[a-z]{2}/i;

// Static pieces
app.use(compression());
app.use(express.static(staticDir));

app.get("/", (req, res)=>{
	fs.readFile(path.join(__dirname, "htdocs", "index.html"), (err, data)=>{
		if(err){
			throw err;
		}

		let $ = cheerio.load(data),
			componentHtml = render(<AllCountryList stats={stats}/>);

		$("#full-country-list").html(componentHtml);
		res.send($.html());
	});
});

app.get("/index.html", (req, res)=>{
	res.redirect("/");
});

app.get("/country/:countryCode", (req, res)=>{
	let clean = {};

	if(countryCodeRegEx.test(req.params.countryCode) === true && req.params.countryCode.length === 2){
		clean.countryCode = req.params.countryCode;
	}
	else{
		res.redirect("/");
	}

	for(let i = 0; i < stats.countries.length; i++){
		if(stats.countries[i].cc.toLowerCase() === clean.countryCode){
			var countryData = stats.countries[i];
			break;
		}
	}

	if(typeof(countryData) === "object"){
		fs.readFile(path.join(__dirname, "htdocs", "single-country.html"), (err, data)=>{
			if(err){
				throw err;
			}

			let $ = cheerio.load(data),
				componentHtml = render(<ul className="country-list single-country"><Country maxAvg={stats.m.a.k} maxPeak={stats.m.p.k} countryData={countryData}/></ul>),
				title = Utilities.toTitleCase(countryData.c) + " | Connectivity Index";

			$("title").text(title);
			$("#main").html(componentHtml);
			res.send($.html());
		});
	}
	else{
		res.send("whoops");
	}
});

app.listen(port);