import { h, render, Component } from "preact";
import CountryStat from "./CountryStat";

export default class Country extends Component{
	constructor(props){
		super(props);
	}

	round(value, precision){
		let multiplier = Math.pow(10, precision || 0);
		return Math.round(value * multiplier) / multiplier;
	}

	blend(pos){
		let r1 = 0x69d05c >> 16,
			g1 = (0x69d05c >> 8) & 0xff,
			b1  = 0x69d05c & 0xff,
			r2 = 0xb0413e >> 16,
			g2 = (0xb0413e >> 8) & 0xff,
			b2  = 0xb0413e & 0xff;

		let r3 = pos * r1 + (1 - pos) * r2,
			g3 = pos * g1 + (1 - pos) * g2,
			b3 = pos * b1 + (1 - pos) * b2;

			return "#" + Math.ceil(r3).toString(16) + Math.ceil(g3).toString(16) + Math.ceil(b3).toString(16);
	}

	render(){
		let avg = this.round((this.props.countryData.avg / 1000), 2),
			peak = this.round((this.props.countryData.peak / 1000), 2),
			avgPercentage = this.props.countryData.avg / this.props.maxAvg,
			peakPercentage = this.props.countryData.peak / this.props.maxPeak,
			avgColor = this.blend(avgPercentage),
			peakColor = this.blend(peakPercentage);

		return (
			<li className="country">
				<h4>{this.props.countryData.country}</h4>
				<CountryStat
					metricName="Avg"
					metricValue={avg}
					metricBarValue={avgPercentage * 100}
					metricBarColor={avgColor}
				/>
				<CountryStat
					metricName="Peak"
					metricValue={peak}
					metricBarValue={peakPercentage * 100}
					metricBarColor={peakColor}
				/>
			</li>
		);
	}
}