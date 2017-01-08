class Mole {
	constructor(elm){
		this.elm = elm;
		elm.addEventListener("click", e => this.onClick(e));
	}

	randomize(){
		//show time should not be random
		// timeShowUp = transitionTime + timeWaitingUp
		let timeShowUp        = 250 + (1800 / Game.difficulty);
		let timeWaitingUp     = Math.floor(random(0.4, 0.8) * timeShowUp);
		let transitionTime    = (timeShowUp - timeWaitingUp) / 2;
		let timeHidden        = Game.loopDuration - timeShowUp;
		let timeWaitingBefore = random(0, timeHidden, true);

		this.elm.style.transitionDelay = `${Math.floor(transitionTime)}ms`;
		Object.assign(this, { timeShowUp, timeHidden, timeWaitingUp, timeWaitingBefore, transitionTime });
	}

	onClick(event){
		event.preventDefault();
		if(this.isHit || !Game.started) return; // can't hit twice
		Game.setScore(Game.score + 1);
		this.setHit(true);
		this.setVisible(false);
	}

	setVisible(bool){
		this.isVisible = bool;
		this.elm.parentElement.classList.toggle("up", bool);
	}

	setHit(bool){  // add or clear damage state
		this.isHit = bool;
		this.elm.classList.toggle("hit", bool);
	}


}