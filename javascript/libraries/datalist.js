/**
 * Created by: https://github.com/umLusca/
 * DataList v1
 *
 * how to use
 * add atribute datalist to an input or select tag to autoinitialize
 * or use new DataList(inputElementJquery, datalistElementJquery, options)
 * todo better doc lol
 *
 */

class DataList {
    _inputEl;
    _isSelectElement = false;
    _listEl;
    _placeholderEl;
    _wrapperEl;
    _containerEl;
    _validity = false;
    _hoverOption = -1;
    _haveSelection = false;
    _isListVisible = false;
    _selectedAlts = [];
    _resultFounds = [];
    _isMultiple = false;


    options = {
        strict: false,
        required: false,
        multiple: false, //by default // cant change after constructor!
        placeholder: undefined,
        list: undefined,
        listRows: -1, // -1 to infinite
    };
    alternatives = [];

    _searchEngine(needle, haystack) {
        let result = true;
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

        return false;
    }


    _selectList(key = 0) {
        this._hoverOption += key;
        if (this._hoverOption < 0) {
            this._hoverOption = Math.min(this._resultFounds.length, this.options.listRows) - 1;
        }
        if (this._hoverOption > Math.min(this._resultFounds.length, this.options.listRows) - 1) {
            this._hoverOption = 0;
        }
        this._listEl.find("option").removeClass("selected").eq(this._hoverOption).addClass("selected");

    }

    _setValidity(bool = undefined) {
        if (typeof bool == "boolean") {
            this._validity = bool;
        }
        if (this._validity === true && !this.options.strict) {
            this.placeholderEl[0].setCustomValidity('');
        } else {
            this.placeholderEl[0].setCustomValidity('Selecione uma opção valida.');
        }
        if (this.options.required || (this.options.strict && this.placeholderEl.val().length > 0)) {
            this._wrapperEl.toggleClass("is-invalid", !this._validity);
        }
        this._wrapperEl.toggleClass("is-valid", this._validity);
    }

    setOptions(options, value) {
        if (typeof options === "object") {
            $(Object.keys(options)).each((i, e) => {
                this.options[e] = options[e];
            });
            return true;
        } else if (typeof options === "string") {
            if (typeof value !== "undefined" && value.length > 0) {
                this.options[options] = value;
                return true
            }
        }
        return false;
    }


