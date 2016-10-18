(function($, block) {
  
  function mapInt(input, in_min, in_max, out_min, out_max) {
    return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  function drawMoodBar(moodLevel) {
     console.log(moodLevel);
    $('#mood-div').animate({"height": mapInt(moodLevel, 0, 2, 0, 250) + "px"});

    if (moodLevel < 1) {
      $('#mood-div').animate({backgroundColor: "#F44336"});
      //$('#mood-container').append("<p>Happy</p>");
    }
    else if (moodLevel > 1) {
      $('#mood-div').animate({backgroundColor: "#00E676"});
      //$('#mood-container').append("<p>Sad</p>");
    }
    else {
      $('#mood-div').animate({backgroundColor: "#FFF176"});
    }
  }

  block.fn.moodlevel = function(config){

    this.actions(function(e, tweet) {
      drawMoodBar(tweet.moodGeneral.moodLevel);
    });
    
    return this.$element
  }

})(jQuery, block);