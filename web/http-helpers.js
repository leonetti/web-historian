var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  'Content-Type': "text/plain"
};

exports.validExtensions = validExtensions = {
  'html' : 'text/html',
  'css' : 'text/css',
  'txt' : 'text/plain',
  'jpg' : 'img/jpeg',
  'gif' : 'img/gif',
  'png' : 'img/png',
  'js' : 'application/javascript',
  'ico': 'image/x-icon'
};

exports.getHeader = getHeader = function(contentType){
  var header = headers;
  header['Content-Type'] = validExtensions[contentType];
  return header;
}

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  callback = callback || function(x) { return x; };
  // check if the asset is archived

  // otherwise assume in public
  var assetPath = asset; //path.join(__dirname, "public", asset);
  fs.readFile(assetPath, function(err, data){
    var header = getHeader(path.extname(assetPath).replace(".", ""));
    if (err){
      res.writeHead(404, header);
      res.end("File not found");
    } else {
      res.writeHead(200, header);
      res.write(callback(data));
      res.end();
    }
    //callback(data);
  });

  //serve index.html
  //serve loading.html
  //serve styles.css
};

// As you progress, keep thinking about what helper functions you can put here!
