import { h, render, Component } from "preact";
import { round, blend, toTitleCase } from "./Utilities";
import CountryStat from "./CountryStat";

export default class Country extends Component{
	constructor(props){
		super(props);
	}

	render(){
		let country = toTitleCase(this.props.countryData.c),
			countryCode = this.props.countryData.cc.toLowerCase(),
			avg = round((this.props.countryData.a / 1000), 1),
			peak = round((this.props.countryData.p / 1000), 1),
			fourMbps = round(this.props.countryData.p4, 1),
			tenMbps = round(this.props.countryData.p10, 1),
			fifteenMbps = round(this.props.countryData.p15, 1),
			twentyFiveMbps = round(this.props.countryData.p25, 1),
			avgPercentage = this.props.countryData.a / this.props.maxAvg,
			peakPercentage = this.props.countryData.p / this.props.maxPeak,
			avgColor = blend(avgPercentage),
			peakColor = blend(peakPercentage),
			fourMbpsColor = blend(fourMbps / 100),
			tenMbpsColor = blend(tenMbps / 100),
			fifteenMbpsColor = blend(fifteenMbps / 100),
			twentyFiveMbpsColor = blend(twentyFiveMbps / 100);

		return (
			<li className="country">
				<a name={countryCode}/>
				<a href={"/country/" + countryCode} title={country} className="permalink" title="Copy Permalink">
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
						metricName="% of IPv4 addresses >4 Mbps"
						metricValue={fourMbps + "%"}
						metricBarValue={fourMbps}
						metricBarColor={fourMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >10 Mbps"
						metricValue={tenMbps + "%"}
						metricBarValue={tenMbps}
						metricBarColor={tenMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >15 Mbps"
						metricValue={fifteenMbps + "%"}
						metricBarValue={fifteenMbps}
						metricBarColor={fifteenMbpsColor}
					/>
					<CountryStat
						metricName="% of IPv4 addresses >25 Mbps"
						metricValue={twentyFiveMbps + "%"}
						metricBarValue={twentyFiveMbps}
						metricBarColor={twentyFiveMbpsColor}
					/>
				</div>
			</li>
		);
	}
}