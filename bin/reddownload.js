#!/usr/bin/env node


const { fetchPosts } = require('../index');
const argv = require('yargs').argv;

let subredditName = argv.name;
let postLimit = argv.limit || 100;
let sortBy = argv.sort || 'new';


fetchPosts(subredditName, sortBy, postLimit);