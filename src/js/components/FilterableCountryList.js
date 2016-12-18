import { h, render, Component } from "preact";
import Filters from "./Filters";
import Search from "./Search";
import Country from "./Country";

export default class FilterableCountryList extends Component{
	constructor(props){
		super(props);
		this.state = {
			searchQuery: "",
			sortMethod: "country-ascending"
		};

		this.handleSearchQuery = this.handleSearchQuery.bind(this);
		this.handleSortMethod = this.handleSortMethod.bind(this);
	}

	handleSearchQuery(searchQuery){
		this.setState({
			searchQuery: searchQuery
		});
	}

	handleSortMethod(sortMethod){
		this.setState({
			sortMethod: sortMethod
		});
	}

	render(){
		let placeholderText = "e.g., Sweden",
			rows = [];

		if(this.state.searchQuery.length > 0){
			this.props.stats.countries.forEach((country)=>{
				if(country.country.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1){
					rows.push(<Country maxAvg={this.props.stats.max.avg.kbps} maxPeak={this.props.stats.max.peak.kbps} countryData={country}/>);
				}
			});
		}

		let numberOfCountries = rows.length;

		return (
			<div>
				<Search
					placeholderText={placeholderText}
					onUserInput={this.handleSearchQuery}
					searchQuery={this.state.searchQuery}
				/>
				<Filters
					numberOfCountries={numberOfCountries}
					countriesLabel={rows.length === 1 ? "country" : "countries"}
				/>
				<div className="divider">
					<img class="divider-image" src="img/divider.svg"/>
				</div>
				<section id="country-index">
					<ul className="country-list">
						{rows}
					</ul>
				</section>
			</div>
		);
	}
}