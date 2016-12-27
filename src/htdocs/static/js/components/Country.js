import { h, render, Component } from "preact";
import * as Utilities from "./Utilities";
import CountryStat from "./CountryStat";

export default class Country extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let country = Utilities.toTitleCase(this.props.countryData.c),
			avg = Utilities.round((this.props.countryData.a / 1000), 1),
			peak = Utilities.round((this.props.countryData.p / 1000), 1),
			fourMbps = Utilities.round(this.props.countryData.p4, 1),
			tenMbps = Utilities.round(this.props.countryData.p10, 1),
			fifteenMbps = Utilities.round(this.props.countryData.p15, 1),
			twentyFiveMbps = Utilities.round(this.props.countryData.p25, 1),
			avgPercentage = this.props.countryData.a / this.props.maxAvg,
			peakPercentage = this.props.countryData.p / this.props.maxPeak,
			avgColor = Utilities.blend(avgPercentage),
			peakColor = Utilities.blend(peakPercentage),
			fourMbpsColor = Utilities.blend(fourMbps / 100),
			tenMbpsColor = Utilities.blend(tenMbps / 100),
			fifteenMbpsColor = Utilities.blend(fifteenMbps / 100),
			twentyFiveMbpsColor = Utilities.blend(twentyFiveMbps / 100);

		return (
			<li className="country">
				<a name={this.props.countryData.countryCode}/>
				<a href={"/country/" + this.props.countryData.cc.toLowerCase()} className="permalink" title="Copy Permalink">
					<img src="/img/link.svg" alt="Copy Permalink"/>
				</a>
				<h4 className="country-name">{country}</h4>
				<div className="stats">
					<CountryStat
						metricName="Average speed (mbps)"
						metricValue={avg}
						metricBarValue={avgPercentage * 100}
						metricBarColor={avgColor}
					/>
					<CountryStat
						metricName="Peak speed (mbps)"
						metricValue={peak}
						metricBarValue={peakPercentage * 100}
						metricBarColor={peakColor}
					/>
					<CountryStat
						metricName="% of population >4 Mbps"
						metricValue={fourMbps + "%"}
						metricBarValue={fourMbps}
						metricBarColor={fourMbpsColor}
					/>
					<CountryStat
						metricName="% of population >10 Mbps"
						metricValue={tenMbps + "%"}
						metricBarValue={tenMbps}
						metricBarColor={tenMbpsColor}
					/>
					<CountryStat
						metricName="% of population >15 Mbps"
						metricValue={fifteenMbps + "%"}
						metricBarValue={fifteenMbps}
						metricBarColor={fifteenMbpsColor}
					/>
					<CountryStat
						metricName="% of population >25 Mbps"
						metricValue={twentyFiveMbps + "%"}
						metricBarValue={twentyFiveMbps}
						metricBarColor={twentyFiveMbpsColor}
					/>
				</div>
			</li>
		);
	}
}