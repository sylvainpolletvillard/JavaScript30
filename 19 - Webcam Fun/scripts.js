const video  = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx    = canvas.getContext('2d');
const strip  = document.querySelector('.strip');
const snap   = document.querySelector('.snap');

(function getVideo() {
	navigator.mediaDevices.getUserMedia({video: true, audio: false})
		.then(localMediaStream => {
			video.src = URL.createObjectURL(localMediaStream);
			video.play();
			video.addEventListener("canplay", initCanvas);
		}).catch(error => {
			console.error(`Oh no, error: ${error}`)
		});
})();

function initCanvas() {
	const { videoWidth, videoHeight } = video;
	canvas.width = videoWidth;
	canvas.height = videoHeight;
	requestAnimationFrame(renderCanvas);
}

function renderCanvas() {
	ctx.drawImage(video, 0,  0, canvas.width, canvas.height);
	let pixels = ctx.getImageData(0,0, canvas.width, canvas.height);
	pixels = thresholdColors(pixels);
	ctx.putImageData(pixels, 0, 0);
	requestAnimationFrame(renderCanvas);
}

function takePhoto(){
	snap.cloneNode(true).play();
	const data = canvas.toDataURL("image/jpeg");
	const link = document.createElement("a");
	link.href = data;
	link.setAttribute("download", "snapshot");
	link.innerHTML = `<img src="${data}">`;
	strip.insertBefore(link, strip.firstChild);
}

function thresholdColors(pixels) {
	const [rmin, rmax, gmin, gmax, bmin, bmax] = ["rmin", "rmax", "gmin","gmax","bmin","bmax"]
		.map(id => document.getElementById(id).value);

	for(let i=0; i<pixels.data.length; i+=4){
		let [r,g,b] = pixels.data.slice(i, i+3);
		if(r < gmin || r > rmax
		|| g < gmin || g > gmax
		|| b < bmin || b > bmax)
			pixels.data[i+3] = 0; // remove alpha to hide pixel
	}

	return pixels;
}