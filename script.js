const app = {
	$coordinatesTableBody: null,

	addCoordinateForm: {
		$self: null,
		$saveBtn: null,
		$xCoord: null,
		$yCoord: null,
		$zCoord: null,
		$biome: null,
		$description: null,
	},

	$removeCoordinateBtns: null,

	biomes: [], // empty for now, indexes should be used instead of strings like "swamp"
	coordinates: [
		// {id: 1, x: 14, y: 23, z: -500, biome: "swamp", description: "lovak"},
		// {id: 2, x: 37, y: 13, z: 3400, biome: "dark_forest", description: ""},
		// {id: 3, x: 73, y: 63, z: 100, biome: "forest", description: ""},
		// {id: 4, x: 58, y: 0, z: 200, biome: "desert", description: ""},
		// {id: 5, x: 96, y: 46, z: 300, biome: "ocean", description: ""},
	],
	init: function () {
		this.loadLocalStorage();
		this.cacheHtml();
		this.bindEvents();
		this.updateTable();
	},
	cacheHtml: function () {
		// gets the first tbody element of the table with the id "coordinates-table"
		this.$coordinatesTableBody = document.getElementById("coordinates-table").tBodies[0];

		// gets the form for adding a new coordinate and caches all the input fields in an object (an object is used to group together similar stuff)
		this.addCoordinateForm = {
			$self: document.getElementById("add-coordinate"),
			$saveBtn: document.getElementById("saveBtn"),
			$xCoord: document.getElementById("xCoord"),
			$yCoord: document.getElementById("yCoord"),
			$zCoord: document.getElementById("zCoord"),
			$biome: document.getElementById("biome"),
			$description: document.getElementById("description"),
		};

		// this.$removeCoordinateBtns = document.getElementsByClassName("delete-btn");
		// console.log(this.$removeCoordinateBtns);
		// for (var i = 0; i < this.$removeCoordinateBtns.length; i++) {
		// 	this.$removeCoordinateBtns[i].onclick = this.removeCoordinate;
		// }
	},
	bindEvents: function () {
		this.addCoordinateForm.$saveBtn.addEventListener("click", this.addCoordinate.bind(this));
	},
	createNewCoordinateObj: function (x, y, z, biome, description) {
		return {
			id: this.coordinates.length + 1,
			x: x,
			y: y,
			z: z,
			biome: biome,
			description: description,
		};
	},
	createStupidDom: function (id, x, y, z, biome, description) {
		const fields = [id, x, y, z, biome, description];
		const tds = fields.map(function (field) {
			const td = document.createElement('td');
			td.innerHTML = field;

			return td;
		});

		const deleteBtn = document.createElement('button');
		deleteBtn.type = "button";
		deleteBtn.innerHTML = "DELETE";
		deleteBtn.value = id;
		deleteBtn.classList.add('delete-btn');
		deleteBtn.addEventListener("click", this.removeCoordinate.bind(this));
		tds.push(deleteBtn);

		return tds;
	},
	resetForm: function() {
		const $form = this.addCoordinateForm;
		$form.$xCoord.value = ""; // value of input with id "xCoord"
		$form.$yCoord.value = "";
		$form.$zCoord.value = "";
		$form.$biome.value = "";
		$form.$description.value = "";
	},
	addCoordinate: function () {
		// this is just an alias so we don't have to write "this.addCoordinateForm" 90 fucking times
		const $form = this.addCoordinateForm;
		// save old length of array - this is needed to properly add the new row to the table,
		// since the lenght changes after we add the new coords
		const oldLength = this.coordinates.length; 

		// .push returns the current length of the array it modified - this can be used to get the last element of the array
		const newLength = this.coordinates.push(this.createNewCoordinateObj(
			parseInt($form.$xCoord.value), // value of input with id "xCoord"
			parseInt($form.$yCoord.value),
			parseInt($form.$zCoord.value),
			$form.$biome.value,
			$form.$description.value
		));
		const newCoords = this.coordinates[newLength - 1];
		const newRow = this.$coordinatesTableBody.insertRow(oldLength);
		const tds = this.createStupidDom(
			newCoords.id,
			newCoords.x,
			newCoords.y,
			newCoords.z,
			newCoords.biome,
			newCoords.description
		);

		for (let i = 0; i < tds.length; i++) {
			newRow.appendChild(tds[i]);
		}

		this.resetForm();
		this.saveLocalStorage();
	},
	removeCoordinate: function (e) {
		const proceed = confirm("NIGGA ARE YOU SURE THO");
		if (proceed == false) {
			return;
		}
		
		const rowToDelete = e.srcElement.closest('tr');
		this.$coordinatesTableBody.removeChild(rowToDelete);

		const clickedId = parseInt(e.srcElement.value);
		console.log(clickedId);
		this.coordinates = this.coordinates.filter(function (coordinate) {
			return coordinate.id !== clickedId;
		});

		this.saveLocalStorage();
	},

	saveLocalStorage: function () {
		window.localStorage.setItem('coordinates', JSON.stringify(this.coordinates));
	},
	loadLocalStorage: function () {
		const coordinates = JSON.parse(window.localStorage.getItem('coordinates')) || [];

		this.coordinates = coordinates;
	},
	updateTable: function () {
		// sets the content of the tbody to the new sexy string we've created
		for (let i = 0; i < this.coordinates.length; i++) {
			const currCoord = this.coordinates[i];
			const tr = document.createElement('tr');
			const tds = this.createStupidDom(
				currCoord.id,
				currCoord.x,
				currCoord.y,
				currCoord.z,
				currCoord.biome,
				currCoord.description
			);

			for (let j = 0; j < tds.length; j++) {
				tr.appendChild(tds[j]);
			}

			this.$coordinatesTableBody.appendChild(tr);
		}
	},
}

