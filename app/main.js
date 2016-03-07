/**
 * Application entry point
 */

// Load application styles
require ('styles/main.scss');
require('bootstrap-webpack');
require ('bootstrap-material-design');
require('bootstrap-material-design/dist/css/bootstrap-material-design.css');
require('bootstrap-material-design/dist/css/ripples.css');
var cMap = require('./models/charactermap.json');
var PWDGen = require('./lib/PWDGen');
var CharCrypto = require('./lib/CharCrypto');
var cc = new CharCrypto();
$.material.init ();

cMap.forEach (function (char) {
  $ ('#characterList').append ('<option value="' + char.id + '">' + char.name + '</option>')
})

function turnIntoArray(text) {
  return text.trim().split(' ');
}

function getUid(text) {
  var concatUID = text[0].toString('hex') + text[1].toString('hex');
  var UID = new Buffer(concatUID, 'hex');
  UID = UID.toString('hex');
  return UID.slice (0, 6) + UID.slice (8);
}

$('#writeTag').on('click', function(e) {

  var input = $('#inputTag');
  var output = $('#outputTag');

  var data = turnIntoArray(input.val());
  var outputData = data.slice();

  var UID = getUid(data);

  var PWD = PWDGen(UID);
  console.log(PWD);

  var character = $('#characterList').val();

  var encryptedCharacter = cc.encrypt(UID, character);

  var encryptOne = encryptedCharacter.toString('hex').slice(0,8);
  var encryptTwo = encryptedCharacter.toString('hex').slice(8);

  outputData[43] = PWD.toUpperCase();
  outputData[44] = PWD.toUpperCase();
  outputData[36] = encryptOne.toUpperCase();
  outputData[37] = encryptTwo.toUpperCase();
  outputData[38] = '00000000';
  outputData[39] = '00000000';


  output.val(outputData.join(' '));
  e.preventDefault();
});

// ================================
// PUT YOUR CODE HERE
// ================================
