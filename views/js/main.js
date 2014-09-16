
var KEYCODE_ENTER = 13;
var KEYCODE_TAB   = 9;

var $chatInput = $('#chat-input');
var $chatMain = $('#chat-main');
var $main = $('#main');


$.get( "/chatapi")
.done( function (url) {
    chat = io.connect(url);
    
    chat.on('connect', function(msg) {
        console.log('connected to server');
        addChatLog('connected.');
    });        

    chat.on('msg', function(data) {
        console.log(data.name + "> " + data.msg);
        addChatLog('[ ' + data.date + ' ] ' + data.name + "> " + data.msg);
    });
    
    chat.on('disconnect', function(err) {
        console.log(err);
        addChatLog('connection lost');
    });
});


function addChatLog(msg) {
    $chatMain.append("<br>" + msg);
    $chatMain.scrollTop($chatMain[0].scrollHeight);    
}

	
$(document).keypress(function(e) {
    var code = e.keyCode || e.which;
    console.log( "Check focus Pressed" );
    if(code == KEYCODE_ENTER) {
        $chatInput.focus();
    }
});

$chatInput.keypress(function(e) {
    var code = e.keyCode || e.which;
    if(code == KEYCODE_ENTER && $chatInput.val().length) {
        console.log( "Enter Pressed" );
        {
            //addChatLog($chatInput.val());
            chat.emit('msg', $chatInput.val());        
            $chatInput.val('');
        }
    }
});
	
$(document).keypress(function(e) {
    var code = e.keyCode || e.which;
    if(code == KEYCODE_TAB ) {
        console.log( "Tab Pressed" );
        $chatInput.focus();
    }
});

