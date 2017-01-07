const timeLeftElm = document.querySelector(".display__time-left");
const endTimeElm = document.querySelector(".display__end-time");

let currentTimer = null;

function formatTimeLeft(t) {
	let minutes = Math.floor(t/60),
	    seconds = ("0"+(t%60)).slice(-2);
	return `${minutes}:${seconds}`;
}

function timer(seconds) {
	if(currentTimer != null) clearTimeout(currentTimer);

	let remainingTime = seconds;
	const endTime = new Date(Date.now() + seconds*1000);

	(function tick() {
		timeLeftElm.textContent = formatTimeLeft(remainingTime);
		endTimeElm.textContent = "Be back at "+endTime.toLocaleTimeString();
		remainingTime -= 1;
		if(remainingTime >= 0){
			currentTimer = setTimeout(tick, 1000 - Date.now() % 1000);
		}
	})();
}

const controls = document.querySelector(".timer__controls");
const customTimerForm = document.querySelector("#custom");

for(let btn of controls.querySelectorAll("button[data-time]")){
	btn.onclick = () => timer(parseFloat(btn.dataset.time));
}
customTimerForm.onsubmit = e => {
	e.preventDefault();
	timer(parseFloat(customTimerForm.minutes.value) * 60);
	customTimerForm.minutes.value = null;
};


