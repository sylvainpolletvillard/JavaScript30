const
	video = document.querySelector(".player__video"),
	playPauseBtn = document.querySelector(".player__button"),
	volume = document.querySelector(".player__slider[name='volume']"),
	playbackRate = document.querySelector(".player__slider[name='playbackRate']"),
	skipButtons = document.querySelectorAll(".player__button[data-skip]"),
    progress = document.querySelector(".progress");

function updateTime(){
	const percentage = (100 * video.currentTime / video.duration) || 0;
	Object.assign(progress.querySelector(".progress__filled").style, {
		width: `${percentage}%`,
		flexBasis: `${percentage}%`
	});
}

function togglePlay(){
	if(video.paused){
		video.play();
		playPauseBtn.textContent = "❚❚"
	} else {
		video.pause();
		playPauseBtn.textContent = "►"
	}
}

function setTime(event) {
	let time = ((event.offsetX - progress.offsetLeft) / progress.offsetWidth) * video.duration;
	if(isNaN(time) || time < 0 || time > video.duration) return;
	video.currentTime = time;
}

playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);
volume.addEventListener("change", () => { video.volume = volume.value; });
playbackRate.addEventListener("change", () => { 	video.playbackRate = playbackRate.value; });
progress.addEventListener("click", setTime);
progress.addEventListener("mousemove", event => event.buttons === 1 && setTime(event));
video.addEventListener("timeupdate", updateTime);

for(let btn of skipButtons){
	btn.addEventListener("click", () => {
		video.currentTime += Number(btn.dataset['skip'])
	})
}

updateTime();