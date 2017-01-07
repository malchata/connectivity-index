import { h, render, Component } from "preact";
import { blend } from "./Utilities";
import CountryStat from "./CountryStat";

export default class Country extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let avgPercentage = this.props.countryData.a / this.props.maxAvg,
			peakPercentage = this.props.countryData.p / this.props.maxPeak,
			avgColor = blend(avgPercentage * 100),
			peakColor = blend(peakPercentage * 100),
			fourMbpsColor = blend(this.props.countryData.p4),
			tenMbpsColor = blend(this.props.countryData.p10),
			fifteenMbpsColor = blend(this.props.countryData.p15),
			twentyFiveMbpsColor = blend(this.props.countryData.p25);

		return (
			<li className="country">
				<a name={this.props.countryData.cc}/>
				<a href={"/country/" + this.props.countryData.cc} title={this.props.countryData.c} className="permalink" title="Copy permalink">Copy permalink</a>
				<h4 className="country-name">{this.props.countryData.c}</h4>
				<div className="stats">
					<CountryStat
						metricName="Average speed (mbps)"
						metricValue={this.props.countryData.a}
						metricBarValue={avgPercentage * 100}
						metricBarColor={avgColor}
					/>
					<CountryStat
						metricName="Peak speed (mbps)"
						metricValue={this.props.countryData.p}
						metricBarValue={peakPercentage * 100}
						metricBarColor={peakColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >4 Mbps"
						metricValue={this.props.countryData.p4 + "%"}
						metricBarValue={this.props.countryData.p4}
						metricBarColor={fourMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >10 Mbps"
						metricValue={this.props.countryData.p10 + "%"}
						metricBarValue={this.props.countryData.p10}
						metricBarColor={tenMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >15 Mbps"
						metricValue={this.props.countryData.p15 + "%"}
						metricBarValue={this.props.countryData.p15}
						metricBarColor={fifteenMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >25 Mbps"
						metricValue={this.props.countryData.p25 + "%"}
						metricBarValue={this.props.countryData.p25}
						metricBarColor={twentyFiveMbpsColor}
					/>
				</div>
			</li>
		);
	}
}