(function($, block) {
block.fn.counter = function(config) {
    this.$element.append('<p>');
    
    this.actions(function(e, message){
        $p = $('p', this);
        $p.html('<b>Tweets today: ' + message.count.day + ' - Total tweets since start: ' + message.count.total + '</b>');
    });

    return this.$element;
};
})(jQuery, block);
