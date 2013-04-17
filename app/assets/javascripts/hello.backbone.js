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

      events: {
        'click .closeMe': "destroyItem"
      },

      initialize: function() {
        this.listenTo(this.model, "destroy", this.remove);
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
      },

      destroyItem: function() {
        this.model.destroy();
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
        var content = $('#newContent').val();
        itemList.add({content: content});

        $('#newContent').val('');
      },

      appendItem: function(item) {
        var itemView = new ItemView({model: item});
        $('ul', this.el).append(itemView.render().el);
      }
    });

    var listView = new ListView;
  }
});