    constructor(input, options = {}) {
        this.setOptions(options);
        this._inputEl = input;

        this._isMultiple = this.options.multiple;

        //cria container
        this._containerEl = $("<datalist-container>").insertBefore(this._inputEl).append(this._inputEl);
        //Cria placeholder
        if (input.prop("tagName").toLowerCase() === "select") {
            let toinput = input.clone().html("").replaceWithTag("input", true);
            this.placeholderEl = toinput.removeAttr('id').removeAttr('name').removeAttr("list").removeAttr("datalist").removeClass().insertAfter(this._inputEl);
        } else {
            this.placeholderEl = $(this._inputEl).clone().removeAttr('id').removeAttr('name').removeAttr("list").removeAttr("datalist").removeClass().insertAfter(this._inputEl);
        }

        this.placeholderEl.prop("placeholder", "Selecione um").addClass("datalist-input");

        //esconde input original
        this._inputEl.hide();

        //Cria wrapper
        this._wrapperEl = $("<datalist-wrapper>").addClass("form-control").insertAfter(this._inputEl).append(this.placeholderEl);


        let optionsArray = [];
        if (options.list) {
            this._listEl = options.list;
        } else if (input.prop("tagName").toLowerCase() === "select") {
            let options = input.find("option");

            if (options.length) {
                this._listEl = $("<datalist-options>").append(options.clone()).insertAfter(this._wrapperEl);
                this._isSelectElement = true;
            } else {
                console.error ("DataList - select with no option?");
                return;

            }
        } else {

            let inputlist = this._inputEl.prop("list");
            if (inputlist) {
                this._listEl = $("<datalist-options>").append($(inputlist).find("option").clone()).insertAfter(this._wrapperEl);

            } else {
                console.error ("DataList - No list tag detected on input");
                return;
            }
        }
        

        this._listEl.find("option").each((k, o) => {
            let alts = [];
            if ($(o).data('dl-alts')) {
                alts = $(o).data('dl-alts').split(';'); //Pega variações
            }

            let val = $(o).attr("value") ? $(o).attr("value") : $(o).text()
            this.alternatives.push({
                key: k,
                selected: false,
                disabled: $(o).prop("disabled"),
                label: $(o).html(),
                value: val,
                alternatives: alts,
            });
            if ($(o).is(":selected")){
                this.selectAlternative(k)
            }

        })


        this._wrapperEl.on("click", "datalist-remove", (ev) => {
            this.alternatives[$(ev.currentTarget).parent().data("key")].selected = false;
            let value = this._inputEl.val();
            let ind = $.inArray(this.alternatives[$(ev.currentTarget).parent().data("key")].value, value);
            if (ind !== -1) {
                value.splice(ind, 1);
                this._inputEl.val(value);
            }
            $(ev.currentTarget).parent().remove()
            this.placeholderEl.trigger("keyup");

        })

        let forms = this.placeholderEl.parents("form");
        forms.on("keydown","input.datalist-input",(e)=>{
            switch ( e.which) {
                default: break;
                case 13:
                    e.stopPropagation();
                    e.preventDefault();
                    break;
            }
        })


        $(this.placeholderEl).on("keydown", (event) => {
            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    break;
                case "Backspace":
                    let lastselected = this._wrapperEl.find("datalist-selected").eq(-1);
                    if (lastselected.length && this.placeholderEl.val().length === 0) {
                        this.placeholderEl.val(this.alternatives[lastselected.data("key")].label);
                        lastselected.find("datalist-remove").trigger("click");
                        event.preventDefault();
                    }
                    break;
                case "Enter":
                    break;
            }
        })

        $(this.placeholderEl).on("keyup", (event) => {
            switch (event.key) {

                default:
                    if (this.search(this.placeholderEl.val())) {
                        this.showList();
                    } else {
                        this.hideList();
                    }
                    break;
                case "Escape":
                    this.focusOut();
                    break;
                case "Enter":
                    this.selectAlternative(true);

                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this._selectList(1);
                    break;
                case "ArrowUp":
                    event.preventDefault();
                    this._selectList(-1);
                    break;
            }
        })
        this._wrapperEl.on("mousedown", (ev) => {
            if (this.placeholderEl.is(":focus")) {
                ev.preventDefault();
            } else {
            }
        }).on("mouseup", (ev) => {
            if (!this.placeholderEl.is(":focus")) {
                this.placeholderEl.focus();
            }
        })


        $(this.placeholderEl).on("focus", (event) => {
            this.focusIn();
        })

