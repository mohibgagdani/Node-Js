const http = require("http");
// const url = require("url");

const server = http.createServer((req, res) => {
  const path = req.url;
  res.setHeader("Content-type", "text/html");
  if (path == "/") {
    res.write("<h1>hello</h1>");
  } else if (path == "/hello") {
    res.write("<h1>main</h1>");
  } else {
    res.write("<h1>page not found</h1>");
  }
  res.end();
});

server.listen(3000, () => {
  console.log("server is live");
});
