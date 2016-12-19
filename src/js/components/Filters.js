import { h, render, Component } from "preact";

export default class Filters extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onUserInput(
			this.sortMethodInput.value
		);
	}

	render(){
		return (
			<section id="filters">
				<h3 class="country-count">Showing {this.props.numberOfCountries} {this.props.countriesLabel}</h3>
				<div className="filter-container">
					<label for="sort" class="sort-label">Sort by</label>
					<select id="sort" name="sort" ref={(select)=>this.sortMethodInput = select} onChange={this.handleChange}>
						<option value="country-ascending">Country (Ascending)</option>
						<option value="country-descending">Country (Descending)</option>
						<option value="avg-ascending">Average Speed (Ascending)</option>
						<option value="avg-descending">Average Speed (Descending)</option>
						<option value="peak-ascending">Peak Speed (Ascending)</option>
						<option value="peak-descending">Peak Speed (Descending)</option>
					</select>
				</div>
			</section>
		);
	}
}