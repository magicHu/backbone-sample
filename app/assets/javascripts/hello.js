$(function() {
	var ListView = Backbone.View.extend({
		el: $("body"),

		initialize: function() {
			this.render();
		},

		render: function() {
			$(this.el).append("<div style='color: red;'>hello world</div>");
		}
	});

	var list = new ListView;
});