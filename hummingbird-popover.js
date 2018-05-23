(function($){

    //global vars
    var screen_mouse_x = 0;
    var screen_mouse_y = 0;
    var mouseButton = 0;
    var mouseButton_rm = 0;

    var popover_lists = {};
    //var part_of_layer = [];

    var action = "";

    var popover_active = false;
    
    //var popover_list = '<ul class="list-group" style="cursor:pointer;">';
    //var popover_list = '<div class="hummingbird-popover table-responsive text-center" style="cursor:pointer;"><table class="table table-striped table-condensed"><tbody>';
    
    $(document).ready(function() {
	//console.log("test= " + e)
	//create html popover structur from simple list
	//console.log("pre-initialisation")

	//how many ".hummingbird-popover-converter" do we have
	var conv_lists = $(".hummingbird-popover-converter");
	var conv_lists_num = 0;
	$.each(conv_lists,function(){
	    conv_lists_num++;
	    console.log("id= " + $(this).attr("id"))
	    var list_id = $(this).attr("id");

	    //create the popover_lists objects
	    popover_lists[list_id] = [];

	    var part_of_layer = [];


	//});
	//console.log("conv_lists_num= " + conv_lists_num)
	    //console.log(popover_lists)
	
	//get pseudo html popover list
	var poplist = $('#' + list_id).children("li");
	poplist.hide();
	//console.log(poplist)
	//create all popovers content with unique ID's
	$.each(poplist, function(i,e) {
	    var popText = $(this).text();
	    //Regular Expression for all leading hyphens
	    var regExp = /^-+/;

	    //Get leading hyphens
	    var numHyphenMatch = popText.match(regExp);
	    var numHyphen_nextMatch = $(this).next().text().match(regExp);
	    //Get count of leading hyphens
	    //Now supports using hyphens anywhere except for the first character of the label
	    var numHyphen = (numHyphenMatch != null ? numHyphenMatch[0].length : 0);
	    var numHyphen_next = (numHyphen_nextMatch != null ? numHyphen_nextMatch[0].length : 0);
	    // console.log(popText)
	    // console.log("numHyphen= " + numHyphen)
	    // console.log("numHyphen_next= " +numHyphen_next)

	    //remove leading hyphens
	    popText = popText.replace(regExp, "");

	    //add caret right or endnode
	    var caret_right = "";
	    var endnode=" ";
	    if (numHyphen_next > numHyphen) {
		caret_right = '<i class="fa fa-caret-right"></i>';
		//caret_right = 'hallo';
	    } else {
		endnode = "endnode";
	    }
	    

	    //identify the part of the layer
	    if (typeof(part_of_layer[numHyphen]) == "undefined") {
		part_of_layer[numHyphen] = 1;
	    } else {
		part_of_layer[numHyphen] = part_of_layer[numHyphen] +1;
	    }

	    var layer = "layer_" + part_of_layer.toString().replace(/,/g,".");
	    //console.log("I'm in layer: " + layer)


	    //if this popover does not exist -> initialise
	    var index = "0";
	    for (var i=1;i<part_of_layer.length;i++) {
		index = index + "." + part_of_layer[i-1];
	    }
	    //console.log("index= " + index);



	    if (typeof(popover_lists[list_id][index]) == "undefined") {
		popover_lists[list_id][index] = '<div class="hummingbird-popover table-responsive text-left" style="cursor:pointer;"><table id="' + 'tab_' + index  + '" class="hummingbird-popover table table-striped table-condensed popover_table"><tbody>';
		popover_lists[list_id][index] = popover_lists[list_id][index] + '<tr class="' + endnode  + '"  id="' + layer  + '"><td  style="white-space:nowrap;border:none;">' + popText + '</td><td  style="white-space:nowrap;border:none;">' + caret_right + '</td></tr>'
	    } else {
		popover_lists[list_id][index] = popover_lists[list_id][index] + '<tr class="' + endnode  + '"  id="' + layer  +'"><td  style="white-space:nowrap;">' + popText + '</td><td  style="white-space:nowrap">' + caret_right + '</td></tr>'
	    }

	    
	    
	    //if the tree goes up remove last index of part_of_layer
	    //as much as layers are moved up
	    if (numHyphen_next < numHyphen) {
		for (var i=1;i<=(numHyphen-numHyphen_next);i++) {
		    part_of_layer.pop();
		}
	    }
	    
	    
	    

	    
	});

	    console.log(popover_lists)

	    //close the tables
	    $.each(popover_lists[list_id],function(i,e) {
		popover_lists[list_id][i] = popover_lists[list_id][i] + '</tbody></table></div>';
	    });
	    
	});

	//console.log(JSON.stringify(part_of_layer))
	//console.log(popover_lists)

	
    });
    
    
    $.fn.hummingbirdPopover = function(options){

	var bindpoint = $(this);
	var bindpoint_cursor = bindpoint.css("cursor");
	var DataID = $(this).attr("data-id");
	console.log("data-id=" + DataID)
	//console.log("bindpoint has cursor: " + bindpoint_cursor)

	var methodName = options;
	var args = arguments;
	var options = $.extend( {}, $.fn.hummingbirdPopover.defaults, options);
	//initialisation
	if (typeof(methodName) == "undefined" ) {
	    return this.each(function(){
		//console.log("initialisation")
		if (options.mouseButton == "left") {
		    mouseButton = 1;
		    mouseButton_rm = 3;
		}
		if (options.mouseButton == "right") {
		    mouseButton = 3;
		    mouseButton_rm = 1;
		}



				//left mouse button anywhere, except over the popover, closes the popover
				$(document).on("mousedown",function(e){
				    //console.log(e.which)
				    //get the element, which was clicked
				    if (e.which == 1) {
					var target = $(e.target).parent("tr");
					//the click is on a td
					//so parent is the tr
					//console.log("hallo123")
					// console.log((target.is("td")))
					// console.log(typeof(target.is("td")))
					//if this is not a td, then the click was not over the popover -> destroy popover
					//if the click was on a td with class="endnode" then the user has chosen an option -> fire event
					//if the click was on a td, which is not an endnode, then destroy all popover from siblings children of this
					//need === because type boolean
					if (target.is("tr") === false) {
					    $(".hummingbird-popover").popover("destroy");
					    $(".hummingbird-popover").remove();
					    //no popover active
					    popover_active = false;
					} else {
					    if (target.hasClass("endnode")) {
						//for multiple popovers this method (see above, the $(document).on)
						//will be executed for every popover
						//thus we need here to check if the method is executing the
						//clicked popover
						//since there exists only one <a hummingbird-popover
						//it's easy
						// console.log("this is the a!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
						// console.log($("body").find("a.hummingbird-popover"))
						// console.log("this is the data-id of the a")
						// console.log($("body").find("a.hummingbird-popover").attr("data-id"))
						// console.log("this is the data-id of the bindpoint")
						// console.log(DataID)

						var data_id_of_the_a = $("body").find("a.hummingbird-popover").attr("data-id");

						if (data_id_of_the_a == DataID) {
						    $(".hummingbird-popover").popover("destroy");
						    $(".hummingbird-popover").remove();
						    //no popover active
						    popover_active = false;
						    action = target.text();
						    //console.log("action= " + action)
						    //console.log(bindpoint)						
						    bindpoint.trigger("hummingbirdPopover_action",action)
						}
					    } else {
						//console.log("not endnode")
						//console.log(target.parents("div.popover"))
					    }
					}
				    }
				});

		
		//right mousebutton over the bindpoint opens the popover
		bindpoint.on({
		    "contextmenu": function(e) {
			// Stop the context menu
			e.preventDefault();
		    },
		    "mousedown": function(e) {

			if (e.which == mouseButton) {
			    //remove popover
			    $(".hummingbird-popover").popover("destroy");
			    $(".hummingbird-popover").remove();

			    //if a popup exists return from this function
			    if (popover_active) {
				//console.log("popover exists!")
				//no popover active
				popover_active = false;
				return false;
			    }
			    //no popover active
			    popover_active = false;

			    var target = $(e.target);
			    screen_mouse_x = e.pageX;
			    screen_mouse_y = e.pageY;
			    //console.log("screen_mouse_x= " + screen_mouse_x);
			    //console.log("screen_mouse_y= " + screen_mouse_y);

			    //create DOM Element here
			    //it is important to have something in the <a> tag e.g. &nbsp;
			    //add DataID as a class to distinguish on left mouse click on endnode
			    var k = 1
			    $('<a  class="hummingbird-popover" data-id="' + DataID  + '" href="#" id="hummingbird-popover-'+ k  +'" title="<b>Options</b>" data-content="Some content inside the popover">&nbsp;</a>').css({
	    			position: 'absolute',
	    			top: screen_mouse_y,
	    			left: screen_mouse_x,
				zIndex: 1000000,
				cursor: bindpoint_cursor, 
			    }).appendTo("body");
			    //set html to true
			    $('#hummingbird-popover-' + k).popover({html:true});

			    //prevent context menue
			    $('#hummingbird-popover-' + k).on("contextmenu", function(e) {
				e.preventDefault();
			    });
			    //prevent link
			    // $('#hummingbird-popover-' + k).on("contextmenu", function(e) {
			    // 	e.preventDefault();
			    // });


			    //create contend
			    // popover_list = popover_list + '<li class="list-group-item">test1</li>' +
			    // 	'<li class="list-group-item">test1</li>' +
			    // 	'</ul>';
			    // popover_list = popover_list + '<tr><td>test1</td><tr>' +
			    // 	'<tr><td>test1</td><tr>' +
			    // 	'</tbody></table></div>';
			    
			    $('#hummingbird-popover-' + k).attr("data-content",popover_lists[DataID]["0"]);

			    //bind popover to that element and show
			    $('#hummingbird-popover-' + k).popover("show");
			    popover_active = true;

			    //console.log("these are the tr children")
			    var these_trs = $('#hummingbird-popover-' + k).next(".popover").find("tr");
			    //console.log(these_trs)
			    popover_active_tr(these_trs);


			    
			    //add hover and popover functionality to the parent tr of this td
			    function popover_active_tr(these_trs) {

				// $(".popover").on('shown.bs.popover', function(){
				//     console.log('The popover is now fully shown.');
				// });


				these_trs.hover(
				    function(){
					//console.log($(this))
					var str = $(this).attr("id");
					if (typeof(str) !== "undefined") {
					    str = str.split("_");
					    if (str[0] == "layer") {
						$(this).addClass("info");

						
						var index = "0." + str[1];
						var index_id = index.replace(/./g,"");
						//console.log("index= " + index);
						var title = ""
						$(this).popover({html:true,placement:"auto right",content:popover_lists[DataID][index]});
						$(this).popover("show");
						//destroy sibling popovers
						//console.log("siblings tr")
						//console.log($(this).siblings("tr"))
						$(this).siblings("tr").popover("destroy");

						//console.log("these are the new trs")
						var these_trs = $(this).next(".popover").find("tr");
						//console.log(these_trs)
						//add these trs to popover functionality
						popover_active_tr(these_trs);



					    }
					}
				    },
				    function(){
					var str = $(this).attr("id");
					if (typeof(str) !== "undefined") {
					    str = str.split("_");
					    if (str[0] == "layer") {
						$(this).removeClass("info"); //.popover("destroy");
					    }
					}
				    }
				);
			    }
			}
		    }
		});
	    });
	};
	
	
	if (methodName == "method") {
	    return this.each(function(){
		$.fn.hummingbirdPopover.method($(this));
	    });
	}

    }

        //options defaults
    $.fn.hummingbirdPopover.defaults = {
	mouseButton: "left",
	// collapsedSymbol: "fa-plus",
	// collapseAll: true,
	// checkboxes: "enabled",
	// checkboxesGroups: "enabled",
	// checkDoubles: false,
	//checkDisabled: false,   //this is now not changeable and true always
    };


    
    //-------------------Methods---------------//
    $.fn.hummingbirdPopover.method = function(){
	//console.log("method")
	//tree.children("li").children("label").children("input:checkbox").prop('indeterminate', false).prop('checked', false).trigger("click");
    };

	




})(jQuery);



