# Musker

A twitter clone.

## Experimental stuff caveats

https://beta.nextjs.org/docs/api-reference/file-conventions/head
Currently, the Head export does not re-render
on client-side transitions, only on initial render.
To work around this for `<title>`, you can use a
client component with useEffect that updates document.title.
This will be fixed soon in a future release.

## TODO

**friendly reminder so self**
**goal is not** feature complete twitter copy.
**goal is** get comfortable with latest/experimental nextjs stuff (app dir, server components etc)

### features

- [x] tweet
- [x] reply
- [x] like
- [x] retweet
- [ ] quote tweet
- [ ] mention

#### Where are things shown?

see [different types of tweets](https://help.twitter.com/en/using-twitter/types-of-tweets):

###### tweets

- [ ] profile page of sender
- [ ] home of sender
- [ ] home of followers

###### replies

- [ ] profile of sender
- [ ] notifications of recipient
- [ ] recipients home if the recipient is following the sender
- [ ] home of anyone following both recipient and sender

###### mentions

- [ ] same as replies
- [ ] but without a parent tweet

###### rewtweet

- [ ] same as tweets
- [ ] but also notifications of original tweet author

###### quote tweet

- [ ] same as retweet but with text

##### likes

- [ ] notifications of tweet author
- [ ] home of followers (maybe)

#### home

tweets from this user
tweets from followed users
likes from followed users
retweets from followed users
quotetweets from followed users
replies from followed users if also following the repliedto user
mentions from followed users if also following the mentioned user

#### notifications

replies on this users tweets
likes on this users tweets
mentions of this user
retweets of this users tweets
quotetweets of this users tweets
