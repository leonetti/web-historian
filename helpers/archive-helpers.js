var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){

  callback = callback || _.identity;
  var array = [];
  var listFilePath = exports.paths["list"];

  fs.readFile(listFilePath, function(err, data) {
    if (err) throw err;
    /*var array = data.toString().split("\n");
    callback(array);*/
    array = data.toString().split("\n");
    callback(array);
  });
  
};

exports.isUrlInList = function(url, callback){
  callback = callback || _.identity;
  //var listContains = false;
  var result = false;

  var listContains = exports.readListOfUrls(function(urls){
    if (urls.indexOf(url) !== -1) {
      result = true;
    }
    callback(result);
  });
  //var listContains = _.contains(list, url + "\n");

};

exports.addUrlToList = function(url, callback){
  callback = callback || _.identity;

  var listFilePath = exports.paths["list"];
  var newInfo = fs.appendFile(listFilePath, url + "\n");
  callback(newInfo);

};

exports.isUrlArchived = function(url, callback){
  callback = callback || _.identity;
  var archivePath = exports.paths['archivedSites'] + '/' + url;
  var result = false;

  fs.exists(archivePath, function(exists){
    if(exists) {
      result = true;
    }
  });
  callback(result);
};

exports.downloadUrls = function(list){

  var sitesPath = exports.paths['archivedSites'];

  list.forEach(function(url){
    if (!url) { return; }
    //fs.writeFile(path.join(sitesPath, listItem), '');
    request("http://" + url).pipe(fs.createWriteStream(exports.paths.archivedSites + "/" + url));
  });
  return true;
};
