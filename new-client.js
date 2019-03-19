var net = require('net');
const fs = require('fs');

var client = new net.Socket();

const PORT = 2222;

client.connect(PORT, '127.0.0.1', function() {
	console.log('Connected');
	const img = fs.readFileSync('./dcm');
	console.log(img,'img')
	client.write(img);
});

client.on('data', function(data) {
	console.log('Received: ', data);
	client.destroy(); // kill client after server's response
});


client.on('drain', () => {
	client.destroy();
})

client.on('close', function() {
	console.log('Connection closed');
});