import { h, render, Component } from "preact";

export default class Filters extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onUserInput(this.sortMethodInput.value, this.sortOrderInput.value);
	}

	render(){
		return (
			<section id="filters">
				<h3 className="country-count">Showing {this.props.numberOfCountries} {this.props.countriesLabel}</h3>
				<div className="filter-container">
					<label for="sort" className="sort-label">Sort by</label>
					<div className="select-container">
						<select id="sort" name="sort" ref={(select)=>this.sortMethodInput = select} onChange={this.handleChange}>
							<option value="c">country name</option>
							<option selected value="a">average speed</option>
							<option value="p">peak speed</option>
							<option value="p4">% >4 mbps</option>
							<option value="p10">% >10 mbps</option>
							<option value="p15">% >15 mbps</option>
							<option value="p25">% >25 mbps</option>
						</select>
					</div>
					<label for="order" className="sort-label order">in</label>
					<div className="select-container">
						<select id="order" name="order" ref={(select)=>this.sortOrderInput = select} onChange={this.handleChange}>
							<option selected value="asc">ascending</option>
							<option value="desc">descending</option>
						</select>
					</div>
					<label for="order" className="sort-label order">order</label>
				</div>
			</section>
		);
	}
}
