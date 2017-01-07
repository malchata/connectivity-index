import { h, render, Component } from "preact";

export default class AllCountryList extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let rows = [],
			numberOfCountries = this.props.stats.countries.length;

		for(let i = 0; i < numberOfCountries; i++){
			rows.push(<li><a title={this.props.stats.countries[i].c} href={"/country/" + this.props.stats.countries[i].cc}>{this.props.stats.countries[i].c}</a></li>);
		}

		return (
			<ul className="all-country-list">
				{rows}
			</ul>
		);
	}
}