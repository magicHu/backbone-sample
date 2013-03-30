$(function() {
	var Todo = Backbone.Model.extend({
		
	});

	var TodoList = Backbone.Collection.extend({
		model: Todo,

		addOne: function(todo) {
			this.add(todo);
		}
	});

	var Todos = new TodoList;

	var TodoView = Backbone.View.extend({
		tagName: "li",
		template: _.template($("#todo-template").html()),

		events: {
			"click .close": "removeTodo"
		},

		initialize: function() {
			this.render();
		},

		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		removeTodo: function() {
			Todos.remove(this.model);
		}

	});

	var AppView = Backbone.View.extend({

		el: $('#todoapp'),

		initialize: function(){
        this.listenTo(Todos, "add", this.addOne);
        this.todolist = $('#todos');
        this.input = $('#new-todo');
    },

		events: {
			"keypress #new-todo": "createOnEnter",
			"click todo.close": "removeTodo"
		},

		createOnEnter: function() {
			if(event.keyCode != 13) return;
			var text = $('#new-todo').val();
			Todos.add({title: text, done: false});
		}, 

		addOne: function(todo) {
			var todoView = new TodoView({model: todo})
			this.todolist.append(todoView.render().el);
			this.input.val("");
		},

		removeTodo: function() {
			
		}
	});

	var appView = new AppView;
});