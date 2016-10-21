/**
 * Date shows the current date
 */
(function($, block) {
  block.fn.date = function(config) {
    // set date cache variable
    var date = 0;
    this.$element.append('<b>');
    this.actions(function(e, message){
      // only update date if message.date != date (cache)
      if (message.date != date ) {
        // set new cache date
        date = message.date;
        // make date html element
        $p = $('b', this);
        $p.html('Current date: ' + message.date.substr(-2) + '-' + message.date.substr(-4, 2) + '-' + message.date.substr(0, 4) + '');
      }
    });

    return this.$element;
  };
})(jQuery, block);
