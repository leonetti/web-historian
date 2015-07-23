var path = require('path');
var http = require('http');
var url = require('url');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
var fs = require('fs');
// require more modules/folders here!


var actions = {
  'GET': function(request, response){

    var reqURL = url.parse(request.url).href;
    // check if the file is archived
    var checkURL = archive.paths.archivedSites + "/" + reqURL;

    // if not get the url
    
    var extension = path.extname(reqURL);

    /*var header = httpHelpers.getHeader(extension.replace(".", ""));
    response.writeHead(200, header);*/

    if(reqURL[0] === '/'){
      //httpHelpers.serveAssets(response, "index.html");
      if (reqURL.length === 1){
        httpHelpers.serveAssets(response, path.join(__dirname, "public", "index.html"));
      } else {
        httpHelpers.serveAssets(response, path.join(__dirname, "public", path.basename(reqURL)));
      }
    } else {
      archive.isUrlArchived(reqURL, function(is) {
        if (!is) {
          httpHelpers.serveAssets(response, path.join(archive.paths['archivedSites'], reqURL));
        }
      });
    }
 
  },
  'POST': function(request, response){

    var chunk = '';
    request.on('data', function (data) {
      chunk += data;
    });


    request.on('end', function(){
      var reqURL = chunk.replace('url=', '');
 

      archive.isUrlInList(reqURL, function(isInList) {
        if (!isInList) {
          archive.addUrlToList(reqURL, function() {
            response.writeHead(302, http.headers);
            response.end();  
          });  
        } else {
          response.writeHead(302, http.headers);
          httpHelpers.serveAssets(response, path.join(__dirname, "public", "loading.html"));
        }
      })
    }); 

   
    // archive.isUrlArchived(reqURL, function(is) {
    //   if(!is) {
    //     archive.addUrlToList(reqURL);
    //   }
    // });
  },
  'OPTIONS': function(request, response){
    /*sendResponse(response);*/
  } 
};


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action){
    action(req, res);
  } else {
    sendResponse(res, "Not Found", 404);
    res.writeHead(404, httpHelpers.headers);
    res.end("Not Found");
  }
  // res.end(archive.paths.list);
};


exports.sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, httpHelpers.headers);
  //res.write(data);
  res.end(data);
  //res.end(archive.paths.list);
};