$.fn.getFormObject = function ()  {
	return $(this).serializeArray().reduce(function (obj, item) {
		const name = item.name.replace("[]", "");
		if (typeof obj[name] !== "undefined") {
			if (!Array.isArray(obj[name])) {
				obj[name] = [obj[name], item.value];
			} else {
				obj[name].push(item.value);
			}
		} else {
			obj[name] = item.value;
		}
		return obj;
	}, {});
}


$.ajaxSetup({
	method: 'post',
	dataType: "json",
	async: true,
	cache: false,
	complete: (d) => {
		if (d && d.status) {
			if (d.responseJSON && d.responseJSON.msg) {
				if (d.responseJSON.callback) {
					window[d.responseJSON.callback](d.responseJSON);
				}
				if (d.responseJSON.redirect) {
					window.location.href = d.responseJSON.redirect;
				}
				if (d.responseJSON.refresh) {
					window.location.reload();
				}
			}
		}
	}
})


$("form[ajax]").on("submit", (e) => {
	e.preventDefault();
	e.stopPropagation();
	
	if ($(e.target).is("[novalidate]") === true)
		$(e.target).addClass("was-validated");
	
	if (!window.sendingPost && e.target.checkValidity()) {
		window.sendingPost = true;
		let $this = e.currentTarget;
		//Crie um div com display none no formulário, ele vai ter o retorno
		
		$(e.target).find(".return").slideUp().text("").removeClass("alert-danger alert-info alert-success");
		
		let data = $($this).getFormObject();
		
		//por padrão é o do formulário.
		let action = $($this).attr("action");
		
		if (e.originalEvent) {
			//Ele poderá ser substituido pelo o do botão, caso exista.
			let buttonAction = $(e.originalEvent.submitter).attr("formaction");
			if (typeof buttonAction === "string" && buttonAction.length >= 2) {
				action = buttonAction;
			}
		}
		$($this).find(".return").addClass("alert-info").removeClass("alert-danger").text("Aguarde...").slideDown();
		
		let method = $($this).attr("method");
		let url = "";
		if (window.apiCall) url = window.apiCall;
		$.ajax({
			method: method,
			url: url + action,
			data: data,
			dataType: "json",
		})
			.done((d) => {
				if (d.callback || data.callback) {
					if (window[d.callback || data.callback]) window[d.callback || data.callback](d)
				}
				//Prioridade Servidor!
				if (data.refresh || d.refresh) {
					setTimeout(
						() => {
							window.location.reload()
						}, 500);
				}
				if (data.redirect || d.redirect) {
					window.location.href = d.redirect || data.redirect;
				}
				
				if (d.status) {
					$($this).find(".return").addClass("alert-success").removeClass("alert-danger alert-info");
				} else {
					$($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info");
				}
				$($this).find(".return").html(d.msg).slideDown()
			})
			.fail((err) => {
				if (err.responseJSON && err.responseJSON.msg) {
					$($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info").text(err.responseJSON.msg).slideDown();
				} else {
					$($this).find(".return").addClass("alert-danger").removeClass("alert-success alert-info").text(err.status + " | Houve um erro ao comunicar com o servidor...").slideDown();
				}
			})
			.always(() => {
				window.sendingPost = false;
			});
		
		
	}
	
	
}).on("hidden.bs.modal", (e) => {
	$(e.currentTarget).trigger("reset").removeClass("was-validated").find(".return").hide();
}).on("keydown", (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();  // Prevenir o envio padrão
		
		$(e.currentTarget).trigger("submit");
	}
})