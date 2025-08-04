const app = require("express")();

app.listen(5500);

app.get("/name", (req, res) => {
  res.send({
    name: "manvendrasinh",
    surname: "jadeja",
  });
});

// const div = document.querySelector(".hello");
// const http = require("http");
// const server = http.createServer((req, res) => {
//   res.end("hello");
//   fetch("http://localhost:3000/name")
//     .then((res) => res.json)
//     .then((data) => {    
//       //   div.innerText = data;
//       console.log(data);
//     });
// });

// server.listen(8080, () => {
//   console.log("server is live");
// });
