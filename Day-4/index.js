const http = require("http");
const fs = require("fs");
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  if (req.url == "/"||req.url == "/home") {
    fs.readFile("index.html", (error, data) => {
      res.write(data);
      res.end();
     
    });
  } else if (req.url == "/services") {
    fs.readFile("services.html", (error, data) => {
      res.write(data);
      res.end();
    });
  } else if (req.url == "/about") {
    fs.readFile("about.html", (error, data) => {
      res.write(data);
      res.end();
    });
  }else {
    fs.readFile("404.html", (error, data) => {
      res.write(data);
      res.end();
    });
  }

});

server.listen(8080);
