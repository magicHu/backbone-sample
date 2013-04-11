$(function() {

  var Todo = Backbone.Model.extend({
    defaults: function() {
      return {
        title: "empty todo...", 
        order: Todos.nextOrder(),
        done: false
      };
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }
  });

  var TodoList = Backbone.Collection.extend({
    model: Todo, 

    //localStorage: new Backbone.LocalStorage("todos-backbone"),
    url: '/todos',


    done: function() {
      return this.where({done: true});
    },

    remaining: function() {
      return this.without.apply(this, this.done());
    },

    nextOrder: function() {
      if(!this.length) return 1;
      return this.last().get('order') + 1;
    },

    comparator: "order"
  });

  var Todos = new TodoList;

  var TodoView = Backbone.View.extend({
    tagName: "li",
    
    template: _.template($("#item-template").html()),

    events: {
      "click .toggle": "toggleDone", 
      "dbclick .view": "edit", 
      "click a.destroy": "clear", 
      "keypress .edit": "updateOnEnter", 
      "blur .edit": "close"
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    toggleDone: function() {
      this.model.toggle();
    },

    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    }, 

    clear: function() {
      this.model.destroy();
    },

    updateOnEnter: function(e) {
      if(e.keypress == 13) this.close();
    },

    close: function() {
      var title = this.input.val();
      if (!title) {
        this.clear();
      } else {
        this.model.save({title: title});
        this.$el.removeClass('editing');
      }
    }

  });

  var AppView = Backbone.View.extend({
    el: $("#todoapp"),

    stasTemplate: _.template($('#stats-template').html()),

    events: {
      "keypress #new-todo": "createOnEnter",
      "click #clear-completed": "clearCompleted", 
      "click #toggle-all": "toggleAllComplate", 
    },

    initialize: function() {
      this.input = $('#new-todo');
      this.todoList = $('#todo-list');
      this.allCheckbox = this.$("#toggle-all");

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
    },

    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.stasTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

      this.allCheckbox.checked = !remaining;
    },

    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
    }, 

    addOne: function(todo) {
      var todoView = new TodoView({model: todo});
      this.$("#todo-list").append(todoView.render().el);
    }, 

    addAll: function() {
      Todos.each(this.addOne, this);
    },

    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      return false;
    }, 

    toggleAllComplate: function() {
      var done = this.allCheckbox.checked;
      Todos.each(function(todo) {
        todo.save({'done': done});
      });
    }
  });

  var appView = new AppView;
});