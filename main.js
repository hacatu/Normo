//import {Pokedex} from "./pokedex.js";

var num_pokemon = 898;
var num_choices = 8;
var pokemon_ratings = Array.from({length: num_pokemon + 1}, (x, i) => [0, 1]);
var pokemon_rankings = Array.from({length: num_pokemon + 1}, (x, i) => i - 1);

function makeDexEntFor(i){
	const dex_ent = Pokedex[Pokemon[i]];
	let dex_div = document.createElement("div");
	dex_div.className = "dexent";
	dex_div.setAttribute("data-idx", "" + i);
	let ent_img = document.createElement("img");
	ent_img.className = "dexsprite";
	ent_img.src = "./sprites/pokemon/" + i + ".png";
	ent_img.title = pokemon_ratings[i].join("±");
	dex_div.appendChild(ent_img);
	let ent_name = document.createElement("span");
	ent_name.className = "dexname";
	ent_name.innerHTML = "#" + i + ": " + dex_ent.name;
	dex_div.appendChild(ent_name);
	for(const typename of dex_ent.types){
		let ent_typename = document.createElement("img");
		ent_typename.className = "dextype";
		ent_typename.src = "./sprites/types/" + typename + ".png";
		dex_div.appendChild(ent_typename);
	}
	let ent_stathex = document.createElement("div");
	ent_stathex.className = "stathex";
	let clip_path_str = "clip-path: polygon(";
	let stat_ratio = dex_ent.baseStats.hp/255;
	clip_path_str += "50% " + (50 - 50*stat_ratio) + "%, ";
	stat_ratio = dex_ent.baseStats.def/255;
	clip_path_str += "" + (50 - 43.30127018922193*stat_ratio) + "% " + (50 - 25*stat_ratio) + "%, ";
	stat_ratio = dex_ent.baseStats.spd/255;
	clip_path_str += "" + (50 - 43.30127018922193*stat_ratio) + "% " + (50 + 25*stat_ratio) + "%, ";
	stat_ratio = dex_ent.baseStats.spe/255;
	clip_path_str += "50% " + (50 + 50*stat_ratio) + "%, ";
	stat_ratio = dex_ent.baseStats.spa/255;
	clip_path_str += "" + (50 + 43.30127018922193*stat_ratio) + "% " + (50 + 25*stat_ratio) + "%, ";
	stat_ratio = dex_ent.baseStats.atk/255;
	clip_path_str += "" + (50 + 43.30127018922193*stat_ratio) + "% " + (50 - 25*stat_ratio) + "%)";
	//console.log(clip_path_str);
	ent_stathex.style = clip_path_str;
	ent_stathex.title = "hp: " + dex_ent.baseStats.hp + ", atk: " + dex_ent.baseStats.atk + ", def: " +
		dex_ent.baseStats.def + ", spa: " + dex_ent.baseStats.spa + ", spd: " + dex_ent.baseStats.spd +
		", spe: " + dex_ent.baseStats.spe;
	dex_div.appendChild(ent_stathex);
	return dex_div;
}

function initRankedList(){
	let _grid = document.getElementById("pokemon_holder");
	let grid = _grid.cloneNode(false);
	_grid.parentNode.replaceChild(grid, _grid);

	for(let i = 1; i <= num_pokemon; ++i){
		const dex_div = makeDexEntFor(i);
		grid.appendChild(dex_div);
	}
}

function toggleTargetSelected(event){
	let target = event.target;
	console.log(target);
	while(target && !target.classList.contains("dexent")){
		target = target.parentElement;
	}
	if(target){
		if(target.classList.contains("choice_selected")){
			target.classList.remove("choice_selected");
		}else{
			target.classList.add("choice_selected");
		}
	}
}

function initChoiceList(){
	let _grid = document.getElementById("choice_holder");
	let grid = _grid.cloneNode(false);
	_grid.parentNode.replaceChild(grid, _grid);

	for(const i of _.sample(_.range(1, num_pokemon + 1), num_choices)){
		const dex_div = makeDexEntFor(i);
		dex_div.onclick = toggleTargetSelected;
		grid.appendChild(dex_div);
	}

	document.getElementById("entropy_label").innerText = "Ranking information: " + computeRankingEntropy();
}

function saveOrLoad(event){
	if(event.keyCode != 13){
		return;
	}
	const input = document.getElementById("serialized_io");
	if(input.value === ""){
		input.value = JSON.stringify(pokemon_ratings);
	}else{
		pokemon_ratings = JSON.parse(input.value);
		input.value = "";
		initRankedList();
	}
}

function initApplication(){
	initRankedList();
	initChoiceList();
	document.getElementById("update_ranking_button").onclick = updateRanking;
	document.getElementById("serialized_io").onkeydown = saveOrLoad;
}

function computeRankingEntropy(){
	const grid = document.getElementById("pokemon_holder");
	let loglikelihood = 0;
	for(let i = 0; i < num_pokemon - 1; ++i){
		const i_idx = +grid.childNodes[i].getAttribute("data-idx");
		const j_idx = +grid.childNodes[i + 1].getAttribute("data-idx");
		const [mi, si] = pokemon_ratings[i_idx];
		const [mj, sj] = pokemon_ratings[j_idx];
		const mdif = mj - mi;//mean of B-A
		const sdif = Math.hypot(si, sj);//standard deviation of B-A
		const p = (1+math.erf(mdif/(sdif*Math.SQRT2)))/2;
		loglikelihood += -Math.log2(p);
	}
	return loglikelihood;
}

