export const blend = (pos)=>{
	let percentile = pos / 100,
		inverse = 1 - percentile,
		color1 = 0x499f68,
		color2 = 0x561d25,
		r1 = color1 >> 16,
		g1 = (color1 >> 8) & 0xFF,
		b1 = color1 & 0xFF,
		r2 = color2 >> 16,
		g2 = (color2 >> 8) & 0xFF,
		b2 = color2 & 0xFF,
		r3 = Math.ceil((percentile * r1) + (inverse * r2)).toString(16),
		g3 = Math.ceil((percentile * g1) + (inverse * g2)).toString(16),
		b3 = Math.ceil((percentile * b1) + (inverse * b2)).toString(16),
		final = "#" + r3 + g3 + b3;

	return final;
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
