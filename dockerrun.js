var DockerDeployer = require ('./DockerDeployer');
var docs = new DockerDeployer();
var fileLocation = process.argv[2];
console.log(imageName);
var fs = require('fs');
var authArguments = JSON.parse(fs.readFileSync('auth.json'));
var pushimage=authArguments.imageName;

docs.buildImage(fileLocation,authArguments.imageName, function (err,result)
{
  console.log(err);
  console.log(result);
  console.log("Build successful");
  if(result)
  {
      docs.pushImage(pushimage, authArguments, function (error,results)
      {
      console.log(error);
      console.log(results);
      console.log("Image Pushed successfully");
      });
  }
});
