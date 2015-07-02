var Docker = require('dockerode');
var fs = require('fs');
var fileLocation = process.argv[2];

var docker = new Docker(
      {
        protocol: 'https', //you can enforce a protocol
        host: '192.168.59.103',
        port: process.env.DOCKER_PORT || 2376,
        ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
        cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
        key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
      }
);

var tar = require('tar-fs');
var tarStream = tar.pack(fileLocation);
var nameImage = 'apoorv21/hwnd33';
//var tag = nameImage;
docker.buildImage(tarStream, {
    t : nameImage,
    q : true
    }, function(err, output) {
        console.log('buildImage', err);
        var id;
        output.on('data', function(data) 
       	    {
           	var json = JSON.parse(data.toString());
            	console.log(json.stream)
            	if (json.stream.indexOf('Successfully built ') == 0) 
                   {
                  	id = json.stream.split('Successfully built ')[1].replace('\n', '');

                   }
           });
        	var time = Date.now()
        	var auth = {
                 	     username: '',
                     	     password: '',
                     	     auth: '',
                             email: 'apoorv.agrawal02@gmail.com',
                             serveraddress: 'https://index.docker.io/v1'
                   	   };
      
      output.on('end', function() 
            {
              console.log('Successfully built');
              var image = docker.getImage(nameImage);
              image.push({}, function(err, data) 
                    {
                        if (err)
                        return console.log('push', err);
                        data.on('data', function(data) 
                          {
                            var json = JSON.parse(data.toString());
                            console.log(json)
                          });
                    },auth);
          });
    });


