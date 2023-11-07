import axios from "axios";

const loader = document.querySelector(".loader");
const loaderTitle = document.querySelector(".loader__title");
const loaderSpinner = document.querySelector(".loader__spinner");
const loaderButton = document.querySelector(".loader__button");

function hideLoader() {
	loader.classList.add("loader-hidden");
}

function showLoader() {
	loader.classList.remove("loader-hidden");
}

function showError(errorText) {
	loaderTitle.innerHTML = errorText;
	loaderSpinner.style.animationPlayState = "paused";
	loaderButton.classList.add("loader__button-visible");
}

loaderButton.addEventListener("click", () => {
	hideLoader();
});

if (document.querySelector(".hero")) {
	showLoader();
	Promise.all([
		axios.get("https://opti.ooo/cabinet/webhook/webhook_deals.php").catch((e) => {
			console.log(e);
			showError(e.message);
		}),
		axios.get("https://opti.ooo/cabinet/webhook/webhook_support.php").catch((e) => {
			console.log(e);
			showError(e.message);
		}),
	]).then(
		axios.spread((response1, response2) => {
			updateSumm(response1.data.summData);
			updateTime(response2.data.timeData);
			hideLoader();
		})
	);
}

function updateTime(timeData) {
	const workSpan = document.querySelector(".progress-bar__text-time-workH");
	const meetingSpan = document.querySelector(".progress-bar__text-time-meetH");
	workSpan.innerHTML = timeData.workTimeH;
	workSpan.setAttribute("data-current", timeData.workTimeH);
	meetingSpan.innerHTML = timeData.meetTimeH;
	meetingSpan.setAttribute("data-current", timeData.meetTimeH);
	calculateProgress();
}

function updateSumm(summData) {
	const valuePaid = document.querySelector(".hero__value-paid");
	const valueToBePaid = document.querySelector(".hero__value-toBePaid");
	const valueInWork = document.querySelector(".hero__value-inwork");
	valuePaid.innerHTML = summData.totalSum;
	valueToBePaid.innerHTML = summData.totalSumNeed;
	valueInWork.innerHTML = summData.needSum;
}

function calculateProgress() {
	const progressBars = document.querySelectorAll(".progress-bar");
	if (progressBars) {
		progressBars.forEach((bar) => {
			let track = bar.querySelector(".progress-bar__track");
			let currentCountEl = bar.parentNode.querySelector(".progress-bar__text-current");
			let currentCount = currentCountEl.getAttribute("data-current");
			if (currentCount == 0) {
				currentCountEl.classList.add("progress-bar__text-stat-bigger-red");
				track.classList.add("progress-bar__track-red");
			} else {
				currentCountEl.classList.remove("progress-bar__text-stat-bigger-red");
				track.classList.remove("progress-bar__track-red");
			}
			let allCount = bar.parentNode.querySelector(".progress-bar__text-all").getAttribute("data-all");
			let widthPersent = (currentCount / allCount) * 100;
			if (widthPersent !== 0) {
				track.style.width = widthPersent + "%";
			} else {
				track.style.width = "4px";
			}
		});
	} else {
		console.log("no progressbars");
	}
}
