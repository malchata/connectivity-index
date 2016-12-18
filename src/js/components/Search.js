import { h, render, Component } from "preact";

export default class Search extends Component{
	constructor(props){
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(){
		this.props.onUserInput(
			this.searchQueryInput.value
		);
	}

	render(){
		return (
			<header>
				<label
					id="query-label"
					for="query">
					Search by Country
				</label>
				<input
					type="text"
					placeholder={this.props.placeholderText}
					value={this.props.searchQuery}
					ref={(input)=>this.searchQueryInput = input}
					onKeyUp={this.handleChange}
					id="query"
				/>
			</header>
		);
	}
}