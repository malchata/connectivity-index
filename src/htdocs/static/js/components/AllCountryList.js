import { h, render, Component } from "preact";
import { toTitleCase } from "./Utilities";

export default class AllCountryList extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let rows = [],
			numberOfCountries = this.props.stats.countries.length;

		for(let i = 0; i < numberOfCountries; i++){
			let countryName = toTitleCase(this.props.stats.countries[i].c),
				countryCode = this.props.stats.countries[i].cc.toLowerCase();

			rows.push(<li><a title={countryName} href={"/country/" + countryCode}>{countryName}</a></li>);
		}

		return (
			<ul className="all-country-list">
				{rows}
			</ul>
		);
	}
}