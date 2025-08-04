// const http = require("http");
// const fs = require("fs");
// const server = http.createServer((req, res) => {
//   //  fs.writeFile("abc.txt","hii",(err)=>{
//   //     if (err) err
//   //     console.log("file written");

//   //  })

//   //  fs.appendFile("abc.txt","hii",(err)=>{
//   //     if (err) err
//   //     console.log("appended written");

//   //  })

//   //   fs.readFile("abc.txt", "utf-8", (err, data) => {
//   //     if (err) {throw err};
//   //     console.log(data);
//   //   });

//   //   fs.rename("abc.txt", "hello.txt", (err) => {
//   //     if (err) {throw err};
//   //   });
//   //   fs.unlink( "hello.txt", (err) => {
//   //     if (err) {throw err};
//   //   });

//   //   if (fs.existsSync("example.txt")) {
//   //     console.log("File exists.");
//   //   } else {
//   //     console.log("File does not exist");
//   //   }

//   // fs.mkdir('abc',(err)=>{
//   //     if(err) throw err
//   //     console.log("Folder created")

//   // });

//   // fs.rmdir('abc',(err)=>{
//   //     if(err) throw err
//   //     console.log("Folder created")

//   // });

//   // fs.readdir('.',(err,files)=>{
//   //     if(err) throw err
//   //     console.log(files)
//   // });

//   res.end();
// });

// server.listen(8080);

const http = require("http");
const fs = require("fs");

const createFileBtn = document.querySelector("#createFileBtn");
const writeFileBtn = document.querySelector("#writeFileBtn");
const readFileBtn = document.querySelector("#readFileBtn");
const createFileInput = document.querySelector("#createFileInput");
const writeFileInput = document.querySelector("#writeFileInput");
const readFileInput = document.querySelector("#readFileInput");


const server = http.createServer((req, res) => {
  function writeFile(fileData, fileName) {
    fs.writeFile(fileName || "abc.txt", fileData, (err) => {
      if (err) err;
      console.log("file written");
    });
  }
  function readFile(fileName) {
    fs.readFile(fileName || "abc.txt", "utf-8", (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
    });
  }
  function createFile(fileData, fileName) {
    // fs.createFile(fileName || "abc.txt", fileData || "hello");
    fs.writeFile(fileName || "abc.txt", fileData || "hello");
  }

  createFileBtn.addEventListener("click", () => {
    const data = createFileInput.data;
    createFile("abc.txt", data);
  });
  readFileBtn.addEventListener("click", () => {
    const data = writeFileInput.data;
    writeFile(data);
  });
  writeFileBtn.addEventListener("click", () => {
    const data = readFileInput.data;
    writeFile(data);
  });
  res.end();
});

server.listen(8080);
