import { h, render, Component } from "preact";
import stats from "../data/stats";

export default class CountryList extends Component{
	render(){
		return (
			<section id="country-index">
				<section id="filters">
					<h2>All countries</h2>
				</section>
				<ul className="country-list">
					{stats.countries.map(country => {
						return <li className="country">
							<h4>{country.country}</h4>
							<div className="stat">
								<p className="metric">Avg:</p>
								<span className="speed-value">{country.avg / 1000}</span>
							</div>
							<div className="stat">
								<p className="metric">Peak:</p>
								<span className="speed-value">{country.peak / 1000}</span>
							</div>
						</li>;
					})}
				</ul>
			</section>
		);
	}
}