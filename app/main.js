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

var format = false;

cMap.forEach (function (char) {
  $ ('#characterList').append ('<option value="' + char.id + '">' + char.name + '</option>')
})

function turnIntoArray(text) {
  return text.trim().split(' ');
}

function getUid(text) {
  var concatUID = text[0].toString('hex') + text[1].toString('hex');
  var UID = new Buffer(concatUID, 'hex');
  console.log(UID);
  UID = UID.toString('hex');
  return UID.slice (0, 6) + UID.slice (8);
}

function debug(text) {
  var val = $('#debug').val();
  $('#debug').val(val += text + "\n");
}

function clearDebug() {
  $('#debug').val('');
}

$('#writeTag').on('click', function(e) {

  var input = $('#inputTag');
  var output = $('#outputTag');
  clearDebug();

  debug(format ? 'Format Tag' : 'Write Tag');

  var data = turnIntoArray(input.val());
  var outputData = data.slice();

  var UID = getUid(data);
  debug('Unique Identifier (UID): ' + UID);

  var PWD = PWDGen(UID);
  debug('Password from UID: ' + PWD);

  var character = $('#characterList').val();
  debug('Character selected: ' + $('#characterList option:selected').text());
  debug('Character ID: ' + character);

  var encryptedCharacter = cc.encrypt(UID, character);
  debug('Encrypted Character using UID: ' + encryptedCharacter.toString('hex'));

  var encryptOne = format ? '00000000' : encryptedCharacter.toString('hex').slice(0,8);
  var encryptTwo = format ? '00000000' : encryptedCharacter.toString('hex').slice(8);

  outputData[43] = PWD.toUpperCase();
  outputData[44] = 'AA550000';
  outputData[36] = encryptOne.toUpperCase();
  outputData[37] = encryptTwo.toUpperCase();
  outputData[38] = format? '00010000' : '00000000';
  outputData[39] = '00000000';

  debug('Writing PWD to Page 43: ' + PWD);
  debug('Writing PACK to Page 44: AA550000');

  if (!format) {
    debug('Writing First Encrypted character value to Page 36: ' + encryptOne);
    debug('Writing Second Encrypted character value to Page 37: ' + encryptTwo);
    debug('Writing Blank bytes to Page 38: 00000000');
  } else {
    debug('Writing Blank bytes to Page 36: 00000000');
    debug('Writing Blank bytes to Page 37: 00000000');
    debug('Writing Byte to indicate vehicle to Page 38: 00010000');
  }

  debug('Writing Blank bytes to Page 39: 00000000');

  debug('Outputting results');
  output.val(outputData.join(' '));
  e.preventDefault();
});



// ================================
// FORMAT TAG CHANGE
// ================================

$('#format').on('change', function(e) {
  if ($(this).is(':checked')) {
    $('#charForm').hide();
    format = true;
  } else {
    $('#charForm').show();
    format = false;
  }
})