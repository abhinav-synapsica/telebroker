var net = require('net');
const fs = require('fs');

var client = new net.Socket();
client.connect(2222, '127.0.0.1', function() {
	console.log('Connected');
	const img = fs.readFileSync('../dcm');
	console.log(img,'img')
	client.write(img);
});

client.on('data', function(data) {
	console.log('Received: ', data);
	client.destroy(); // kill client after server's response
});

client.on('close', function() {
	console.log('Connection closed');
});