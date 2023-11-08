import axios from "axios";
import Swiper, { Navigation, Pagination, Thumbs } from "swiper";
Swiper.use([Navigation, Pagination, Thumbs]);

let sliderData = [];
let slider = null;

let activeTypeButton = document.querySelector(".hero__type-active");
const typeButtons = document.querySelectorAll(".hero__type");
typeButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		activeTypeButton.classList.remove("hero__type-active");
		btn.classList.add("hero__type-active");
		activeTypeButton = btn;
		axios
			.get(`http://localhost:3000/methchivDataNew?type=${activeTypeButton.innerHTML}`)
			.then((r) => {
				sliderData = r.data;
				makeSlider({ updateSlides: true });
			})
			.catch((e) => {
				console.log(e);
			});
	});
});

const heroTableHeader = `
	<div class="hero__header">
		<div class="hero__row">
			<div class="hero__cell hero__cell-header hero__col-id">ID</div>
			<div class="hero__cell hero__cell-header hero__col-date">Дата</div>
			<div class="hero__cell hero__cell-header hero__col-stage">Стадия заказа</div>
			<div class="hero__cell hero__cell-header hero__col-dispatchDate">Планируемая дата отгрузки</div>
			<div class="hero__cell hero__cell-header hero__col-order">Заказ</div>
			<div class="hero__cell hero__cell-header hero__col-nomenclature">Номенклатура</div>
			<div class="hero__cell hero__cell-header hero__col-summ">Сумма</div>
			<div class="hero__cell hero__cell-header hero__col-button"></div>
		</div>
	</div>
`;

// верстка внутреннего элемента списка
const heroItemInner = `
	<div class="hero__cell hero__col-id"></div>
	<div class="hero__cell hero__col-date"></div>
	<div class="hero__cell hero__col-stage"></div>
	<div class="hero__cell hero__col-dispatchDate"></div>
	<div class="hero__cell hero__col-order"></div>
	<div class="hero__cell hero__col-nomenclature"></div>
	<div class="hero__cell hero__col-summ"><span></span></div>
	<div class="hero__cell hero__col-button">
		<button class="btn-reset hero__button-table">Заказать акт</button>
	</div>
`;

if (document.querySelector(".hero")) {
	axios
		.get(`http://localhost:3000/methchivData?type=${activeTypeButton.innerHTML}`)
		.then((r) => {
			sliderData = r.data;
			makeSlider();
		})
		.catch((e) => {
			console.log(e);
		});
}

function makeSlider(params = {}) {
	if (params.updateSlides == true) {
		slider.wrapperEl.innerHTML = "";
	}

	const sliderWrapper = document.querySelector(`.hero__wrapper`);
	const formattedData = [];

	// получаем гет параметр
	const urlParams = new URLSearchParams(window.location.search);
	let chunkSize = 8;
	if (urlParams.get("chunkSize") !== null) {
		chunkSize = +urlParams.get("chunkSize");
	}

	const select = document.querySelector(".hero__select");
	let selectOptions = [5, 8, 10, 15];
	if (!selectOptions.includes(chunkSize)) {
		selectOptions.push(chunkSize);
		selectOptions.sort((a, b) => a - b);
	}
	[...new Set(selectOptions)].forEach((option) => {
		let optionEl = document.createElement("option");
		optionEl.setAttribute("value", option);
		optionEl.innerHTML = option;
		select.appendChild(optionEl);
	});
	select.value = chunkSize;

	for (let i = 0; i < sliderData.length; i += chunkSize) {
		const chunk = sliderData.slice(i, i + chunkSize);
		formattedData.push(chunk);
	}

	formattedData.forEach((array) => {
		// создаем новый слайд
		let heroSlide = document.createElement("div");
		heroSlide.innerHTML = heroTableHeader;
		heroSlide.classList = `swiper-slide hero__slide`;
		array.forEach((row) => {
			// создем новый айтем
			let heroItem = document.createElement("div");
			heroItem.classList = "hero__row";
			heroItem.innerHTML = heroItemInner;

			// изменяем контент внутри
			heroItem.setAttribute("id", row.id);
			heroItem.querySelector(".hero__col-id").innerHTML = row.id;
			heroItem.querySelector(".hero__col-date").innerHTML = row.date;
			heroItem.querySelector(".hero__col-stage").innerHTML = row.stage;
			heroItem.querySelector(".hero__col-dispatchDate").innerHTML = row.dispatchDate;
			heroItem.querySelector(".hero__col-order").innerHTML = row.order;
			heroItem.querySelector(".hero__col-nomenclature").innerHTML = row.nomenclature;
			heroItem.querySelector(".hero__col-summ span").innerHTML = formatNumber(row.summ) + " ₽";

			// засовываем в лист
			heroSlide.appendChild(heroItem);
		});
		sliderWrapper.appendChild(heroSlide);
	});

	const sliderBullets = new Swiper(document.querySelector(`.hero__container-slider-bullets`), {
		slidesPerView: 3,
		speed: 500,
		spaceBetween: 0,
	});

	slider = new Swiper(document.querySelector(`.hero__slider`), {
		slidesPerView: 1,
		spaceBetween: 30,
		speed: 500,
		pagination: {
			el: ".hero__pagination",
			clickable: true,
			bulletActiveClass: "hero__bullet-active",
			renderBullet: function (index, className) {
				return `<span class="swiper-slide hero__bullet ${className}">${index + 1}</span>`;
			},
		},
		navigation: {
			nextEl: ".hero__button-next",
			prevEl: ".hero__button-prev",
		},
		thumbs: {
			swiper: sliderBullets,
		},
	});

	// общее количество
	const allCountSpan = document.querySelector(".hero__text-all-value");
	allCountSpan.innerHTML = sliderData.length;

	// 1 page span
	const textContainer = document.querySelector(".hero__text-page");
	const onePageSpan = document.querySelector(".hero__text-page-1");
	const footerButtons = document.querySelectorAll(".hero__button-control");
	if (formattedData.length == 1) {
		footerButtons.forEach((btn) => {
			btn.style.display = "none";
		});
		onePageSpan.style.marginRight = "0";
		onePageSpan.classList.remove("hero__text-page-hidden");
		textContainer.style.marginRight = "0";
	}

	// проверка на наличие последнего ряда без нижней границы
	// let lastSlide = formattedData[formattedData.length - 1];
	// if (lastSlide.length !== chunkSize) {
	// 	let lastRowNode = document.getElementById(lastSlide[lastSlide.length - 1].id);
	// 	if (lastRowNode) {
	// 		lastRowNode.style.boxShadow = "0 -1px 0 var(--border-color), 0 1px 0 var(--border-color)";
	// 	}
	// }

	// обработчик кнопки "последняя"
	const lastButton = document.querySelector(".hero__button-last");
	lastButton.addEventListener("click", () => {
		slider.slideTo(formattedData.length - 1, 1000);
	});
}

function formatNumber(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
