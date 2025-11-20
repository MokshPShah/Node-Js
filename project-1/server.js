const http = require('http');
const port = 8000;

const server = http.createServer((req, res) => {
    console.log(`Request received: ${req.url}`);

    res.end("Hello from your Node.js server!")
})

server.listen(port, (err)=>{
    if (err) {
        console.log("Server issue");
    }
    console.log(`Server is running on http://localhost:${port}`);
})