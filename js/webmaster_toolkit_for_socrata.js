/*
Add <script src="https://fixspd.org/js/webmaster_toolkit_for_socrata.js"></script> to your webpage
To add a count(*) add something similar to
<p>There are <span class="socrata_count" data-url="https://data.seattle.gov/resource/a4j2-uu8v.json?$select=count(*)&$where=completed_date IS NULL"></span> open Seattle Police records requests.</p>

*/
if (typeof console == "undefined") {
    this.console = {log: function() {}};
}

function updateItemWithSimpleCount(item, data) {
  var url = item.attr('data-url');    
  item.html(data[0][Object.keys(data[0])[0]]+'<i class="fa fa-info-circle info" rel="tooltip" data-original-title=\'<a href="'+url+'">'+url+'</a>\'></i>');
  $("[rel=tooltip]").tooltip({html:true});
    
}

function handleSimpleCount() {
  $.each($('.socrata_count'), function(item) {
    console.log($(this).attr('data-url'))
    var socrataUrl = $(this).attr('data-url');
    var item = $(this)
    $.get(socrataUrl, function(data) {
      updateItemWithSimpleCount(item, data);
    });
  });
  
}

function handleSimpleCountsSum() {
  $.each($('.socrata_sum_of_counts'), function(item) {
    console.log($(this).attr('data-urls'))
    var socrataUrls = $(this).attr('data-urls');
    var item = $(this);
    var total = 0;
    $.each(socrataUrls.split(';'), function(i, url) {
        var data = JSON.parse($.ajax({
            type: "GET",
            url: url,
            async: false
        }).responseText);
        total += parseInt(data[0][Object.keys(data[0])[0]]);
    });
    item.html(total+'<i class="fa fa-info-circle info"></i>');
  });
}
function main() {
    var plugins = ['https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js'];
    $.each(plugins, function(i,url){
        if (url.endsWith('.js')) {
            var script = document.createElement("SCRIPT");
            script.src = url;
            script.type = 'text/javascript';
            document.getElementsByTagName("head")[0].appendChild(script);
        } else  {
            $('head').append('<link rel="stylesheet" type="text/css" href="'+url+'">');
        }
    })
    handleSimpleCount();
    handleSimpleCountsSum();
    
    


}

if (!window.jQuery) {
// Anonymous "self-invoking" function
(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js';
    script.type = 'text/javascript';
    document.getElementsByTagName("head")[0].appendChild(script);

    // Poll for jQuery to come into existance
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };

    // Start polling...
    checkReady(function($) {
        main();
    });
})();
} else {
    main();
}
