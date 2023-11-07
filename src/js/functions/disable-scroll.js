import vars from "../_vars";

export const disableScroll = () => {
	const fixBlocks = document?.querySelectorAll(".fixed-block");
	const paddingOffset = `${window.innerWidth - vars.bodyEl.offsetWidth}px`;

	vars.htmlEl.style.scrollBehavior = "none";
	fixBlocks.forEach((el) => {
		el.style.paddingRight = paddingOffset;
	});
	vars.bodyEl.style.paddingRight = paddingOffset;
	vars.bodyEl.classList.add("dis-scroll");
};
