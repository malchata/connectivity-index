# Connectivity Index
## Internet Speed Around the World
### [cindex.co](https://cindex.co)

I really like Akamai's State of the Internet Connectivity Report data. So much so that I decided to take the data from the report and build a little site/app around it. That's what Connectivity Index is!

## How to build and run the app locally

Unless you want to poke around and see how everything works under the hood, you'll probably want to just use the app in production at [https://cindex.co](https://cindex.co). If you're interested in running it locally, however, just run the following commands in a terminal of your choosing:

```shell
git clone https://github.com/malchata/connectivity-index.git
cd connectivity-index
npm install
npm i gulp-cli -g # Skip this if you already have gulp installed
npm run build
npm run start
```

A local instance of the app will then start running at on your machine at [http://localhost:8080](http://localhost:8080)

## Tech babble (for interested devs)

This is my first shot at a full stack JavaScript solution. Express is used for the web server, preact is used for client side UI, and preact-render-to-string is used to generate markup on the server side (this app provides a JavaScript-less experience).

Because preact is used, the app is extremely lightweight. Even with Google Analytics loaded in prod, the payload of the entire app is only 28.2 KB.

## Contributing

If you have an idea for Connectivity Index, log an issue!