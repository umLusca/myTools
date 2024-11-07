$(() => {

    function checkCPF(e) {
        let t = 0, r;
        e = e.replace(/\D/g, '');
        if (e === "00000000000" || e.length !== 11) return !1;

        for (let r = 1; r <= 9; r++) t = t + parseInt(e.substring(r - 1, r)) * (11 - r);
        r = t * 10 % 11;
        if (r === 10 || r === 11) r = 0;
        if (r !== parseInt(e.substring(9, 10))) return !1;
        t = 0;
        for (let r = 1; r <= 10; r++) t = t + parseInt(e.substring(r - 1, r)) * (12 - r);
        r = t * 10 % 11;
        if (r === 10 || r === 11) r = 0;
        if (r !== parseInt(e.substring(10, 11))) return !1;
        return !0;
    }

    $(".inputReal").each((i, e) => {
        $(e).data("cleave", new Cleave(e, {
            prefix: 'R$',
            numeral: true,
            numeralPositiveOnly: true,
            numeralIntegerScale: 3,
            numeralDecimalScale: 2,
            delimiterLazyShow: true,
            numeralDecimalMark: ',',
            delimiter: '.'

        })).prop("inputmode", "numeric");
    })

    $(".inputTel").each((i, e) => {
        $(e).data("cleave", new Cleave(e, {
            phone: true,
            phoneRegionCode: 'BR',
        })).prop("inputmode", "numeric");
    })

    $(".inputCpf").each((i, e) => {
        if ($(e).attr("check")) {
            $(e).on("input", () => {
                let v = $(e).val(), r = checkCPF(v);
                $(e).toggleClass("is-valid", r);
                $(e).toggleClass("is-invalid", !r && v.length === 14);
                $(e)[0].setCustomValidity(r ? "" : "CPF Inválido");
            })
        }
        $(e).data("cleave", new Cleave(e, {
            numericOnly: true,
            delimiters: ['.', '.', '-'],
            blocks: [3, 3, 3, 2],
        })).prop("inputmode", "numeric");
    })

    $(".inputDate").each((i, e) => {
        $(e).data("cleave", new Cleave(e, {
            date: true,
            delimiter: '/',
            datePattern: ['d', 'm', 'Y'],
        })).prop("inputmode", "numeric");
    })

    $(".inputCep").each((i, e) => {

        $(e).data("cleave", new Cleave(e, {
            numericOnly: true,
            delimiter: '-',
            blocks: [5, 3],
            delimiterLazyShow: true,
        })).prop("inputmode", "numeric");
    })
})