function updateRanking(){
	let grid = document.getElementById("choice_holder");
	let deltas = Array.from({length: num_choices}, (x, i) => [0, 1]);
	for(let i = 0; i < num_choices - 1; ++i){
		for(let j = i + 1; j < num_choices; ++j){
			const i_chosen = grid.childNodes[i].classList.contains("choice_selected");
			const j_chosen = grid.childNodes[j].classList.contains("choice_selected");
			const i_idx = +grid.childNodes[i].getAttribute("data-idx");
			const j_idx = +grid.childNodes[j].getAttribute("data-idx");
			if(i_chosen && !j_chosen){
				//console.log(i, "(", i_idx, ") selected over", j, "(", j_idx, ")");
				const [i_deltas, j_deltas] = computeDeltasForVictory(i_idx, j_idx);
				deltas[i][0] += i_deltas[0];
				deltas[i][1] *= i_deltas[1];
				deltas[j][0] -= j_deltas[0];
				deltas[j][1] *= j_deltas[1];
			}else if(!i_chosen && j_chosen){
				//console.log(j, "(", j_idx, ") selected over", i, "(", i_idx, ")");
				const [j_deltas, i_deltas] = computeDeltasForVictory(j_idx, i_idx);
				deltas[i][0] -= i_deltas[0];
				deltas[i][1] *= i_deltas[1];
				deltas[j][0] += j_deltas[0];
				deltas[j][1] *= j_deltas[1];
			}
		}
	}
	for(let i = 0; i < num_choices; ++i){
		const i_idx = +grid.childNodes[i].getAttribute("data-idx");
		pokemon_ratings[i_idx][0] += deltas[i][0];
		pokemon_ratings[i_idx][1] *= deltas[i][1];
		if(deltas[i][0] > 0){
			increaseRanking(i_idx);
		}else if(deltas[i][0] < 0){
			decreaseRanking(i_idx);
		}
		if(deltas[i][0] != 0 || deltas[i][1] != 1){
			updateRating(i_idx);
		}
	}
	initChoiceList();
}

function computeDeltasForVictory(i, j){
	const [mi, si] = pokemon_ratings[i];
	const [mj, sj] = pokemon_ratings[j];
	const mdif = mj - mi;//mean of B-A
	const sdif = Math.hypot(si, sj);//standard deviation of B-A
	// freg is f_{B-A}(0)/F_{B-A}(0)
	const freg = Math.exp(-mdif*mdif/(sdif*sdif))/(sdif*Math.sqrt(8*Math.PI*(1+math.erf(-mdif/(sdif*Math.SQRT2)))));
	// sfac is the coefficient on the sdif**4 term in the new stdevs
	const sfac = freg*(mdif/(sdif*sdif) - freg);
	return [
		[
			si*si*freg,
			Math.sqrt(1 + si*si*sfac)
		], [
			sj*sj*freg,
			Math.sqrt(1 + sj*sj*sfac)
		]
	];
}

function increaseRanking(i_idx){
	let grid = document.getElementById("pokemon_holder");
	const rating = pokemon_ratings[i_idx][0];
	let i_orig = pokemon_rankings[i_idx];
	let i = i_orig - 1;
	if(i == -1){
		return;
	}
	for(; i >= 0; --i){
		let idx = +grid.childNodes[i].getAttribute("data-idx");
		if(pokemon_ratings[idx][0] >= rating){
			if(i_orig == i + 1){
				return;
			}
			grid.insertBefore(grid.childNodes[i_orig], grid.childNodes[i + 1]);
			pokemon_rankings[i_idx] = i + 1;
			return;
		}else{
			++pokemon_rankings[idx];
		}
	}
	if(i == -1){
		grid.insertBefore(grid.childNodes[i_orig], grid.childNodes[0]);
		pokemon_rankings[i_idx] = 0;
	}
}

function decreaseRanking(i_idx){
	let grid = document.getElementById("pokemon_holder");
	const rating = pokemon_ratings[i_idx][0];
	let i_orig = pokemon_rankings[i_idx];
	let i = i_orig + 1;
	if(i == num_pokemon){
		return;
	}
	for(; i < num_pokemon; ++i){
		let idx = +grid.childNodes[i].getAttribute("data-idx");
		if(pokemon_ratings[idx][0] <= rating){
			if(i_orig == i - 1){
				return;
			}
			grid.insertBefore(grid.childNodes[i_orig], grid.childNodes[i]);
			pokemon_rankings[i_idx] = i - 1;
			return;
		}else{
			--pokemon_rankings[idx];
		}
	}
	if(i == num_pokemon){
		grid.insertBefore(grid.childNodes[i_orig], null);
		pokemon_rankings[i_idx] = num_pokemon - 1;
	}
}

function updateRating(i_idx){
	let grid = document.getElementById("pokemon_holder");
	let i = pokemon_rankings[i_idx];
	grid.childNodes[i].getElementsByClassName("dexsprite")[0].title = pokemon_ratings[i_idx].join("±");
}

document.onreadystatechange = event => {
	if(event.target.readyState === "complete"){
		initApplication();
	}
};

