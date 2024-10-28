
function refreshTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (!$("TooltipAppender").length) $("body").prepend($("<TooltipAppender>").css("position", "absolute").css("width", "100%").css("height", "100%"));
    tooltipList = [...tooltipTriggerList].map((e) => {
        if (bootstrap.Tooltip.getInstance(e)) {
            return bootstrap.Tooltip.getInstance(e);
        } else {

            return new bootstrap.Tooltip(e, {
                container: 'TooltipAppender'
            })
        }
    })

}