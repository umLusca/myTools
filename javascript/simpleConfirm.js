function confirmar(title, description) {
	
	let _el = $(`<confirmar class='modal fade' tabindex='-1' aria-hidden='true'><div class='modal-dialog modal-dialog-centered' role='document'><div class='modal-content rounded-3 shadow'><div class='modal-body p-4 text-center'><h5 class='mb-0 title'>${title}</h5><p class='mb-0 desc'>${description}</p></div><div class='modal-footer flex-nowrap p-0'><button type='button' class='btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 cancel'>Cancelar</button><button type='button' class='btn btn-lg btn-link fs-6 text-decoration-none col-6 m-0 rounded-0 border-start confirm'><strong>Confirmar</strong></button></div></div></div></confirmar>`);
	
	return new Promise((resolve, reject) => {
		$("body").append(_el);
		
		_el.modal("toggle");
		
		_el.one('click', "button", function (e) {
			_el.modal("hide");
			
			if ($(e.target).hasClass("confirm")) {
				resolve(true);
			}
			
			if ($(e.currentTarget).hasClass(".cancel")) {
				resolve(false);
			}
			
			
		})
		
		_el.one('hidden.bs.modal', () => {
			_el.off().remove();
			resolve(false);
		})
	})
	
	
}
