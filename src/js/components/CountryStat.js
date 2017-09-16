import { h, render, Component } from "preact";

export default class Country extends Component{
	render(props){
		let metricBarValueStyles = {
			width: this.props.metricBarValue + "%",
			background: this.props.metricBarColor,
		};

		return (
			<div className="stat">
				<p className="metric-name">{this.props.metricName}:</p>
				<div className="metric-bar">
					<div className="metric-bar-value" style={metricBarValueStyles}/>
				</div>
				<span className="metric-value">{this.props.metricValue}</span>
			</div>
		);
	}
}