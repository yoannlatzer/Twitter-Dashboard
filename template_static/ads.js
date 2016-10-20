/**
 * Ads block shows map with ads related to the weather 
 */
(function($, block) {
  /**
   * Function getAdType gets the weather type for a spefic date
   */
  var getAdType = function(date) {
    // Get temperature
    var weather = $.grep(window.weather, function(e) { 
      return e.id == 260 && e.date == date; 
    });
    // Extract temperature from date object
    if ( weather.length > 0 ) {
      temperature = weather[0].ta * .1;
      rain = weather[0].rain * .1;
    }
    else {
      temperature = 0;
      rain = 0; 
    }
    
    // temp < 5 = cold, rain > 0 = rain, temp > 20 = hot, others = normal.
    // Where cold = windjacket, rain = storm umbrella, hot = sunglasses and normal = umbrella
    if ( temperature < 5 ) {
      return "cold"
    }
    if ( rain > 0 ) { 
      return "rain"
    }
    if ( temperature > 20 ) {
      return "hot"
    }
    return "normal"
  }
  
  // Ads object {[type]: ad}
  var ads = {
    normal: '<a href="https://www.bol.com/nl/p/falcone-windproof-paraplu-o-130-cm-wit/9200000046254439/?suggestionType=browse"><img src="/img/ad/umbrella.jpg" alt=""></a>',
    rain: '<a href="https://www.bol.com/nl/p/senz-smart-s-stormparaplu-opvouwbaar-o-87-cm-deep-blue/9200000023062558/?suggestionType=browse"><img src="/img/ad/storm-umbrella.jpg" alt=""></a>',
    cold: '<a href="http://www.decathlon.nl/windjack-h-500-ulight-blauw-id_8309828.html"><img src="/img/ad/windjacket.jpg" alt=""> </a>',
    hot: '<a href="https://www.pearle.nl/zonnebrillen/exclusieve-ray-ban-collectie"><img src="/img/ad/sunglasses.jpg" alt=""> </a>'
  }
  
  // Set cache date
  var date = 0
	block.fn.ads = function(options) {
		options = $.extend({
			'timeout': 3000,
			'speed': 400 // 'normal'
		}, options);
    
    // Make base div
    this.$element.append('<div id="ad"><a href="https://www.bol.com/nl/p/falcone-windproof-paraplu-o-130-cm-wit/9200000046254439/?suggestionType=browse"><img src="/img/ad/umbrella.jpg" alt=""></a></div>');
    this.actions(function(e, message){
      // Only update on date != message date
      if ( date != message.date ) {
        date = message.date
        $div = $('div', this);
        // hide old ad
        $div.hide();
        // get weather type
        var type = getAdType(message.date)
        // Set ad to div
        $div.html(ads[type]);
        // Fade in ad
        $div.fadeIn(options.speed);
      }
		});
    
    return this.$element;
	};
}(jQuery, block));