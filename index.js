const axios = require('axios');
const cheerio = require('cheerio'); //to scrape imgur wallpapers
const request = require('request');
const { DownloaderHelper } = require('node-downloader-helper');



// yargs, to get arguments from commandline
const argv = require('yargs').argv;
const path = require("path");
const fs = require('fs');


const baseAPI = "https://www.reddit.com/r/";

let subredditName;
let sortBy;
let postLimit;
let pathToSave;
let fileTitleLength = 18;

const wallpaperLinks = [];
const imgurWallpaperLinks = [];
let directoryFiles = [];




const fetchPosts = async (name, sort, limit, dir) => {

    try {

        subredditName = name;
        sortBy = sort;
        postLimit = limit;

        if (dir !== undefined || dir !== null) {
            pathToSave = path.join(dir, subredditName)
        } else {
            pathToSave = path.join(__dirname, subredditName)
        }

        // if user didn't specify subreddit name, throw an error
        if (argv.name === undefined) throw ("Please provide a subreddit name");

        readDirectoryFiles();

        const resData = await axios.get(`${baseAPI}${subredditName}/${sortBy}/.json?limit=${postLimit}`);

        const posts = resData.data.data.children;

        if (posts.length >= 0) {
            // check if folder already exists, if not, create it
            checkIfFolderExists();

            posts.forEach(post => {
                // If the image is either an image or gif only
                const fileExtension = post.data.url.substr(post.data.url.length - 4);
                if (post.data.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {

                    if (fileExtension) {

                        // If the file doesn't already exist, set it up for download!!!
                        if (directoryFiles.indexOf(post.data.title.slice(0, fileTitleLength) + fileExtension) == -1) {

                            wallpaperLinks.push({
                                title: post.data.title,
                                url: post.data.url,
                                extension: fileExtension
                            });
                        } else {
                            console.log(`${post.data.title} is already downloaded!`)
                        }
                    }

                } else if (post.data.domain === 'imgur.com') {


                    if (directoryFiles.indexOf(post.data.title.slice(0, fileTitleLength) + fileExtension) == -1) {
                        imgurWallpaperLinks.push({
                            title: post.data.title,
                            url: post.data.url,
                            extension: fileExtension
                        })
                    } else {
                        console.log(`${post.data.title} is already downloaded!`)
                    }
                }

            })

        } else {
            throw ("Could not find any post in the subreddit. Did you type in correct subreddit name?");
        }

        if (imgurWallpaperLinks.length > 0) {
            getImgurWalls();
        }
        downloadWallpapers();


    } catch (error) {
        return console.log(error)
    }
}

const checkIfFolderExists = () => {

    if (!fs.existsSync(pathToSave)) {
        fs.mkdirSync(pathToSave);
    }


}

const downloadWallpapers = () => {

    wallpaperLinks.forEach((wallpaper, index) => {

        const target_url = wallpaper.url;
        const file_name = wallpaper.title.slice(0, fileTitleLength) + wallpaper.extension; //full title gave some error while saving, i'm suspecting because of use of emoji, so gonna have to slice it :(

        const dl = new DownloaderHelper(target_url, pathToSave, { fileName: file_name });

        dl.on('end', () => console.log('Downloaded ' + parseInt(index + 1) + ' of ' + wallpaperLinks.length));

        dl.start();


    })
}



const getImgurWalls = () => {
    imgurWallpaperLinks.forEach(iWalls => {
        request(iWalls.url, (err, res, body) => {
            if (err) return console.log(err);
            const $ = cheerio.load(body);

            const imgURL = $("link[rel='image_src']").attr('href');
            wallpaperLinks.push({
                title: iWalls.title,
                url: imgURL
            })
        })
    })

}

const readDirectoryFiles = () => {
    checkIfFolderExists();
    const files = fs.readdirSync(pathToSave);
    files.forEach(file => {
        directoryFiles.push(file);
    })
}


// fetchPosts();
exports.fetchPosts = fetchPosts;
