(function($, block) {
block.fn.photos = function(config) {
    var options = $.extend({
        memory: 5
    }, config);
    
    this.$element.prepend('<div class="carousel-inner" role="listbox"></div>');
    var $list = this.$element.find('.carousel-inner');
    
    this.actions(function(e, message){
      if ( typeof message.buffer != 'undefined' ) {
        if ( $('.item').length > 0 ) {
          return;
        }
        message.buffer.potd.map(function(img) {
          var $item = $('<div class="item"></div>');
          var $image = $('<img src="' + img + '" />');
          $item.append($image);
          $list.prepend($item);
        })
        $('.item').first().addClass('active');
      }
      else {
        var $item = $('<div class="item"></div>');
        var $image = $('<img src="' + message.photo + '" />');
        $item.append($image);
        $list.prepend($item);
        $('.active').removeClass('active');
        $('.item').first().addClass('active');
        
        if ($list.children().size() > options.memory) {
            $list.children().last().remove();
        }
      }
    });
    $('#pictures-carousel').carousel();

    return this.$element;
};
})(jQuery, block);