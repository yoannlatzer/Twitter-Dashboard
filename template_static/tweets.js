(function($, block) {
block.fn.tweets = function(config) {
    var counter = 0;
    this.$element.addClass('tweets').append('<div>');
    
    this.actions(function(e, message){
      counter++;
      $('.tweets').prepend('<div id="'+counter+'">'+ message.tweet.text +'</div>');
      if ( counter > 20) {
          $('#') + (counter - 20).remove()
      }
    });

    return this.$element;
};
})(jQuery, block);
