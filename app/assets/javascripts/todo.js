$(function() {
	var Todo = Backbone.Model.extend(function() {
		default: function() {
			return {
				title: "hello world",
				done: false
			};
		}
	});

	var TodoView = Backbone.View.extend(function() {

	});
});