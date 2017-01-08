function random(min, max, isInteger) {
	let r = Math.random() * (max - min) + min;
	return isInteger ? Math.round(r) : r;
}

function randomPick(array, nbToPick = 1){
	let picked = array.slice();
	let nbToEliminate = array.length - nbToPick;
	for(let i=0; i < nbToEliminate; i++){
		let eliminated = random(0, picked.length - 1, true);
		picked.splice(eliminated, 1);
	}
	return picked;
}

(function (window) {
	window.performance = window.performance || {};
	performance.now    = performance.now || function () {
			return +new Date();
		};

	function AccurateInterval(options) {
		this.startTime = 0;
		this.elapsed   = 0;
		this.timeout   = 0;
		this.interval  = options.interval || 100;
		this.callback  = options.callback;

		if (typeof this.callback !== 'function') throw 'You must specify a callback function.';

		return this;
	}

	AccurateInterval.prototype.start = function (startImmediately) {
		this.stopped = false;
		if(startImmediately){
			this.startTime = performance.now() - this.interval;
			this.tick();
		} else {
			this.startTime = performance.now();
			this.timeout   = window.setTimeout(this.tick.bind(this), this.interval);
		}
		return this;
	};

	AccurateInterval.prototype.tick = function () {
		this.elapsed += this.interval;
		let missedTicks  = 0,
		    nextInterval = this.interval - ((performance.now() - this.startTime) - this.elapsed);

		if (nextInterval <= 0) {
			missedTicks = (Math.abs(nextInterval) / this.interval) | 0;
			this.elapsed += missedTicks * this.interval;
			this.tick();
			return;
		}
		this.callback();
		if(!this.stopped){
			this.timeout = window.setTimeout(this.tick.bind(this), nextInterval);
		}
	};

	AccurateInterval.prototype.stop = function () {
		this.stopped = true;
		window.clearTimeout(this.timeout);
		return this;
	};

	window.setAccurateInterval = function (callback, interval, startImmediately) {
		return new AccurateInterval({callback: callback, interval: interval}).start(startImmediately);
	};

	window.clearAccurateInterval = function (acc) {
		acc.stop();
	};
})(window);