from eca import *
from eca.generators import start_offline_tweets

import random
from datetime import datetime

## You might have to update the root path to point to the correct path
## (by default, it points to <rules>_static)
# root_content_path = 'template_static'


# binds the 'setup' function as the action for the 'init' event
# the action will be called with the context and the event
@event('init')
def setup(ctx, e):
    ctx.totalTweets = 0
    ctx.currentDay = 0
    ctx.dayTweets = 0
    start_offline_tweets('weer.txt', 'chirp', time_factor=10000)

# define a normal Python function
def clip(lower, value, upper):
    return max(lower, min(value, upper))

@event('chirp')
def tweet(ctx, e):
    # filter #Buren tweets
    if e.data['text'].find('#Buren') == -1:
      ctx.totalTweets += 1
      date = datetime.strptime(e.data['created_at'], '%a %b %d %H:%M:%S %z %Y')
      now = "{}{}{}".format(date.year, date.month, date.day)
      if now != ctx.currentDay:
        ctx.currentDay = now
        ctx.dayTweets = 0
      ctx.dayTweets += 1
      emit('tweet', {
        'date': now,
        'mood': {
          'Noord-Holland': random.uniform(0, 10),
          'Utrecht': random.uniform(0, 10),
          'Friesland': random.uniform(0, 10),
          'Flevoland': random.uniform(0, 10),
          'Gelderland': random.uniform(0, 10),
          'Drenthe': random.uniform(0, 10),
          'Groningen': random.uniform(0, 10),
          'Overijssel': random.uniform(0, 10),
          'Zeeland': random.uniform(0, 10),
          'Zuid-Holland': random.uniform(0, 10),
          'Noord-Brabant': random.uniform(0, 10),
          'Limburg': random.uniform(0, 10)
        },
        'count': {
          'day': ctx.dayTweets,
          'total': ctx.totalTweets
        },
        'moodGeneral': {
          'moodLevel': random.uniform(6,10)
        },
        'tweet': e.data
      })  
      emit('test', e.data)  
    
@event('sample')
def generate_sample(ctx, e):
    ctx.count += 1
    if ctx.count % 50 == 0:
        emit('debug', {'text': 'Log message #'+str(ctx.count)+'!'})

    # base sample on previous one
    sample = clip(-1000, e.data['previous'] + 1, 1000)

    # emit to outside world
    emit('sample',{
        'action': 'add',
        'value': sample
    })

    # chain event
    fire('sample', {'previous': sample}, delay=1)

