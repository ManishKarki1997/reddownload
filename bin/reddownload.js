#!/usr/bin/env node

const { fetchPosts } = require('../index');
const argv = require('yargs').argv;

let subredditName = argv.name;
let postLimit = argv.limit || 50;
let sortBy = argv.sort || 'new';
let dir = argv.dir || require('os').homedir();

if (subredditName === '' || subredditName === undefined) {
    console.log("Please specify a subreddit name");
    return false;
} else if (postLimit > 100 || postLimit <= 0 || postLimit === undefined || postLimit === '') {
    console.log("Limit can be only between 0 and 100");
    return false;
} else if (sortBy !== 'new' || sortBy !== 'hot') {
    console.log('sortBy can only be "hot" or "new"');
    return false;
}

fetchPosts(subredditName, sortBy, postLimit, dir);