export function makeHovers() {
	const ids = document.querySelectorAll(".deals__col-id");
	const dates = document.querySelectorAll(".deals__col-date");
	const companies = document.querySelectorAll(".deals__col-company");
	const deals = document.querySelectorAll(".deals__col-deal");
	const summs = document.querySelectorAll(".deals__col-summ");
	const cashbacks = document.querySelectorAll(".deals__col-cashback");

	const cols = [ids, dates, companies, deals, summs, cashbacks];

	for (let i = 0; i < cols.length; i++) {
		cols[i].forEach((hoverElement) => {
			hoverElement.onmouseenter = () => {
				cols[i].forEach((el) => {
					el.classList.add("deals__cell-hovered");
				});
				if (cols[i - 1]) {
					cols[i - 1][0].classList.add("deals__cell-header-hide-after");
				}
				if (cols[i]) {
					cols[i][0].classList.add("deals__cell-header-hide-after");
				}
			};
			hoverElement.onmouseleave = () => {
				cols[i].forEach((el) => {
					el.classList.remove("deals__cell-hovered");
				});
				if (cols[i - 1]) {
					cols[i - 1][0].classList.remove("deals__cell-header-hide-after");
				}
				if (cols[i]) {
					cols[i][0].classList.remove("deals__cell-header-hide-after");
				}
			};
		});
	}
}
