var Docker = require('dockerode');
var fs = require('fs');
var tar = require('tar-fs');

function DockerDeployer()
{
  this.dockerClient  = new Docker(
        {
          protocol: 'https', //you can enforce a protocol
          host: '192.168.59.103',
          port: process.env.DOCKER_PORT || 2376,
          ca: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/ca.pem'),
          cert: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/cert.pem'),
          key: fs.readFileSync(process.env.DOCKER_CERT_PATH + '/key.pem')
        }
  );
}

DockerDeployer.prototype.buildImage=function (fileLocation, imageName, callback)
{
  var tarStream = tar.pack(fileLocation), self = this;
        this.dockerClient.buildImage(tarStream, {
          t : imageName,
          q : false
          }, function(err, output) {
              console.log('buildImage', err);
              if (err)
                {
                  return callback(err);
                }
             self.__waitForResult(output, callback);
          });
}

DockerDeployer.prototype.pushImage=function(imageName,authArguments,callback)
{
  var self = this,
    image = this.dockerClient.getImage(imageName);
    image.push({},function (err,result){
      if (err)
       {
         return callback(err);
       }
      self.__waitForResult(result, callback);
    },authArguments);
}
DockerDeployer.prototype.__waitForResult = function (output, callback) {
  output.on('data', function (data){
  var jsonData=JSON.parse(data.toString());
  console.log(jsonData);
  });
  output.on('error',function(){
  console.log('Error')
  return callback(error,false);
  });
  output.on('end', function(){
  console.log('finished');
  return callback(null,true);
  });
}
module.exports = DockerDeployer;
