
function microSearchEngine(needle, haystack, insensitive = true) {
    let result = true;
    console.log("search", needle, haystack);
    if (needle.length && haystack.length) {
        if (typeof haystack == "object") {
            haystack.forEach(h => {
                h = h.toLowerCase();
                let u = false;
                if (result) {
                    if (typeof needle == "string") {
                        let n = needle.toLowerCase();
                        if (n.indexOf(h) !== -1 || u) {
                            u = true;
                        }
                    } else if (typeof needle == "object") {
                        needle.forEach((n) => {
                            n = n.toLowerCase();
                            if (n.indexOf(h) !== -1 || u) {
                                u = true;
                            }
                        })
                    }
                }
                result = u;
            })
            return result;
        }
        if (typeof haystack == "string") {
            let h = haystack.toLowerCase();
            if (typeof needle == "string") {
                let n = needle.toLowerCase();
                if (n.indexOf(h) !== -1) {
                    return true
                }
            } else if (typeof needle == "object") {
                needle.forEach((n) => {
                    n = n.toLowerCase();
                    if (n.indexOf(h) !== -1) {
                        return true
                    }
                })
            }
        }
    }

    return false;
}

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


//Faz todos os inputs de checkbox terem valor 0 automaticamente
$("input[type=checkbox]").each((i, e) => {
    if (!$(e).attr("value") || $(e).attr("value") === "1") {
        $(e).attr("value", 1).before($('<input/>').prop("disabled", $(e).is(":checked")).prop('type', 'hidden').prop('value', 0).prop('name', $(e).prop('name')))
    }
})
$(document).on("change", "input[type=checkbox]", (e) => {
    console.log(e);
    if ($(e.currentTarget).hasClass("disabled")) {
        $(e.currentTarget).prop("checked", !$(e.currentTarget).is(":checked"));
    }
    $("input[type=hidden][name='" + $(e.currentTarget).prop('name') + "']").attr('disabled', !!$(e.currentTarget).is(':checked'))
})
$("input[type=checkbox][disabled]").each((i, e) => {
    $(e).addClass("disabled").prop("disabled", false);
})
