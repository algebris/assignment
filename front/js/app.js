$(document).ready(function() {

	var search = $('#search');
	var button = search.siblings('button');
	var inst = '#imageTree';

	function init() {
		$(inst).jstree({
			plugins : ["themes","json_data", "search", "types"],
			core: {
				data: {
					type: 'POST',
					url: 'http://localhost:3000/api/tree/node',
					data: function(node) {
						return { node: this.get_path(node, ' > ') };
					},
					dataType: "json"
				}
			},
			types: {
				folder: {
					icon: "fa fa-folder-o"
				},
				'folder-open': {
					icon: "fa fa-folder-open-o"
				},
				leaf: {
					icon: "fa fa-file"	
				},
				root: {
					icon: "fa fa-sitemap"
				}
			}
		});
	}

	function createSearchEvent(el) {
		el.on('refresh.jstree', function(evt) {
			var text = search.val();
			if(text) {
				el.jstree('search', text);
			}
		});
		el.on('open_node.jstree', function (event, data) {
		    data.instance.set_type(data.node,'folder-open');
		});

		el.on('after_close.jstree', function (event, data) {
		    data.instance.set_type(data.node,'folder');
		});
	}
	
	button.on('click', function(evt) {
		var text = search.val().trim();
		if(evt.target.id === "find" && text.length >0) {
			find(text);
		} 
		if(evt.target.id === 'clear') {
			search.val('')
			$(inst).jstree("destroy");
			createSearchEvent($(inst));
			init();
		}
	});

	function find(text) {
		$.post("http://localhost:3000/api/tree/search", { node : text })
			.done(function(data) {
				if(data.length !== 0) {
					$(inst).jstree(true).settings.core.data = data;
					$(inst).jstree(true).refresh();						
				}
			});
	}

	init();
	createSearchEvent($(inst));
});