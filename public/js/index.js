$(function() {
  // Initialize variables
  var $messages = $('#messages'); // Messages area
  var $namemessages = $('#namemessages'); // Messages area
 
  var socket = io();

  function addParticipantsMessage (data) {
    var message = 'Hey, ';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
  }

// Log a message
  function log (message, options) {
    //$messages.html('');
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  function namelog (message, options) {
    $namemessages.html('');
    var $el = $('<li>').addClass('log').text(message);
    $namemessages.append($el);
  }



  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  function addMessageElement (el, options) {
    var $el = $(el);
    //$messages.empty();
    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(300);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

// Click events

  // Socket events

  // Whenever the server emits 'login', log the login message
  socket.on('login', function (data) {
    connected = true;
    $messages.empty();
    // Display the welcome message
    var message = "Welcome to Drawing Melody World!! ";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });


  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    namelog(data.username + ' joined');
    //addParticipantsMessage(data);
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    namelog(data.username + ' left');
    //addParticipantsMessage(data);
  });
});
