var fs = require('fs');
var path = require('path');
var _ = require('underscore');

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

  var listFilePath = exports.paths["list"];

  fs.readFile(listFilePath, function(err, data) {
    if (err) throw err;
    var array = data.toString().split("\n");
    callback(array);
  });
};

exports.isUrlInList = function(url, callback){
  callback = callback || _.identity;

  var list = exports.readListOfUrls();
  var listContains = _.contains(list, url);

  callback(listContains);
};

exports.addUrlToList = function(url, callback){
  callback = callback || _.identity;
  
  var listFilePath = exports.paths["list"];
  var newInfo = fs.appendFile(listFilePath, url);
  console.log(callback);

  callback(newInfo);

};

exports.isUrlArchived = function(){
  var archivePath = exports.paths['archivedSites'];


};

exports.downloadUrls = function(){
};
