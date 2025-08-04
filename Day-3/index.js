const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
    const pathname = req.url;
    res.setHeader("Content-type", "text/html");

    if (pathname === "/") {
      fs.readFile("index.html", (err, data) => {
        res.write(data);
      });
    } else if (pathname === "/about") {
      fs.readFile("about.html", (err, data) => {
        res.write(data);
      });
    }

 
});

server.listen(3000);

