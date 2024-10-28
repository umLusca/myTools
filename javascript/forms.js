
$("form[ajax]").on("submit", (e) => {

    e.preventDefault();
    e.stopPropagation();
    $(e.target).addClass("was-validated");
    if (!window.sendingPost && e.target.checkValidity()) {
        window.sendingPost = true;
        let $this = e.currentTarget;
        let data = $($this).getFormObject();
        for (const [key, value] of Object.entries($($this).data())) {
            if (value && typeof value === 'string' && value.indexOf('$carrinho') > -1) {
                let [, token] = value.split(".");
                data["token"] = token

                data[key] = localStorage.getItem("carrinho");
            } else {
                data[key] = value;
            }
        }
        if (data["disabled"]){
            return;
        }

        //Crie um div com display none no formulário, ele vai ter o retorno
        $(".return").slideUp().text("").removeClass("alert-danger alert-info alert-success");

        //por padrão é o do formulário.
        data["query"] = $($this).attr("action");
        if (e.originalEvent) {

            //Ele poderá ser substituido pelo o do botão, caso exista.
            let buttonAction = $(e.originalEvent.submitter).attr("formaction");
            if (typeof buttonAction === "string" && buttonAction.length >= 2) {
                data["query"] = buttonAction;
            }
        }
        $($this).find(".return").addClass("alert-info").removeClass("alert-danger").text("Aguarde...").slideDown();

        let ajax = () => {
            $.ajax({
                method: "POST",
                url: "https://api.cur.tf" + data["query"],
                data: data,
                dataType: "json",
                success: (d) => {
                    if (data.callback) {
                        if (window[data.callback]) window[data.callback](d)
                    }
                    if (d.status) {
                        $($this).find(".return").addClass("alert-success").removeClass("alert-danger alert-info");
                        if (data.refresh || d.refresh) {
                            setTimeout(
                                () => {
                                    window.location.reload()
                                }, 500);
                        }
                        if (data.redirect || data.redirect === "") {
                            let redi = "";
                            if (d.redirect) {
                                redi = d.redirect;
                            }
                            window.location.href = data.redirect + redi;
                        }
                    } else {
                        $($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info");

                    }
                    $($this).find(".return").html(d.msg).slideDown()
                },
                error: (err) => {
                    if (err.responseJSON && err.responseJSON.msg) {
                        $($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info").text(err.responseJSON.msg).slideDown();
                    } else {
                        $($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info").text(err.status + " | Houve um erro ao comunicar com o servidor...").slideDown();
                    }
                },

                complete: () => {
                    window.sendingPost = false;
                }

            });
        }
        ajax();


    }


})
    .on("hidden.bs.modal", (e) => {
        $(e.currentTarget).trigger("reset").removeClass("was-validated").find(".return").hide();
    })
    .on("keydown", (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevenir o envio padrão

            $(e.currentTarget).trigger("submit");
        }
    })
