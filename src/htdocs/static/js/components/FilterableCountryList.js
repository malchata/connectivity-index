import { h, render, Component } from "preact";
import * as Utilities from "./Utilities";
import Filters from "./Filters";
import Search from "./Search";
import Country from "./Country";

export default class FilterableCountryList extends Component{
	constructor(props){
		super(props);
		this.state = {
			searchQuery: "",
			sortMethod: "avg",
			sortOrder: "asc"
		};

		this.handleSearchQuery = this.handleSearchQuery.bind(this);
		this.handleSortMethod = this.handleSortMethod.bind(this);
	}

	handleSearchQuery(searchQuery){
		this.setState({
			searchQuery: searchQuery
		});
	}

	handleSortMethod(sortMethod, sortOrder){
		this.setState({
			sortMethod: sortMethod,
			sortOrder: sortOrder
		});
	}

	render(){
		let placeholderText = "e.g., Sweden",
			rows = [];

		if(this.state.searchQuery.length > 0){
			let rawRows = [];

			this.props.stats.countries.forEach((country)=>{
				if(country.c.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1){
					rawRows.push(country);
				}
			});

			rawRows = Utilities.dataSort(rawRows, this.state.sortMethod, this.state.sortOrder);

			for(let i = 0; i < rawRows.length; i++){
				rows.push(<Country maxAvg={this.props.stats.m.a.k} maxPeak={this.props.stats.m.p.k} countryData={rawRows[i]}/>);
			}
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
					onUserInput={this.handleSortMethod}
				/>
				<ul className="country-list">
					{rows}
				</ul>
			</div>
		);
	}
}