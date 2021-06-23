function initApplication(){
	const xs = Array.from({length: 700}, (x, i) => -4 + i/100);
	const line1 = {
		x: xs,
		y: xs.map(x => Math.exp(-x*x/2)/Math.sqrt(2*Math.PI)),
		name: "A"
	};
	const line2 = {
		x: xs,
		y: xs.map(x => Math.exp(-(x+1)*(x+1)/2)/Math.sqrt(2*Math.PI)),
		name: "B"
	};
	const line3 = {
		x: xs,
		y: xs.map(x => Math.exp(-x*x/2)*(1+math.erf((x+1)/2))/(Math.sqrt(2*Math.PI)*(1+math.erf(1/2)))),
		name: "A|A>B"
	};
	const p = (1+math.erf(1/2))/2;
	const f = Math.exp(-1/4)/Math.sqrt(8*Math.PI);
	const u = f/p;
	const m = 1 + f/p*(-1/2-f/p);
	const line4 = {
		x: xs,
		y: xs.map(x => Math.exp(-(x-u)*(x-u)/(2*m*m))/(m*Math.sqrt(2*Math.PI))),
		name: "~A|A>B"
	};
	Plotly.newPlot(
		"plot1",
		[
			line1,
			line2,
			line3,
			line4
		], {
			margin: {t: 0, r: 0, b: 0, l: 0}
		}, {
			staticPlot: true
		});
}

document.onreadystatechange = event => {
	if(event.target.readyState === "complete"){
		initApplication();
	}
};
