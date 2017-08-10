var $ = require('jquery');

$(document).ready(function() {
	var search = $('#search');
	var button = search.siblings('button');
	var instance = $('#imageTree');
	
	button.on('click', function() {
		var text = search.val();
			
		$.post("http://localhost:3000/api/tree/search", { node : text })
			.done(function(data) {
				console.log(instance.jstree());
				// instance.jstree(true).settings.core.data = data;
				// .jstree(true).refresh();
			});
	});
});