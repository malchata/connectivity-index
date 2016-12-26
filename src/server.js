import fs from "fs";
import path from "path";
import express from "express";
import compression from "compression";
import { h } from "preact";
import render from "preact-render-to-string";
import stats from "./htdocs/static/js/components/stats";
import AllCountryList from "./htdocs/static/js/components/AllCountryList";
import cheerio from "cheerio";

const staticDir = path.join(__dirname, "htdocs", "static");
const app = new express();
const port = process.env.PORT || 8080;

// Static pieces
app.use(compression());
app.use(express.static(staticDir));

app.get(["/", "index.html"], (req, res)=>{
	fs.readFile(path.join(__dirname, "htdocs", "index.html"), (err, data)=>{
		if(err){
			throw err;
		}

		let $ = cheerio.load(data),
			componentHtml = render(<AllCountryList stats={stats}/>);

		$("#full-country-list").html(componentHtml);
		res.send("<!doctype html><html class=\"no-js\" lang=\"en\">" + $("html").html() + "</html>");
	});
});

app.listen(port);