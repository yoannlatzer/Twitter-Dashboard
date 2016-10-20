from eca import *
from eca.generators import start_offline_tweets
import eca.http

import random
from datetime import datetime

## You might have to update the root path to point to the correct path
## (by default, it points to <rules>_static)
# root_content_path = 'template_static'


#create a buffer (used for keeping things in memory for a new connection)
def add_request_handlers(httpd):
  httpd.add_route('/buffer', eca.http.GenerateEvent('buffer'), methods=["POST"])

# binds the 'setup' function as the action for the 'init' event
# the action will be called with the context and the event
@event('init')                                    #initialize the initial parameters so there are no errors in client side code
def setup(ctx, e):
    # set empty buffer
    ctx.buffer = {'tweets': [], 'potd': [photos[0]]}
    ctx.mood = {'g': 0, 'b': 0, 'n': 0}           
    ctx.calculatedMood = 0
    ctx.photoCount = 1
    ctx.totalTweets = 1
    ctx.currentDay = 0
    ctx.dayTweets = 0
    ctx.now = 1
    start_offline_tweets('weer_zonderburen.txt', 'chirp', time_factor=10000, arff_file='merge_final.arff')  #start the tweetflow

# define a normal Python function


@event('chirp')                                                           #give event name in which we stream the tweets
def tweet(ctx, e):
    if e.data['extra']['@@weather@@'] == 'y':
      ctx.totalTweets += 1                                                      #check if the tweet is about weather, if so, send it and add 1 to total counter
      if ctx.totalTweets == 221:                                                #if the tweet is at max amount (of tweets that actually have to do with weather)
        setup(ctx, e)                                                           #we return if above is case
      date = datetime.strptime(e.data['created_at'], '%a %b %d %H:%M:%S %z %Y')
      ctx.now = "{:%Y%m%d}".format(date)                                        #get date and format it for the timestamp

      if ctx.now != ctx.currentDay:
        ctx.currentDay = ctx.now                                                 #set day to next day
        ctx.dayTweets = 0                                                        #reset number of tweets on client side for that day
        ctx.buffer['tweets'] = []                                               #empty the tweet ubffer
        ctx.mood = {'g': 0, 'b': 0, 'n': 0}                                     #reset the mood for the day
      
      ctx.dayTweets += 1
      calculateMood(ctx, e)                                                     #calculate mood based on tweet
            
                                                                                # check for url to replace it with an working picture
      if 'media' in e.data['entities']:
        changeMedia(ctx, e)
        ctx.photoCount += 1
        
      if len(e.data['entities']['urls']) > 0:                                   #select a picture
        changeUrls(ctx, e)
        ctx.photoCount += 1
        
      if ctx.photoCount > 14:
        ctx.photoCount = 0
        
      ctx.buffer['tweets'].append(e.data)                                        #slowly build a buffer of tweets
      emit('tweet', {
        'date': ctx.now,
        'count': {
          'day': ctx.dayTweets,
          'total': ctx.totalTweets
        },                                                                      #emit the tweet with set values
        'moodGeneral': {
          'moodLevel': ctx.calculatedMood
        },
        'tweet': e.data
      })  

def calculateMood(ctx, e):                                                      #calcuate the mood
  if e.data['extra']['@@sentiment@@'] == 'b':
    ctx.mood['b'] += 1
    
  if e.data['extra']['@@sentiment@@'] == 'g':
    ctx.mood['g'] += 1
    
  if e.data['extra']['@@sentiment@@'] == 'n':
    ctx.mood['n'] += 1
    
  ctx.calculatedMood = ((ctx.mood['g'] * 2) + ctx.mood['n']) / ctx.dayTweets

def changeMedia(ctx, e):                                                                          #change the media (from dead links to working ones)
  e.data['text'] = e.data['text'].replace(e.data['entities']['media'][0]['url'], ' photo')
  e.data['entities']['media'][0]['url'] = urls[ctx.photoCount]
  e.data['entities']['media'][0]['display_url'] = ' photo'
  emitPhoto(ctx, e)
     
def changeUrls(ctx, e):                                                          #we also change the in the tweet with a working one
  e.data['text'] = e.data['text'].replace(e.data['entities']['urls'][0]['url'], ' photo')
  e.data['entities']['urls'][0]['url'] = urls[ctx.photoCount]
  e.data['entities']['urls'][0]['display_url'] = ' photo'
  emitPhoto(ctx, e)
  
def emitPhoto(ctx, e):                                                          #emit the photo if tweet is weather related
  if e.data['extra']['@@weather@@'] == 'y':
    emit('photo', {
      'photo': photos[ctx.photoCount]
    })
    ctx.buffer['potd'].append(photos[ctx.photoCount])                           #buffer it so a new user does not get an empty page
    if len(ctx.buffer['potd']) > 5:
      ctx.buffer['potd'].pop(0)
  
@event('buffer')                                                                #if a new connection we request the buffer
def loadBuffer(ctx, e):
  ctx.buffer['moodGeneral'] = {'moodLevel': ctx.calculatedMood}
  emit('buffer', {
      'date': ctx.currentDay,
      'buffer': ctx.buffer,
      'count': {
        'day': ctx.dayTweets,
        'total': ctx.totalTweets
      }
    })
    
urls = [                                                                        #new urls for the urls that are being replaced
  'http://imgur.com/MqWFFPb',
  'http://imgur.com/oqXEEgh',
  'http://imgur.com/rV8W4O7',
  'http://imgur.com/vECgD96',
  'http://imgur.com/hkwXN7S',
  'http://imgur.com/K8k00tx',
  'http://imgur.com/1IJJcaj',
  'http://imgur.com/WtI90Eg',
  'http://imgur.com/nL3056N',
  'http://imgur.com/6Ns9xZx',
  'http://imgur.com/AxcwWYD',
  'http://imgur.com/CvwzIoE',
  'http://imgur.com/knDy7Cu',
  'http://imgur.com/EIUkR49',
  'http://imgur.com/lSbAiSb',
  'http://imgur.com/jENAMfB'
]

photos = [                                                                      #new photos for the  photos that are being replaced
  'http://imgur.com/MqWFFPb.jpg',
  'http://imgur.com/oqXEEgh.jpg',
  'http://imgur.com/rV8W4O7.jpg',
  'http://imgur.com/vECgD96.jpg',
  'http://imgur.com/hkwXN7S.jpg',
  'http://imgur.com/K8k00tx.jpg',
  'http://imgur.com/1IJJcaj.jpg',
  'http://imgur.com/WtI90Eg.jpg',
  'http://imgur.com/nL3056N.jpg',
  'http://imgur.com/6Ns9xZx.jpg',
  'http://imgur.com/AxcwWYD.jpg',
  'http://imgur.com/CvwzIoE.jpg',
  'http://imgur.com/knDy7Cu.jpg',
  'http://imgur.com/EIUkR49.jpg',
  'http://imgur.com/lSbAiSb.jpg',
  'http://imgur.com/jENAMfB.jpg'
]