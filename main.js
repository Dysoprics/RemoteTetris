const http = require('http');
const fs = require('fs');

const port = '3000';

const server = http.createServer((req, res) => {
    if (req.method === 'GET') {
        if (req.url === '/') {
            res.writeHead(308, {'Content-Type': 'text/html'});
            res.write('<p style="margin: 0; display: inline-block;">You are being redirected... (Press any key to cancel)</p> <button onclick="window.location.href=`/game`">Go to /game</button> <script>const escape = setTimeout(() => { window.location.href=`/game`}, 1000); document.addEventListener("keydown", (e1) => {clearInterval(escape); alert("Redirection cancelled.");});</script>');
            res.end();
        } 
        
        
        
        else if (req.url === '/game') {
            fs.readFile('tetris/client/index.html', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/game/index.css') {
            fs.readFile('tetris/client/index.css', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/game/index.js') {
            fs.readFile('tetris/client/index.js', (err, data) => {
                res.writeHead(200, {'Content-Type': 'application/javascript'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/game/icon.png') {
            fs.readFile('assets/tetris.png', (err, data) => {
                res.writeHead(200, {'Content-Type': 'image/png'});
                res.write(data);
                res.end();
            });
        }



        else if (req.url === '/command') {
            fs.readFile('tetris/commander/index.html', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/command/index.css') {
            fs.readFile('tetris/commander/index.css', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/command/index.js') {
            fs.readFile('tetris/commander/index.js', (err, data) => {
                res.writeHead(200, {'Content-Type': 'application/javascript'});
                res.write(data);
                res.end();
            });
        }
        else if (req.url === '/command/icon.png') {
            fs.readFile('assets/tetris.png', (err, data) => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        }
        
        
        
        else {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write('{"status": 404}');
            res.end();
        }
    }
});

server.listen(port);