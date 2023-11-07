import vars from "../_vars";

export const enableScroll = () => {
	const fixBlocks = document?.querySelectorAll(".fixed-block");
	const body = document.body;
	fixBlocks.forEach((el) => {
		el.style.paddingRight = "0px";
	});
	vars.bodyEl.style.paddingRight = "0px";
	vars.bodyEl.classList.remove("dis-scroll");
};
