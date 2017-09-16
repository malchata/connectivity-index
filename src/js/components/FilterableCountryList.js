import { h, render, Component } from "preact";
import { dataSort } from "./Utilities";
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
		let placeholderText = "e.g., Zambia",
			rows = [],
			rawRows = [];

		if(this.state.searchQuery.length > 0){
			if(this.state.searchQuery === "*"){
				rawRows = this.props.stats.countries;
			}
			else{
				rawRows = this.props.stats.countries.filter((el)=>{
						return el.c.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1;
					});
			}

			rawRows = dataSort(rawRows, this.state.sortMethod, this.state.sortOrder);

			for(let i = 0; i < rawRows.length; i++){
				rows.push(<Country maxAvg={this.props.stats.m.a.k} maxPeak={this.props.stats.m.p.k} countryData={rawRows[i]}/>);
			}
		}

		return (
			<div>
				<Search
					placeholderText={placeholderText}
					onUserInput={this.handleSearchQuery}
					searchQuery={this.state.searchQuery}
				/>
				<Filters
					numberOfCountries={rows.length}
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
