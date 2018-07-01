const Promise = require('bluebird');
const Twit = require('twit');
const dotenv = require('dotenv');
dotenv.load();
const chalk = require('chalk');

const T = new Twit({
    consumer_key: process.env.GOOD_GUY_CONSUMER_KEY,
    consumer_secret: process.env.GOOD_GUY_CONSUMER_SECRET,
    access_token: process.env.GOOD_GUY_ACCESS_TOKEN,
    access_token_secret: process.env.GOOD_GUY_ACCESS_TOKEN_SECRET
});

const users = [];
users.push(process.env.USER_ID);

const stream = T.stream('statuses/filter', { follow: users });

stream.on('tweet', (tweet) => {
    if(users.indexOf(tweet.user.id_str > -1)) {
        console.log(chalk.blue('New tweet from: ', tweet.user.name));
        if(tweet.user.id_str !== process.env.GODD_GUY_USER_ID_STRING) {
            setTimeout(() => {
                T.post('statuses/retweet/:id', { id: tweet.id_str })
                .then((data) => {
                    console.log(chalk.yellow('Good guy has done it\'s job'));
                })
                .catch((err) => {
                    console.error('ERROR: ', err);
                })
            }, getRandomNumber(1, 15) * 60 * 1000);
        }
    }
});

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
