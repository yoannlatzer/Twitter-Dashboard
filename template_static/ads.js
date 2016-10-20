(function($, block) {
  var getAdType = function(date) {
    var temperature = $.grep(window.weather, function(e) { 
      return e.id == 260 && e.date == date; 
    });
    if ( temperature.length > 0 ) {
      temperature = temperature[0].ta * .1
    }
    else {
      temperature = 0;
    }
    var rain = $.grep(window.weather, function(e){
      return e.id == 260 && e.date == date; 
    });
    if ( rain.length > 0 ) {
      rain = rain[0].rain * .1
    }
    else {
      rain = 0;
    }
    
    if ( temperature < 5 ) {
      return "cold"
    }
    if ( rain > 1 ) { 
      return "rain"
    }
    if ( temperature > 20 ) {
      return "hot"
    }
    return "normal"
  }
  
  var ads = {
    normal: '<a href="https://www.bol.com/nl/p/falcone-windproof-paraplu-o-130-cm-wit/9200000046254439/?suggestionType=browse"><img src="/img/ad/umbrella.jpg" alt=""></a>',
    rain: '<a href="https://www.bol.com/nl/p/senz-smart-s-stormparaplu-opvouwbaar-o-87-cm-deep-blue/9200000023062558/?suggestionType=browse"><img src="/img/ad/storm-umbrella.jpg" alt=""></a>',
    cold: '<a href="http://www.decathlon.nl/windjack-h-500-ulight-blauw-id_8309828.html"><img src="/img/ad/windjacket.jpg" alt=""> </a>',
    hot: '<a href="https://www.pearle.nl/zonnebrillen/exclusieve-ray-ban-collectie"><img src="/img/ad/sunglasses.jpg" alt=""> </a>'
  }
  
  var date = 0
  
	block.fn.ads = function(options) {
		options = $.extend({
			'timeout': 3000,
			'speed': 400 // 'normal'
		}, options);
    
    this.$element.append('<div id="ad">');
    
    this.actions(function(e, message){
      if ( date != message.date ) {
        date = message.date
        $div = $('div', this);
        $div.hide();
        var type = getAdType(message.date)
        $div.html(ads[type]);
        $div.fadeIn(options.speed);
      }
		});
    
    return this.$element;
		// We loop through the selected elements, in case the ad was called on more than one element e.g. `$('.foo, .bar').ad();`
	/*
   <a href="https://www.bol.com/nl/p/falcone-windproof-paraplu-o-130-cm-wit/9200000046254439/?suggestionType=browse"><img src="umbrella.jpg" alt=""> </a>
   <a href="https://www.bol.com/nl/p/senz-smart-s-stormparaplu-opvouwbaar-o-87-cm-deep-blue/9200000023062558/?suggestionType=browse"><img src="storm-umbrella.jpg" alt=""></a>
   <a href="http://www.decathlon.nl/windjack-h-500-ulight-blauw-id_8309828.html"><img src="windjacket.jpg" alt=""> </a>
   <a href="https://www.pearle.nl/zonnebrillen/exclusieve-ray-ban-collectie"><img src="sunglasses.jpg" alt=""> </a>
    	return this.each(function() {
			// Inside the setInterval() block, `this` references the window object instead of the ad container element, so we store it inside a var
			var $elem = $(this);
			$elem.children().eq(0).appendTo($elem).show();
			// Iterate through the slides
			setInterval(function() {
				$elem.children().eq(0)
				// Hide the current slide and append it to the end of the image stack
				.hide().appendTo($elem) // As of jQuery 1.3.2, .appendTo() returns the inserted element
				// Fade in the next slide
				.fadeIn(options.speed)
			}, options.timeout);
		});*/
	};
}(jQuery, block));