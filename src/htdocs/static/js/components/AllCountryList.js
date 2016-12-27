import { h, render, Component } from "preact";
import * as Utilities from "./Utilities";

export default class AllCountryList extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let rows = [],
			numberOfCountries = this.props.stats.countries.length;

		for(let i = 0; i < numberOfCountries; i++){
			rows.push(<li><a href={"/country/" + this.props.stats.countries[i].cc.toLowerCase()}>{Utilities.toTitleCase(this.props.stats.countries[i].c)}</a></li>);
		}

		return (
			<ul className="all-country-list">
				{rows}
			</ul>
		);
	}
}