$(function() {
  if($("#1").length > 0) {
    var ListView = Backbone.View.extend({
      el: '#hello-backbone',

      initialize: function() {
        this.render();
      },

      render: function() {
        $(this.el).append('<div class="alert alert-success">hello world</div>');
      }
    });

    var listView = new ListView;
  }
});


$(function() {
  if($('#2').length > 0) {
    var ListView =  Backbone.View.extend({
      el: "#hello-backbone",

      events: {
        "click #add": "addItem"
      },

      initialize: function() {
        this.count = 0;
      },

      addItem: function() {
        $('ul', this.el).append('<li><div class="alert alert-success">' + (++this.count) + '. hello world</div></li>');
      }
    });

    var listView = new ListView;
  }
});

$(function() {
  if($('#3').length > 0) {

    var Item = Backbone.Model.extend({
      defaults: function(){
        return {
          count: itemList.count()
        }
      }
    });

    var ItemList = Backbone.Collection.extend({
      model: Item,

      count: function() {
        if(!this.length) return 1;
        return this.last().get('count') + 1;
      }
    });

    var itemList = new ItemList;

    var ItemView = Backbone.View.extend({
      tagName: "li",
      template: _.template($('#item-template').html()),

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      }
    });

    var ListView =  Backbone.View.extend({
      el: "#hello-backbone",

      events: {
        "click #add": "addItem"
      },

      initialize: function() {
        this.listenTo(itemList, "add", this.appendItem);
      },

      addItem: function() {
        itemList.add({content: "hello world."});
      },

      appendItem: function(item) {
        var itemView = new ItemView({model: item});
        $('ul', this.el).append(itemView.render().el);
      }
    });

    var listView = new ListView;
  }
});


$(function() {
  if($('#4').length > 0) {

    var Item = Backbone.Model.extend({
      defaults: function(){
        return {
          count: itemList.count(), 
          done: false
        }
      }, 

      validate: function(attrs, options) {
        if(!attrs.content) {
          return "must be input content."
        }
      }
    });

    var ItemList = Backbone.Collection.extend({
      model: Item,

      count: function() {
        if(!this.length) return 1;
        return this.last().get('count') + 1;
      },

      done: function() {
        return this.where({done: true});
      },

      remaining: function() {
        return this.without.apply(this, this.done());
      }
    });

    var itemList = new ItemList;

    var ItemView = Backbone.View.extend({
      tagName: "li",
      template: _.template($('#item-template').html()),

      events: {
        'click .closeMe': "destroyItem",
        'click .toggleDone': "toggleDone"
      },

      initialize: function() {
        this.listenTo(this.model, "destroy", this.remove);
        this.listenTo(this.model, "change", this.render);
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        $(this.el).toggleClass('done', this.model.get('done'));
        this.$('.toggleDone').attr("checked", this.model.get('done'));
        return this;
      },

      destroyItem: function() {
        this.model.destroy();
      },

      toggleDone: function() {
        this.model.set("done", !this.model.get('done'));
      }
    });

    var ListView =  Backbone.View.extend({
      el: "#hello-backbone",

      events: {
        "click #add": "addItem"
      },

      initialize: function() {
        this.listenTo(itemList, "add", this.appendItem);
        this.listenTo(itemList, "all", this.render);

        this.leftStats = $('#left-stats');
        this.completeStats = $('#complete-stats');
        this.errorMsg = $('#errorMsg');

        this.render();
      },

      render: function() {
        if(itemList.length <= 0) {
          this.leftStats.hide();
          this.completeStats.hide();
        } else {
          this.leftStats.html(itemList.remaining().length + " items left").show();
          this.completeStats.html(itemList.done().length + " items complete").show();
        }

        this.errorMsg.hide();
      },

      addItem: function() {
        var content = $('#newContent').val();

        var item = new Item();
        item.on("invalid", this.showError, this);
        if(item.set({"content": content}, {validate: true})) {
          itemList.add(item);
        }

        $('#newContent').val('');
      },

      appendItem: function(item) {
        var itemView = new ItemView({model: item});
        $('ul', this.el).append(itemView.render().el);
      },

      showError: function(model, error) {
        this.errorMsg.html(error).show();
      }
    });

    var listView = new ListView;
  }
});