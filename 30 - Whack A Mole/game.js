const Game = {
	title: document.querySelector("h1"),
	holes: document.querySelectorAll('.hole'),
	scoreBoard: document.querySelector('.scoreboard'),
	currentScore: document.querySelector('#currentScore'),
	currentTime: document.querySelector('#currentTime'),
	moles: [...document.querySelectorAll('.mole')].map(elm => new Mole(elm)),
	menu: document.querySelector(".menu"),
	gameBoard: document.querySelector(".game"),
	difficultySelector: document.querySelector("#difficulty"),
	startButton : document.querySelector(".start-btn"),

	roundDuration: 30,
	difficulties: { // moles per loop ; loops get faster as difficulty grows
		"Easy": 2,
		"Normal": 3,
		"Hard": 4,
		"Insane": 6
	}

};

Game.init = function(){
	Game.gameBoard.hidden = true;
	Game.difficultySelector.innerHTML = Object.entries(Game.difficulties)
		.map(([name, value]) => `<option value="${value}">${name}</option>`);
	Game.records.load();
};

Game.start = function(){
	Game.difficulty = parseFloat(Game.difficultySelector.value);
	Game.nbLoops = 8+Game.difficulty;
	Game.loopDuration = Game.roundDuration * 1000 / Game.nbLoops;
	Game.setScore(0);
	Game.setTime(Game.roundDuration);
	Game.toggleMenu(false);
	Game.started = true;

	Game.title.textContent = "Ready ?";
	setTimeout(() => {
		Game.title.textContent = "Whack-a-mole!";
		Game.loopTimer = setAccurateInterval(Game.loop, Game.loopDuration, true);
		Game.clockTimer = setAccurateInterval(Game.tick, 1000, true);
	}, 1000);

};

Game.end = function() {
	Game.clockTimer.stop();
	Game.loopTimer.stop();
	setTimeout(() => {
		Game.started = false;
		Game.records.registerScore();
		Game.toggleMenu(true);
	}, Game.loopDuration); // finish last loop
};

Game.loop = function(){
	let visibleMoles = randomPick(Game.moles, Game.difficulty);
	visibleMoles.forEach(mole => {
		mole.randomize();
		setTimeout(() => {
			mole.setHit(false);
			mole.setVisible(true);
			setTimeout(() => { mole.setVisible(false); }, mole.transitionTime + mole.timeWaitingUp);
		}, mole.timeWaitingBefore);
	});
};

Game.setTime = function(value) {
	Game.time = value;
	Game.currentTime.textContent = `Time: ${value}`;
};

Game.tick = function(){
	Game.setTime(Game.time - 1);
	if(Game.time <= 0) Game.end();
};

Game.toggleMenu = function(bool){
	Game.gameBoard.hidden = bool;
	Game.menu.hidden = !bool;
};

Game.setScore = function(value) {
	Game.score = value;
	Game.currentScore.textContent = `Score: ${value}`;
};

Game.records = {
	storeKey: "records",
	data: {},
	load: function(){
		let records = localStorage.getItem(Game.records.storeKey);
		if(records) Object.assign(Game.records.data, JSON.parse(records));
		Game.scoreBoard.querySelector("table").innerHTML = Object.entries(Game.difficulties)
			.map(([name, difficulty]) => [name, Game.records.data[difficulty] || "-"])
			.map(([name, score]) => `<tr><td>${name}</td><td class="score">${score}</td></tr>`)
			.join("\n")
	},
	registerScore: function (){
		let data = Game.records.data;
		let previousScore = data[Game.difficulty] || -1;
		if(Game.score > previousScore){
			data[Game.difficulty] = Game.score;
			localStorage.setItem(Game.records.storeKey, JSON.stringify(data));
			Game.records.load();
		}
	}
};