app.init();


// UPCOMING FEATURE IN 1.15 - STAY TUNED, PLEASE LIKE AND CONSIDER SUBSCRIBING?
// const biomes = [
// 	"ocean",
// 	"deep_ocean",
// 	"frozen_ocean",
// 	"deep_frozen_ocean",
// 	"cold_ocean",
// 	"deep_cold_ocean",
// 	"lukewarm_ocean",
// 	"deep_lukewarm_ocean",
// 	"warm_ocean",
// 	"deep_warm_ocean",
// 	"river",
// 	"frozen_river",
// 	"beach",
// 	"stone_shore",
// 	"snowy_beach",
// 	"forest",
// 	"wooded_hills",
// 	"flower_forest",
// 	"birch_forest",
// 	"birch_forest_hills",
// 	"tall_birch_forest",
// 	"tall_birch_hills",
// 	"dark_forest",
// 	"dark_forest_hills",
// 	"jungle",
// 	"jungle_hills",
// 	"modified_jungle",
// 	"jungle_edge",
// 	"modified_jungle_edge",
// 	"bamboo_jungle",
// 	"bamboo_jungle_hills",
// 	"taiga",
// 	"taiga_hills",
// 	"taiga_mountains",
// 	"snowy_taiga",
// 	"snowy_taiga_hills",
// 	"snowy_taiga_mountains",
// 	"giant_tree_taiga",
// 	"giant_tree_taiga_hills",
// 	"giant_spruce_taiga",
// 	"giant_spruce_taiga_hills",
// 	"mushroom_fields",
// 	"mushroom_field_shore",
// 	"swamp",
// 	"swamp_hills",
// 	"savanna",
// 	"savanna_plateau",
// 	"shattered_savanna",
// 	"shattered_savanna_plateau",
// 	"plains",
// 	"sunflower_plains",
// 	"desert",
// 	"desert_hills",
// 	"desert_lakes",
// 	"snowy_tundra",
// 	"snowy_mountains",
// 	"ice_spikes",
// 	"mountains",
// 	"wooded_mountains",
// 	"gravelly_mountains",
// 	"modified_gravelly_mountains",
// 	"mountain_edge",
// 	"badlands",
// 	"badlands_plateau",
// 	"modified_badlands_plateau",
// 	"wooded_badlands_plateau",
// 	"modified_wooded_badlands_plateau",
// 	"eroded_badlands",
// 	"nether",
// 	"nether_wastes‌"
// 	"crimson_forest",
// 	"warped_forest",
// 	"soul_sand_valley",
// 	"basalt_deltas",
// 	"the_end",
// 	"small_end_islands",
// 	"end_midlands",
// 	"end_highlands",
// 	"end_barrens",
// 	"the_void",
// ],