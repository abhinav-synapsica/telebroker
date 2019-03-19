const http = require('http')
const net = require('net')
const fs = require('fs');
const daikon = require('daikon');
const dicomParser = require('dicom-parser');
var zlib = require('zlib');

const PORT = 2222

var server = net.createServer();

//emitted when server closes ...not emitted until all connections closes.
server.on('close',function(){
  console.log('Server closed !');
});

// emitted when new client connects
server.on('connection',function(socket){

//this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
//Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().

  console.log('Buffer size : ' + Object.keys(socket));

  console.log('---------server details -----------------');

  var address = server.address();
  var port = address.port;
  var family = address.family;
  var ipaddr = address.address;
  console.log('Server is listening at port' + port);
  console.log('Server ip :' + ipaddr);
  console.log('Server is IP4/IP6 : ' + family);

  var lport = socket.localPort;
  var laddr = socket.localAddress;
  console.log('Server is listening at LOCAL port' + lport);
  console.log('Server LOCAL ip :' + laddr);

  console.log('------------remote client info --------------');

  var rport = socket.remotePort;
  var raddr = socket.remoteAddress;
  var rfamily = socket.remoteFamily;

  console.log('REMOTE Socket is listening at port' + rport);
  console.log('REMOTE Socket ip :' + raddr);
  console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);

  console.log('--------------------------------------------')


	//var no_of_connections =  server.getConnections(); // sychronous version
	server.getConnections(function(error,count){
	  console.log('Number of concurrent connections to the server : ' + count);
	});


	const chunks = [];
	socket.on('data', function(chunk){
		console.log(chunk, 'chunk');
		chunks.push(chunk);
	})


	socket.on('end',function(){

		console.log('data is recieved :End')
		const data = Buffer.concat(chunks)
	  var bread = socket.bytesRead;
	  var bwrite = socket.bytesWritten;
	  // console.log('Bytes read : ' + bread);
	  // console.log('Bytes written : ' + bwrite);
	  console.log('Data:', data);
	  var imgData = data   
	  var bufferSize = 1000000;

	 	fs.writeFileSync('./dcopy.dcm', data);

		// try
		// {
		//    // Parse the byte array to get a DataSet object that has the parsed contents

		//     var dataSet = dicomParser.parseDicom(data)
		//     console.log(dataSet, 'dataset')

		//     // access a string element
		//     var studyInstanceUid = dataSet.string('x0020000d');

		//     console.log(studyInstanceUid, 'sdadsa');

		//     // get the pixel data element (contains the offset and length of the data)
		//     var pixelDataElement = dataSet.elements.x7fe00010;
		//     console.log(pixelDataElement, 'ell')
		//     // create a typed array on the pixel data (this example assumes 16 bit unsigned data)
		//     var pixelData = new Uint8Array(dataSet.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
		//     console.log(pixelData, 'pixeldata');
		//     fs.writeFile('../dcopy.png', pixelData, function (err) {
		// 		  if (err) throw err;
		// 		  console.log('Saved!');
		// 		});
		// }
		// catch(ex)
		// {
		//    console.log('Error parsing byte stream', ex);
		// }

		//

	  //echo data
	  var is_kernel_buffer_full = socket.write('Data ::' + data);
	  if(is_kernel_buffer_full){
	    console.log('Data was flushed successfully from kernel buffer i.e written successfully!');
	  }else{
	    socket.pause();
	  }

	});

	server.on('error', (e) => {
	  if (e.code === 'EADDRINUSE') {
	    console.log('Address in use, retrying...');
	    setTimeout(() => {
	      server.close();
	      server.listen(PORT);
	    }, 1000);
	  }
	});

})


// bufferToArrayBuffer(compressedBuffer); -> empty ab {}


//emits when server is bound with server.listen
server.on('listening',function(){
  console.log('Server is listening!');
});

server.maxConnections = 10;

//static port allocation
server.listen(PORT);














// TODO: try to change buffer size