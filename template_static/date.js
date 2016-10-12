(function($, block) {
block.fn.date = function(config) {
    this.$element.append('<p>');

    this.actions(function(e, message){
        $p = $('p', this);
        $p.html('<b>Current date: ' + message.date.substr(-2) + '-' + message.date.substr(-4, 2) + '-' + message.date.substr(0, 4) + '</b>');
    });

    return this.$element;
};
})(jQuery, block);
