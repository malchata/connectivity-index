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
			let rawRows = [];

			this.props.stats.countries.forEach((country)=>{
				if(country.country.toLowerCase().indexOf(this.state.searchQuery.toLowerCase()) !== -1){
					rawRows.push(country);
				}
			});

			switch(this.state.sortMethod){
				case "country-ascending":
					rawRows = rawRows.sort((a, b)=>{
						if(a.country < b.country){
							return -1;
						}

						if(a.country > b.country){
							return 1;
						}

						return 0;
					});
				break;

				case "country-descending":
					rawRows = rawRows.sort((a, b)=>{
						if(b.country < a.country){
							return -1;
						}

						if(b.country > a.country){
							return 1;
						}

						return 0;
					});
				break;

				case "avg-ascending":
					rawRows = rawRows.sort((a, b)=>{
						return a.avg - b.avg;
					});
				break;

				case "avg-descending":
					rawRows = rawRows.sort((a, b)=>{
						return b.avg - a.avg;
					});
				break;

				case "peak-ascending":
					rawRows = rawRows.sort((a, b)=>{
						return a.peak - b.peak;
					});
				break;

				case "peak-descending":
					rawRows = rawRows.sort((a, b)=>{
						return b.peak - a.peak;
					});
				break;
			}

			for(let i = 0; i < rawRows.length; i++){
				rows.push(<Country maxAvg={this.props.stats.max.avg.kbps} maxPeak={this.props.stats.max.peak.kbps} countryData={rawRows[i]}/>);
			}
		}

		let numberOfCountries = rows.length;

		return (
			<div>
				<Search placeholderText={placeholderText} onUserInput={this.handleSearchQuery} searchQuery={this.state.searchQuery}
				/>
				<Filters numberOfCountries={numberOfCountries} countriesLabel={rows.length === 1 ? "country" : "countries"} onUserInput={this.handleSortMethod}/>
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