        $(this.placeholderEl).on("focusout", () => {
            this.focusOut();
        })
        $(this._listEl).on("click", "option", (event) => {
            this.selectAlternative($(event.currentTarget).data("key"));
        })

    }

    search(search) {
        let founds = [];

        this._hoverOption = -1;
        if (!this._isMultiple) {
            this._inputEl.val("");

            this._setValidity(false);
        }

        let searchSanitized = search.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        let searchSanitizedWords = searchSanitized.split(/\s+/);
        this.alternatives.forEach(option => {
            if (!option.disabled && !option.selected) {
                let found = false;
                let optionSanitizedWords = option.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\s+/);
                if (this._searchEngine(optionSanitizedWords, searchSanitizedWords)) {
                    found = true;
                } else {
                    option.alternatives.forEach((alt) => { // Pesquisa usando nome de variaÃ§Ã£o

                        if (!found) {
                            let altSanitizedWords = alt.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().split(/\s+/);
                            if (this._searchEngine(altSanitizedWords, searchSanitizedWords)) {
                                found = true;
                            }
                        }
                    })
                }
                if (found) {
                    founds.push(option)
                }
            }
        })
        this._resultFounds = founds;

        if (this._resultFounds.length) {
            this._resultFounds.sort((a, b) => {
                return a.matches - b.matches;
            })
            return true;
        } else {
            return false;
        }
    }

    selectAlternative(option = false) {
        this._validity = false;
        this._haveSelection = false;


        if (typeof option === "number") {

            if (this._isMultiple) {
                this._validity = true;
                this._haveSelection = true;
                this.alternatives[option].selected = true;
                if (this.alternatives[option].disabled === false) {
                    this._wrapperEl.prepend($("<datalist-selected>").data("key", option).addClass("badge bg-primary").text(this.alternatives[option].label).append($("<datalist-remove>")));
                    let value = this._inputEl.val()
                    value.push(this.alternatives[option].value);
                    this._inputEl.val(value);
                }

            } else {

                this._inputEl.val(this.alternatives[option].value);
                this.placeholderEl.val(this.alternatives[option].label);
                this._validity = true;
                this._haveSelection = true;
            }

        } else if (typeof option === "boolean" && option && this._resultFounds.length) {
            if (this._hoverOption < 0) {
                this._hoverOption = 0
            }
            if (this._hoverOption > this._resultFounds.length - 1) {
                this._hoverOption = this._resultFounds.length - 1;
            }

            const alternative = this._resultFounds[this._hoverOption];
            if (alternative) {
                this.selectAlternative(alternative.key);
                if (this._isMultiple) {

                    this.placeholderEl.val("");
                } else {

                    this.placeholderEl.val(alternative.label);
                }
                this._validity = true;
                this._haveSelection = true;

                this.placeholderEl.trigger("keyup");

            }

        }

        this._setValidity();

    }

    showList() {
        let html = "";
        let perfectMatch = false;
        let searchSanitized = this.placeholderEl.val().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();


        for (let e of this._resultFounds) {
            if (e.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === searchSanitized) {
                perfectMatch = e.key;
                break;
            }
        }

        if (!this._isMultiple) {
            this.selectAlternative(perfectMatch);
        }

        if ((perfectMatch && this._resultFounds.length >= 2) || perfectMatch === false || this._isMultiple) {
            let rows;
            if (this.options.listRows >= 0){
                rows = Math.min(this._resultFounds.length, this.options.listRows);
            } else {
                 rows = this._resultFounds.length;
            }
            console.log("row",rows)
            for (let i = 0; i < rows; i++) {
                html += `<option data-key="${this._resultFounds[i].key}">${this._resultFounds[i].label}</option>`;
            }

            this._listEl.html(html);
            if (!this._isListVisible && this.placeholderEl.is(":focus")) {
                this._listEl.slideDown(200);
                this._isListVisible = true;
            }
        } else {

            this.hideList();
        }
    }

    hideList() {
        if (this._isListVisible) {
            this._isListVisible = false;
            this._listEl.slideUp(200);
        }
    }

    isValid() {

        return this._validity;
    }

    focusIn() {

        this.placeholderEl.trigger('keyup');
    }

    focusOut() {
        let these = this;
        setTimeout(function () {
            these.hideList();
        }, 100);
    }

}

$.fn.replaceWithTag = function (tagName) {
    var result = [];
    this.each(function () {
        var newElem = $('<' + tagName + '>').get(0);
        for (var i = 0; i < this.attributes.length; i++) {
            newElem.setAttribute(
                this.attributes[i].name, this.attributes[i].value
            );
        }
        newElem = $(this).wrapInner(newElem).children(0).unwrap().get(0);
        result.push(newElem);
    });
    return $(result);
};

$("input[datalist], select[datalist]").each((i, e) => {
    $(e).data("dataList", new DataList($(e), {
        strict: $(e).attr("datalist"),
        required: !!$(e).prop("required"),
        multiple: !!$(e).prop("multiple"),
    }));
})
