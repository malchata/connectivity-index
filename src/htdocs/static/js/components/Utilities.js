// Found at: http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
export const toTitleCase = (str)=>{
	str = str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	str = str.replace(" Of", " of");
	str = str.replace(" And", " and");
	return str;
}

export const round = (value, precision)=>{
	let multiplier = Math.pow(10, precision || 0);
	return Math.round(value * multiplier) / multiplier;
}

export const blend = (pos)=>{
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

export const dataSort = (rows, keyName, order)=>{
	return rows.sort((a, b)=>{
		if(order === "asc"){
			if(a[keyName] < b[keyName]){
				return -1;
			}

			if(a[keyName] > b[keyName]){
				return 1;
			}

			return 0;
		}
		else{
			if(b[keyName] < a[keyName]){
				return -1;
			}

			if(b[keyName] > a[keyName]){
				return 1;
			}

			return 0;
		}
	});
}