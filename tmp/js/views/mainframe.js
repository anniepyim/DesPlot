var templates = require('./templates');

module.exports = Backbone.View.extend({
    
    DesPlot: templates.DesPlot,
    
    renderDesPlot: function(id){
        this.$el.append(this.DesPlot());
        return this;
    }
    
});
