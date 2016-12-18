import { h, render, Component } from "preact";

export default class Filters extends Component{
	constructor(props){
		super(props);
	}

	render(){
		return (
			<section id="filters">
				<h3>Showing {this.props.numberOfCountries} {this.props.countriesLabel}</h3>
				<div className="filter-container">
					<label for="sort">Sort by:</label>
				</div>
			</section>
		);
	}
}