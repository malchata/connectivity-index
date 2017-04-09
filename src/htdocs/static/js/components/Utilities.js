export const blend = (pos)=>{
	let percentile = pos / 100;

	return "#" + Math.ceil(percentile * (0x499f68 >> 16) + (1 - percentile) * (0x561d25 >> 16)).toString(16) + Math.ceil(percentile * ((0x499f68 >> 8) & 0xff) + (1 - percentile) * ((0x561d25 >> 8) & 0xff)).toString(16) + Math.ceil(percentile * (0x499f68 & 0xff) + (1 - percentile) * (0x561d25 & 0xff)).toString(16);
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
