$(()=>{

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
