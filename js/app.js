jQuery(function($) {
    $('#terminal').terminal("rpc_demo.php", {
        login: true,
        greetings: "You are authenticated"});


    jQuery(function($) {
        function progress(percent, width) {
            var size = Math.round(width*percent/100);
            var left = '', taken = '', i;
            for (i=size; i--;) {
                taken += '=';
            }
            if (taken.length > 0) {
                taken = taken.replace(/=$/, '>');
            }
            for (i=width-size; i--;) {
                left += ' ';
            }
            return '[' + taken + left + '] ' + percent + '%';
        }
        var animation = false;
        var timer;
        var prompt;
        var string;
        $('body').terminal(function(command, term) {
            var cmd = $.terminal.parse_command(command);
            if (cmd.name == 'progress') {
                var i = 0, size = cmd.args[0];
                prompt = term.get_prompt();
                string = progress(0, size);
                term.set_prompt(progress);
                animation = true;
                (function loop() {
                    string = progress(i++, size);
                    term.set_prompt(string);
                    if (i < 100) {
                        timer = setTimeout(loop, 100);
                    } else {
                        term.echo(progress(i, size) + ' [[b;green;]OK]')
                            .set_prompt(prompt);
                        animation = false
                    }
                })();
            }
        }, {
            keydown: function(e, term) {
                if (animation) {
                    if (e.which == 68 && e.ctrlKey) { // CTRL+D
                        clearTimeout(timer);
                        animation = false;
                        term.echo(string + ' [[b;red;]FAIL]')
                            .set_prompt(prompt);
                    }
                    return false;
                }
            }
        });
    });


});