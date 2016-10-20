/**
 * The last 5 photos from the tweets
 */
(function($, block) {
block.fn.photos = function(config) {
    var options = $.extend({
        memory: 5
    }, config);
    
    // Setup bootstrap carousel
    this.$element.prepend('<div class="carousel-inner" role="listbox"></div>');
    var $list = this.$element.find('.carousel-inner');
    
    // Function loads when a photo or buffer event is triggerd 
    this.actions(function(e, message){
      if ( typeof message.buffer != 'undefined' ) {
        // Exit update if buffer is loaded on a non empty list
        if ( $('.item').length > 0 ) {
          return;
        }
        // Loop through buffer
        message.buffer.potd.map(function(img) {
          var $item = $('<div class="item"></div>');
          var $image = $('<img style="max-heigth:100%;max-width:100%;" src="' + img + '" />');
          // Append image to div
          $item.append($image);
          // Prepend image to list
          $list.prepend($item);
        })
        // Show first image 
        $('.item').first().addClass('active');
      }
      else {
        var $item = $('<div class="item"></div>');
        var $image = $('<img style="max-heigth:100%;max-width:100%;" src="' + message.photo + '" />');
        // Append image to div
        $item.append($image);
        // Prepend image to list
        $list.prepend($item);
        $('.active').removeClass('active');
        // Show first image 
        $('.item').first().addClass('active');
        
        if ($list.children().size() > options.memory) {
            $list.children().last().remove();
        }
      }
    });
    // Load carousel
    $('#pictures-carousel').carousel();

    return this.$element;
};
})(jQuery, block);