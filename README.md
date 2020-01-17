# Reddownload

Reddownload is a simple nodejs script to download images from subreddits.

# Features
- Download i.reddit.com images (simple api calls)
- Download imgur images (using request and cheerio to scrape image)
- Save images into their respective subreddit name folders
- Doesn't download and save duplicate images
- Can sort by "new" and "hot"
- Can download upto 100 images at once
- Can work on your phone using Termux, but needs a bit of tinkering


# How to use
Install using
```
$ npm install -g reddownload
```

Use 
```sh
$ reddownload --name=[subreddit_name] --limit=[0-100] --sort=[hot/new] --dir=['path']
```

Example

```
$ reddownload --name="EarthPorn" --limit=20 --sort="hot"
```

