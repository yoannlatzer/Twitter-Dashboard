(function($, block) {
  
  function mapInt(input, in_min, in_max, out_min, out_max) {
    return (input - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  function drawMoodBar(moodLevel) {
     console.log(moodLevel);
    $('#mood-div').animate({"height": mapInt(moodLevel, 0, 2, 0, 250) + "px"});

    if (moodLevel < 0.67) {
      $('#mood-details').remove();
      $('#mood-div').animate({backgroundColor: "#F44336"});
      $('#mood-container').append('<div id="mood-details"><p>Current Mood: Sad</p><img src="/img/sad.png"></img></div>');
    }
    else if (moodLevel > 1.33) {
      $('#mood-details').remove();
      $('#mood-div').animate({backgroundColor: "#00E676"});
      $('#mood-container').append('<div id="mood-details"><p>Current Mood: Happy</p><img src="/img/happy.png"></img></div>');
    }
    else {
      $('#mood-details').remove();
      $('#mood-div').animate({backgroundColor: "#FFF176"});
      $('#mood-container').append('<div id="mood-details"><p>Current Mood: Neutral</p><img src="/img/neutral.png"></img></div>');
    }
  }

  block.fn.moodlevel = function(config){

    this.actions(function(e, tweet) {
      drawMoodBar(tweet.moodGeneral.moodLevel);
    });
    
    return this.$element
  }

})(jQuery, block);
