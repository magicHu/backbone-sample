class Todo < ActiveRecord::Base
  attr_accessible :done, :order, :title
end
