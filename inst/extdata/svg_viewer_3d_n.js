var animation_length = 0;
var frame_width = 10;
var object_name = 'shape_viewer_3d';
var max_arrowhead_size = 15;

view_box = new Array();
window_properties = new Array();

var eyez = 300;
var zoom = 280;

var anim_n = 0;
var arrow_angle = 25;
var currentEvent = "nothing";
var depth;
var globalkeypress = '';
var IE = document.all ? true : false
var initiate = 0;
var maxzoom = -200;
var margin = 40;
var zoom_speed = 5;
var sort_shapes = 1;
var stop_anim = 0;
var svgns = "http://www.w3.org/2000/svg";
var tempX = 0;
var tempY = 0;
var mousedown = 0;
var path_max_iter = 500; // Also max iteration for number of animation duration

var point_color_r = 100;
var point_color_g = 0;
var point_color_b = 0;
var point_opacity = 0.5;
var point_radius = 4;

var line_color_r = 0;
var line_color_g = 0;
var line_color_b = 0;
var line_width = 1;
var line_opacity = 1;

var prevX, prevY;
var ajax_output;

test_array = new Array();

zindex = new Array();
Arrows = new Array();
Images = new Array();
Lines = new Array();
LinesC = new Array();
Paths = new Array();
PathsC = new Array();
Points = new Array();
points_i_to_k = new Array();
RefPoints = new Array();
Shapes = new Array();
Textlinks = new Array();

AnimatePoints = new Array();
AnimateArrows = new Array();
AnimateLines = new Array();

Translate = new Array();
Rotate = new Array();

function correctImagePosition(new_x,new_y,new_w,new_h,ow,oh){

	var x = new_x;
	var y = new_y;
	var w = new_w;
	var h = new_h;

	if(new_w < ow){w = ow;}
	if(new_h < oh){h = oh;}
	if(new_w < ow || new_h < oh){
		x = margin;
		y = margin;
		return {x : x, y : y, w : w, h : h};
	}
	if(new_x > margin){x = margin;}
	if(new_y > margin){y = margin;}
	if((new_x + new_w) < (margin + ow)){x = margin + ow - new_w;}
	if((new_y + new_h) < (margin + oh)){y = margin + oh - new_h;}

	return {x : x, y : y, w : w, h : h};
}

function detectKeyDown(e){
	var evt = e || window.event;
	if(evt.keyCode==82){globalkeypress = 'r';} // r
	if(evt.shiftKey === true){
		if(globalkeypress == 'r'){
			if(evt.keyCode==37){setKeyEvent("rotateYaxis", 45);} // left arrow
			if(evt.keyCode==39){setKeyEvent("rotateYaxis", -45);} // right arrow
			if(evt.keyCode==38){setKeyEvent("rotateXaxis", 45);} // up arrow
			if(evt.keyCode==40){setKeyEvent("rotateXaxis", -45);} // down arrow
			if(evt.keyCode==74){setKeyEvent("rotateZaxis", -45);} // j
			if(evt.keyCode==75){setKeyEvent("rotateZaxis", 45);} // k
		}else{
			if(evt.keyCode==37){setKeyEvent("translateX", -10);} // left arrow
			if(evt.keyCode==39){setKeyEvent("translateX", 10);} // right arrow
			if(evt.keyCode==38){setKeyEvent("translateY", 10);} // up arrow
			if(evt.keyCode==40){setKeyEvent("translateY", -10);} // down arrow
			if(evt.keyCode==74){setKeyEvent("translateZ", 10);} // j
			if(evt.keyCode==75){setKeyEvent("translateZ", -10);} // k
		}
	}else{
		if(evt.metaKey === true){
		}else{
			if(globalkeypress == 'r'){
				if(evt.keyCode==37){setKeyEvent("rotateYaxis", 10);} // left arrow
				if(evt.keyCode==39){setKeyEvent("rotateYaxis", -10);} // right arrow
				if(evt.keyCode==38){setKeyEvent("rotateXaxis", 10);} // up arrow
				if(evt.keyCode==40){setKeyEvent("rotateXaxis", -10);} // down arrow
				if(evt.keyCode==74){setKeyEvent("rotateZaxis", -10);} // j
				if(evt.keyCode==75){setKeyEvent("rotateZaxis", 10);} // k
			}else{
				if(evt.keyCode==37){setKeyEvent("translateX", -1);} // left arrow
				if(evt.keyCode==39){setKeyEvent("translateX", 1);} // right arrow
				if(evt.keyCode==38){setKeyEvent("translateY", 1);} // up arrow
				if(evt.keyCode==40){setKeyEvent("translateY", -1);} // down arrow
				if(evt.keyCode==74){setKeyEvent("translateZ", 1);} // j
				if(evt.keyCode==75){setKeyEvent("translateZ", -1);} // k
				//if(evt.keyCode==80){} // p
				if(evt.keyCode==32){setKeyEvent("playPauseAnimation");} // space-bar
			}
		}
	}
}

function doEvent(){
	if (currentEvent == "callZoomIn"){
		if(zoom <= 400){
			zoom = zoom + 4;
		}
	}

	if (currentEvent == "callZoomOut"){
		if(zoom >= 175){
			zoom = zoom - 4;
		}
	}

	if(currentEvent == "translateX"){
		translate(Arrows,d,0,0);
		translate(Lines,d,0,0);
		translate(Paths,d,0,0);
		translate(Points,d,0,0);
		translate(Textlinks,d,0,0);
		translate(RefPoints,d,0,0);
		translate(AnimatePoints,d,0,0);
		translate(AnimateArrows,d,0,0);
		translate(AnimateLines,d,0,0);
	}
	if(currentEvent == "translateY"){
		translate(Arrows,0,d,0);
		translate(Lines,0,d,0);
		translate(Paths,0,d,0);
		translate(Points,0,d,0);
		translate(Textlinks,0,d,0);
		translate(RefPoints,0,d,0);
		translate(AnimatePoints,0,d,0);
		translate(AnimateArrows,0,d,0);
		translate(AnimateLines,0,d,0);
	}
	if(currentEvent == "translateZ"){
		translate(Arrows,0,0,-d);
		translate(Lines,0,0,-d);
		translate(Paths,0,0,-d);
		translate(Points,0,0,-d);
		translate(Textlinks,0,0,-d);
		translate(RefPoints,0,0,-d);
		translate(AnimatePoints,0,0,-d);
		translate(AnimateArrows,0,0,-d);
		translate(AnimateLines,0,0,-d);
	}

	if (currentEvent == "rotateXaxis" || currentEvent == "rotateYaxis" || currentEvent == "rotateZaxis"){
		eval(currentEvent + '(Arrows, d)');
		eval(currentEvent + '(Lines, d)');
		eval(currentEvent + '(Paths, d)');
		eval(currentEvent + '(Points, d)');
		eval(currentEvent + '(Textlinks, d)');
		eval(currentEvent + '(RefPoints, d)');
		eval(currentEvent + '(AnimatePoints, d)');
		eval(currentEvent + '(AnimateArrows, d)');
		eval(currentEvent + '(AnimateLines, d)');
	}

	if (currentEvent == "playPauseAnimation"){
		if(stop_anim == 1){stop_anim = 0;}else{stop_anim = 1;}
		playPauseAnimation();
	}
}

function fitShapesToWindow(){
	var x = new Array();
	var y = new Array();
	var z = new Array();

	var i, j, k;
	k = 0;
	
	if(AnimatePoints.length > 0){
		for(i in AnimatePoints){
			for(j in AnimatePoints[i]){
				if(!is_numeric(j)) continue;
				if(isNaN(AnimatePoints[i][j][0])) continue;
				x[k] = AnimatePoints[i][j][0];
				y[k] = AnimatePoints[i][j][1];
				z[k] = AnimatePoints[i][j][2];
				k++;
			}
		}
	}
	if(AnimateArrows.length > 0){
		for(i in AnimateArrows){
			for(j in AnimateArrows[i]){
				if(!is_numeric(j)) continue;
				if(isNaN(AnimateArrows[i][j][0])) continue;
				x[k] = AnimateArrows[i][j][0];
				y[k] = AnimateArrows[i][j][1];
				z[k] = AnimateArrows[i][j][2];
				k++;
				x[k] = AnimateArrows[i][j][3];
				y[k] = AnimateArrows[i][j][4];
				z[k] = AnimateArrows[i][j][5];
				k++;
			}
		}
	}
	if(AnimateLines.length > 0){
		for(i in AnimateLines){
			for(j in AnimateLines[i]){
				if(!is_numeric(j)) continue;
				if(isNaN(AnimateLines[i][j][0])) continue;
				x[k] = AnimateLines[i][j][0];
				y[k] = AnimateLines[i][j][1];
				z[k] = AnimateLines[i][j][2];
				k++;
				x[k] = AnimateLines[i][j][3];
				y[k] = AnimateLines[i][j][4];
				z[k] = AnimateLines[i][j][5];
				k++;
			}
		}
	}
	for(i in Arrows){
		if(isNaN(Arrows[i][0][0])) continue;
		x[k] = Arrows[i][0][0];
		y[k] = Arrows[i][0][1];
		z[k] = Arrows[i][0][2];
		k++;
		x[k] = Arrows[i][1][0];
		y[k] = Arrows[i][1][1];
		z[k] = Arrows[i][1][2];
		k++;
	}
	for(i in Points){
		if(isNaN(Points[i][0])) continue;
		x[k] = Points[i][0];
		y[k] = Points[i][1];
		z[k] = Points[i][2];
		k++;
	}
	for(i in Paths){
		var j = 0;
		while(j < Paths[i].length){
			if(!Paths[i][j]){break;}
			if(Paths[i][j][0] == 'Z'){break;}
			if(isNaN(Paths[i][j][1])) continue;
			x[k] = Paths[i][j][1];
			y[k] = Paths[i][j][2];
			z[k] = Paths[i][j][3];
			j++;
			k++;
		}
	}
	for(i in Lines){
		if(isNaN(Lines[i][0][0])) continue;
		x[k] = Lines[i][0][0];
		y[k] = Lines[i][0][1];
		z[k] = Lines[i][0][2];
		k++;
		x[k] = Lines[i][1][0];
		y[k] = Lines[i][1][1];
		z[k] = Lines[i][1][2];
		k++;
	}
	for(i in Textlinks){
		if(Textlinks[i].text_size){var text_length = Textlinks[i].text_size*Textlinks[i].text.length*0.6;}else{var text_length = 0;}
		if(isNaN(Textlinks[i][0])) continue;
		x[k] = Textlinks[i][0];// + text_length;
		y[k] = Textlinks[i][1];
		z[k] = Textlinks[i][2];
		k++;
	}

	x.sort(sortasc);
	y.sort(sortasc);
	z.sort(sortasc);

	x_range = (x[x.length-1] - x[0]);
	y_range = (y[y.length-1] - y[0]);
	z_range = (z[z.length-1] - z[0]);
	if(isNaN(x_range) || isNaN(y_range) || isNaN(z_range)) return;

	depth = Math.floor(zoom * (eyez - maxzoom) / 100 + eyez);
	var mm_to_pixel = (-(depth - eyez) / - eyez);

	var object = document.getElementById(object_name);
	var view_width = getWindowWidth() - 2*margin;
	var view_height = getWindowHeight() - 2*margin;

	var rw = (x_range*mm_to_pixel)/view_width;
	var rh = (y_range*mm_to_pixel)/view_height;
	var rd = (z_range*mm_to_pixel)/view_height;

	if(x_range*mm_to_pixel > view_width){
		if(rw > rh){
			if(rd > rw){var factor = 1/rd*2;}else{var factor = 1/rw;}
		}else{
			if(rd > rh){var factor = 1/rd*2;}else{var factor = 1/rh;}		
		}
	}else{
		if(rw > rh){
			if(rd > rw){var factor = 1/rd;}else{var factor = 1/rw;}
		}else{
			if(rd > rh){var factor = 1/rd;}else{var factor = 1/rh;}		
		}
	}

	translate(Arrows, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
	translate(Lines, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
	translate(Paths, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
	translate(Points, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
	translate(Textlinks, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));

	scale(Arrows, factor);
	scale(Lines, factor);
	scale(Paths, factor);
	scale(Points, factor);
	scale(Textlinks, factor);
	scale(RefPoints, factor);

	if(animation_length > 1){
		translate(AnimatePoints, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
		translate(AnimateArrows, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
		translate(AnimateLines, -(x[0] + x_range/2), -(y[0] + y_range/2), -(z[0] + z_range/2));
		scale(AnimatePoints, factor);
		scale(AnimateArrows, factor);
		scale(AnimateLines, factor);
	}
}

function getMouseMoveXY(e){
	svgDocument.onmousedown = function(){
		initialX = e.clientX;
		initialY = e.clientY;
		mousedown = 1;
	}
		
	if(initiate == 0){
		prevX = initialX;
		prevY = initialY;
	}
	initiate = 1;

	if(IE){
		tempX = e.clientX + document.body.scrollLeft;
		tempY = e.clientY + document.body.scrollTop;
	}else{
		tempX = e.pageX;
		tempY = e.pageY;
	}  

	if (tempX < 0){tempX = 0;}
	if (tempY < 0){tempY = 0;}  
	if(mousedown == 1 && globalkeypress == ''){
		distX = tempX - prevX;
		distY = prevY - tempY;
		
		if(distX !== 0){setKeyEvent("translateX",Math.round(distX/4.667));}  // manually calibrated
		if(distY !== 0){setKeyEvent("translateY",Math.round(distY/4.667));}
	}
	if(mousedown == 1 && globalkeypress == 'r'){
		distX = tempX - prevX;
		distY = prevY - tempY;
		
		if(distX !== 0){setKeyEvent("rotateYaxis",Math.round(-distX));}
		if(distY !== 0){setKeyEvent("rotateXaxis",Math.round(distY));}
	}

	svgDocument.onmouseup = function(){mousedown = 0;}

	prevX = tempX
	prevY = tempY

	return false;
}

function get_transformations(){

	if(document.getElementsByTagName("transformation").length){
		for(i = 0;i < document.getElementsByTagName("transformation").length;i++){

			var svg_elem = document.getElementsByTagName("transformation")[i];

			// SET TRANSLATE ARRAY
			if(svg_elem.getAttribute("translate") !== null) Translate = Translate.concat(string_to_array_cs(svg_elem.getAttribute("translate")))

			// SET ROTATE ARRAY
			if(svg_elem.getAttribute("rotate") !== null) Rotate = Rotate.concat(string_to_array_cs(svg_elem.getAttribute("rotate")))
		}
	}
}

function get_shapes(){

	var i, j, k, m;
	var t_arr, n_str, c_str;

	if(document.getElementsByTagName("pathC").length){
		for(i = 0;i < document.getElementsByTagName("pathC").length;i++){

			var svg_elem = document.getElementsByTagName("pathC")[i];

			// SET ID AND ATTRIBUTES
			PathsC[i] = new Array();
			PathsC[i].id = "PathsC" + (PathsC.length - 1);

			if(svg_elem.getAttribute("fill") == null){PathsC[i].fill = "none";}else{PathsC[i].fill = svg_elem.getAttribute("fill");}
			if(svg_elem.getAttribute("fill-opacity") == null){PathsC[i].fill_opacity = 1;}else{PathsC[i].fill_opacity = parseFloat(svg_elem.getAttribute("fill-opacity"));}
			if(svg_elem.getAttribute("stroke") == null){PathsC[i].stroke = "black";}else{PathsC[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){PathsC[i].stroke_width = 1;}else{PathsC[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("stroke-opacity") == null){PathsC[i].stroke_opacity = 1;}else{PathsC[i].stroke_opacity = parseFloat(svg_elem.getAttribute("stroke-opacity"));}
			if(svg_elem.getAttribute("z-index") == null){PathsC[i].z_index = 0;}else{PathsC[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){PathsC[i].layer = "Default";}else{PathsC[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){PathsC[i].layer_group = "Default";}else{PathsC[i].layer_group = svg_elem.getAttribute("layer-group");}

			PathsC[i].d = svg_elem.getAttribute("d");
			PathsC[i][0] = PathsC[i].d.split(" ");
		}
	}

	if(document.getElementsByTagName("path").length){
		for(i = 0;i < document.getElementsByTagName("path").length;i++){

			var svg_elem = document.getElementsByTagName("path")[i];

			// SET ID AND ATTRIBUTES
			Paths[i] = new Array();

			// CREATE ARRAY STRUCTURE FROM PATH
			Paths[i] = svg_path_string_to_array(svg_elem.getAttribute("d"));

			Paths[i].id = "Paths" + (Paths.length - 1);

			if(svg_elem.getAttribute("fill") == null){Paths[i].fill = "none";}else{Paths[i].fill = svg_elem.getAttribute("fill");}
			if(svg_elem.getAttribute("fill-opacity") == null){Paths[i].fill_opacity = 1;}else{Paths[i].fill_opacity = parseFloat(svg_elem.getAttribute("fill-opacity"));}
			if(svg_elem.getAttribute("stroke") == null){Paths[i].stroke = "black";}else{Paths[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){Paths[i].stroke_width = 1;}else{Paths[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("stroke-opacity") == null){Paths[i].stroke_opacity = 1;}else{Paths[i].stroke_opacity = parseFloat(svg_elem.getAttribute("stroke-opacity"));}
			if(svg_elem.getAttribute("z-index") == null){Paths[i].z_index = 0;}else{Paths[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){Paths[i].layer = "Default";}else{Paths[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){Paths[i].layer_group = "Default";}else{Paths[i].layer_group = svg_elem.getAttribute("layer-group");}
		}
	}

	if(document.getElementsByTagName("pathC").length){
		for(i = 0;i < document.getElementsByTagName("pathC").length;i++){

			var svg_elem = document.getElementsByTagName("pathC")[i];

			// SET ID AND ATTRIBUTES
			PathsC[i] = new Array();
			PathsC[i].id = "PathsC" + (PathsC.length - 1);

			if(svg_elem.getAttribute("fill") == null){PathsC[i].fill = "none";}else{PathsC[i].fill = svg_elem.getAttribute("fill");}
			if(svg_elem.getAttribute("fill-opacity") == null){PathsC[i].fill_opacity = 1;}else{PathsC[i].fill_opacity = parseFloat(svg_elem.getAttribute("fill-opacity"));}
			if(svg_elem.getAttribute("stroke") == null){PathsC[i].stroke = "black";}else{PathsC[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){PathsC[i].stroke_width = 1;}else{PathsC[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("stroke-opacity") == null){PathsC[i].stroke_opacity = 1;}else{PathsC[i].stroke_opacity = parseFloat(svg_elem.getAttribute("stroke-opacity"));}
			if(svg_elem.getAttribute("z-index") == null){PathsC[i].z_index = 0;}else{PathsC[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){PathsC[i].layer = "Default";}else{PathsC[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){PathsC[i].layer_group = "Default";}else{PathsC[i].layer_group = svg_elem.getAttribute("layer-group");}

			PathsC[i].d = svg_elem.getAttribute("d");
			PathsC[i][0] = PathsC[i].d.split(" ");
		}
	}

	if(document.getElementsByTagName("line").length){
		for(i = 0;i < document.getElementsByTagName("line").length;i++){

			var svg_elem = document.getElementsByTagName("line")[i];

			// SET ID AND ATTRIBUTES
			Lines[i] = new Array();
			Lines[i].id = "Lines" + (Lines.length - 1);
			Lines[i][0] = new Array(parseFloat(svg_elem.getAttribute("x1")), parseFloat(svg_elem.getAttribute("y1")), parseFloat(svg_elem.getAttribute("z1")));
			Lines[i][1] = new Array(parseFloat(svg_elem.getAttribute("x2")), parseFloat(svg_elem.getAttribute("y2")), parseFloat(svg_elem.getAttribute("z2")));

			if(svg_elem.getAttribute("stroke") == null){Lines[i].stroke = "black";}else{Lines[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){Lines[i].stroke_width = 1;}else{Lines[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("opacity") == null){Lines[i].opacity = 1;}else{Lines[i].opacity = parseFloat(svg_elem.getAttribute("opacity"));}
			if(svg_elem.getAttribute("z-index") == null){Lines[i].z_index = 0;}else{Lines[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){Lines[i].layer = "Default";}else{Lines[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){Lines[i].layer_group = "Default";}else{Lines[i].layer_group = svg_elem.getAttribute("layer-group");}
			if(svg_elem.getAttribute("animate") !== null){
				j = AnimateLines.length;
				AnimateLines[j] = string_to_array_cs(svg_elem.getAttribute("animate"));
				AnimateLines[j].idx = i;
			}
		}
	}

	if(document.getElementsByTagName("arrow").length){
		for(i = 0;i < document.getElementsByTagName("arrow").length;i++){

			var svg_elem = document.getElementsByTagName("arrow")[i];

			// SET ID AND ATTRIBUTES
			Arrows[i] = new Array();
			Arrows[i].id = "Arrows" + (Arrows.length - 1);
			Arrows[i][0] = new Array(parseFloat(svg_elem.getAttribute("x1")), parseFloat(svg_elem.getAttribute("y1")), parseFloat(svg_elem.getAttribute("z1")));
			Arrows[i][1] = new Array(parseFloat(svg_elem.getAttribute("x2")), parseFloat(svg_elem.getAttribute("y2")), parseFloat(svg_elem.getAttribute("z2")));

			if(svg_elem.getAttribute("s") == null){Arrows[i].s = 1;}else{Arrows[i].s = parseFloat(svg_elem.getAttribute("s"));}
			if(svg_elem.getAttribute("stroke") == null){Arrows[i].stroke = "black";}else{Arrows[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){Arrows[i].stroke_width = 1;}else{Arrows[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("stroke-opacity") == null){Arrows[i].stroke_opacity = 1;}else{Arrows[i].stroke_opacity = parseFloat(svg_elem.getAttribute("stroke-opacity"));}
			if(svg_elem.getAttribute("vis") == null){Arrows[i].vis = 1;}else{Arrows[i].vis = svg_elem.getAttribute("vis");}
			if(svg_elem.getAttribute("z-index") == null){Arrows[i].z_index = 0;}else{Arrows[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){Arrows[i].layer = "Default";}else{Arrows[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){Arrows[i].layer_group = "Default";}else{Arrows[i].layer_group = svg_elem.getAttribute("layer-group");}
			if(svg_elem.getAttribute("animate") !== null){
				j = AnimateArrows.length;
				AnimateArrows[j] = string_to_array_cs(svg_elem.getAttribute("animate"));
				AnimateArrows[j].idx = i;
			}
		}
	}

	if(document.getElementsByTagName("text").length){
		for(i = 0;i < document.getElementsByTagName("text").length;i++){

			var svg_elem = document.getElementsByTagName("text")[i];

			// SET ID AND ATTRIBUTES
			Textlinks[i] = new Array(parseFloat(svg_elem.getAttribute("x")), parseFloat(svg_elem.getAttribute("y")), parseFloat(svg_elem.getAttribute("z")));
			Textlinks[i].id = "Textlinks" + (Textlinks.length - 1);
			Textlinks[i].text = svg_elem.childNodes[0].nodeValue;
			//Textlinks[i][0] = new Array(parseFloat(svg_elem.getAttribute("x")), parseFloat(svg_elem.getAttribute("y")), parseFloat(svg_elem.getAttribute("z")));

			if(svg_elem.getAttribute("text-anchor") == null){Textlinks[i].text_anchor = "middle";}else{Textlinks[i].text_anchor = svg_elem.getAttribute("text-anchor");}
			if(svg_elem.getAttribute("text-size") !== null){Textlinks[i].text_size = parseFloat(svg_elem.getAttribute("text-size"));}
			if(svg_elem.getAttribute("font-size") !== null){Textlinks[i].font_size = parseFloat(svg_elem.getAttribute("font-size"));}
			if(svg_elem.getAttribute("text-size") == null && svg_elem.getAttribute("font-size") == null){Textlinks[i].font_size = 12;}
			if(svg_elem.getAttribute("fill") == null){Textlinks[i].fill = "black";}else{Textlinks[i].fill = svg_elem.getAttribute("fill");}
			if(svg_elem.getAttribute("opacity") == null){Textlinks[i].opacity = 1;}else{Textlinks[i].opacity = parseFloat(svg_elem.getAttribute("opacity"));}
			if(svg_elem.getAttribute("font-family") == null){Textlinks[i].font_name = "Franklin Gothic Book";}else{Textlinks[i].font_name = svg_elem.getAttribute("font-family");}
			if(svg_elem.getAttribute("font-style") == null){Textlinks[i].font_style = "";}else{Textlinks[i].font_style = svg_elem.getAttribute("font-style");}
			if(svg_elem.getAttribute("font-weight") == null){Textlinks[i].font_weight = "";}else{Textlinks[i].font_weight = svg_elem.getAttribute("font-weight");}
			if(svg_elem.getAttribute("letter-spacing") == null){Textlinks[i].letter_spacing = 0;}else{Textlinks[i].letter_spacing = parseFloat(svg_elem.getAttribute("letter-spacing"));}
			if(svg_elem.getAttribute("z-index") == null){Textlinks[i].z_index = 0;}else{Textlinks[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){Textlinks[i].layer = "Default";}else{Textlinks[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){Textlinks[i].layer_group = "Default";}else{Textlinks[i].layer_group = svg_elem.getAttribute("layer-group");}
			if(svg_elem.getAttribute("vertical") == null || svg_elem.getAttribute("vertical") == "" || svg_elem.getAttribute("vertical") == 0){Textlinks[i].vertical = 0;}else{Textlinks[i].vertical = 1;}
		}
	}

	if(document.getElementsByTagName("circle").length){
		for(i = 0;i < document.getElementsByTagName("circle").length;i++){

			var svg_elem = document.getElementsByTagName("circle")[i];

			// SET ID AND ATTRIBUTES
			Points[i] = new Array(parseFloat(svg_elem.getAttribute("cx")), parseFloat(svg_elem.getAttribute("cy")), parseFloat(svg_elem.getAttribute("cz")));
			Points[i].id = "Points" + (Points.length - 1);

			if(svg_elem.getAttribute("r") == null){Points[i].radius = 1;}else{Points[i].radius = parseFloat(svg_elem.getAttribute("r"));}
			if(svg_elem.getAttribute("fill") == null){Points[i].fill = "black";}else{Points[i].fill = svg_elem.getAttribute("fill");}
			if(svg_elem.getAttribute("stroke") == null){Points[i].stroke = "black";}else{Points[i].stroke = svg_elem.getAttribute("stroke");}
			if(svg_elem.getAttribute("stroke-width") == null){Points[i].stroke_width = 1;}else{Points[i].stroke_width = parseFloat(svg_elem.getAttribute("stroke-width"));}
			if(svg_elem.getAttribute("stroke-opacity") == null){Points[i].stroke_opacity = 1;}else{Points[i].stroke_opacity = parseFloat(svg_elem.getAttribute("stroke-opacity"));}
			if(svg_elem.getAttribute("fill-opacity") == null){Points[i].fill_opacity = 1;}else{Points[i].fill_opacity = parseFloat(svg_elem.getAttribute("fill-opacity"));}
			if(svg_elem.getAttribute("z-index") == null){Points[i].z_index = 0;}else{Points[i].z_index = parseFloat(svg_elem.getAttribute("z-index"));}
			if(svg_elem.getAttribute("layer") == null || svg_elem.getAttribute("layer") == ""){Points[i].layer = "Default";}else{Points[i].layer = svg_elem.getAttribute("layer");}
			if(svg_elem.getAttribute("layer-group") == null || svg_elem.getAttribute("layer-group") == ""){Points[i].layer_group = "Default";}else{Points[i].layer_group = svg_elem.getAttribute("layer-group");}
			if(svg_elem.getAttribute("animate") !== null){
				j = AnimatePoints.length;
				AnimatePoints[j] = string_to_array_cs(svg_elem.getAttribute("animate"));
				AnimatePoints[j].idx = i;
			}
		}
	}

	// SET REFERENCE POINTS
	RefPoints[0] = new Array(0,0,0)
}

function getWindowSizeProjection(z){

	if(z == null) var z = RefPoints[0][2];

	var x_window_shift = getWindowWidth()/2;
	var y_window_shift = getWindowHeight()/2;

	var depth = Math.floor(zoom * (eyez - maxzoom) / 100 + eyez);

	var min_x = -(z - eyez)*(-x_window_shift)/(depth - eyez) - RefPoints[0][0]
	var max_x = -(z - eyez)*(x_window_shift)/(depth - eyez) - RefPoints[0][0]

	var min_y = -(z - eyez)*(-y_window_shift)/(depth - eyez) - RefPoints[0][1]
	var max_y = -(z - eyez)*(y_window_shift)/(depth - eyez) - RefPoints[0][1]

	//alert(min_x + ', ' + max_x + ', ' + min_y + ', ' + max_y);

	return {min_x : min_x, max_x : max_x, min_y : min_y, max_y : max_y, range_x : max_x-min_x, range_y : max_y-min_y};
}

function pixel_to_font_size(pixel_height){
	return pixel_height*1.43;
}

function rotateXaxis(a, d){
	var t = rotateTrig(degToRad(d));
	var tmp;
	var i, j, k;
	
	for(i in a){
		if(is_array(a[i][0])){
			var j = 0;
			while(j < path_max_iter){
				if(!a[i][j]){break;}
				if(a[i][j][0] === "A"){continue;}
				if(is_numeric(a[i][j][0])){
					for(k = 0;k < a[i][j].length;k = k + 3){
						tmp = (t.sin * a[i][j][k+1]) + (t.cos * a[i][j][k+2]);
						a[i][j][k+1] = (t.cos * a[i][j][k+1]) - (t.sin * a[i][j][k+2]);
						a[i][j][k+2] = tmp;
					}
				}else{
					tmp = (t.sin * a[i][j][2]) + (t.cos * a[i][j][3]);
					a[i][j][2] = (t.cos * a[i][j][2]) - (t.sin * a[i][j][3]);
					a[i][j][3] = tmp;
				}
				j++;
			}
		}else{
			tmp = (t.sin * a[i][1]) + (t.cos * a[i][2]);
			a[i][1] = (t.cos * a[i][1]) - (t.sin * a[i][2]);
			a[i][2] = tmp;
		}
	}
}

function rotateYaxis(a, d){
	var t = rotateTrig(degToRad(d));
	var tmp;
	var i, j, k;

	for(i in a){
		if(is_array(a[i][0])){
			var j = 0;
			while(j < path_max_iter){
				if(!a[i][j]){break;}
				if(a[i][j][0] === "A"){continue;}
				if(is_numeric(a[i][j][0])){
					for(k = 0;k < a[i][j].length;k = k + 3){
						tmp = - (t.sin * a[i][j][k+0]) + (t.cos * a[i][j][k+2])
						a[i][j][k+0] = (t.cos * a[i][j][k+0])  + (t.sin * a[i][j][k+2]);
						a[i][j][k+2] = tmp;
					}
				}else{
					tmp = - (t.sin * a[i][j][1]) + (t.cos * a[i][j][3])
					a[i][j][1] = (t.cos * a[i][j][1])  + (t.sin * a[i][j][3]);
					a[i][j][3] = tmp;
				}
				j++;
			}
		}else{
			tmp = - (t.sin * a[i][0]) + (t.cos * a[i][2])
			a[i][0] = (t.cos * a[i][0])  + (t.sin * a[i][2]);
			a[i][2] = tmp;
		}
	}
}


function rotateZaxis(a, d){
	var t = rotateTrig(degToRad(d));
	var tmp;
	var i, j, k;

	for(i in a){
		if(is_array(a[i][0])){
			var j = 0;
			while(j < path_max_iter){
				if(!a[i][j]){break;}
				if(a[i][j][0] === "A"){continue;}
				if(is_numeric(a[i][j][0])){
					for(k = 0;k < a[i][j].length;k = k + 3){
						tmp = (t.sin * a[i][j][k+0]) + (t.cos * a[i][j][k+1])
						a[i][j][k+0] = (t.cos * a[i][j][k+0]) - (t.sin * a[i][j][k+1]);
						a[i][j][k+1] = tmp;
					}
				}else{
					tmp = (t.sin * a[i][j][1]) + (t.cos * a[i][j][2])
					a[i][j][1] = (t.cos * a[i][j][1]) - (t.sin * a[i][j][2]);
					a[i][j][2] = tmp;
				}
				j++;
			}
		}else{
			tmp = (t.sin * a[i][0]) + (t.cos * a[i][1])
			a[i][0] = (t.cos * a[i][0]) - (t.sin * a[i][1]);
			a[i][1] = tmp;
		}
	}
}


function scale(a,factor){
	var i, j, k;
	for(i = 0;i < a.length;i++){		
		if(a[i].s) a[i].s = a[i].s*factor;
		if(a[i].text_size) a[i].text_size = a[i].text_size*factor;
		if(is_array(a[i][0])){
			var j = 0;
			while(j < path_max_iter){
				if(!a[i][j]){break;}
				if(a[i][j][0] === "A"){continue;}
				if(is_numeric(a[i][j][0])){
					for(k = 0;k < a[i][j].length;k = k + 3){ // For AnimateArrows
						a[i][j][k+0] = a[i][j][k+0]*factor;
						a[i][j][k+1] = a[i][j][k+1]*factor;
						a[i][j][k+2] = a[i][j][k+2]*factor;
					}
				}else{
					a[i][j][1] = a[i][j][1]*factor;
					a[i][j][2] = a[i][j][2]*factor;
					a[i][j][3] = a[i][j][3]*factor;
				}
				j++;
			}
		}else{
			a[i][0] = a[i][0]*factor;
			a[i][1] = a[i][1]*factor;
			a[i][2] = a[i][2]*factor;
		}
	}
	return a;
}

function scrollEvent(e){
	var id = baseName(e);
	var delta = 0;

	if(IE){
		s_initialX = event.clientX + document.body.scrollLeft;
		s_initialY = event.clientY + document.body.scrollTop;
		if(!event){event = window.event;}
    	var delta = event.wheelDelta / 40;
	}else{
		s_initialX = e.pageX;
		s_initialY = e.pageY;
	}

	if(e.detail){
		var delta = -e.detail*5;
		var max = 8;
		if(delta > max){delta = max;}
		if(delta < -max){delta = -max;}
		zoom_shape(Math.round(delta*0.2)/20,s_initialX,s_initialY);
	}

	if(e.wheelDelta){ // SAFARI
		var delta = e.wheelDelta;
		var max = 60;
		if(delta > max){delta = max;}
		if(delta < -max){delta = -max;}
		zoom_shape(Math.round(delta*0.1)/20,s_initialX,s_initialY);
	}
}

function setKeyEvent(eventin,dist){
	currentEvent = eventin;
	d = dist;

	if (eventin !== "nothing" && eventin !== "refreshtozero"){
		doEvent();
		updateShapes();
	}
}

function translate(a,u,v,w){
	var i, j, k;
	for(i = 0;i < a.length;i++){
		if(is_array(a[i][0])){
			var j = 0;
			while(j < path_max_iter){
				if(!a[i][j]){break;}
				if(a[i][j][0] === "A"){continue;}
				//if(is_numeric(j) == false){j++;continue;}
				if(is_numeric(a[i][j][0])){
					if(a[i][j].length == 3){
						a[i][j][0] = a[i][j][0] + u;
						a[i][j][1] = a[i][j][1] + v;
						a[i][j][2] = a[i][j][2] + w;
					}else{
						a[i][j][0] = a[i][j][0] + u;
						a[i][j][1] = a[i][j][1] + v;
						a[i][j][2] = a[i][j][2] + w;
						a[i][j][3] = a[i][j][3] + u;
						a[i][j][4] = a[i][j][4] + v;
						a[i][j][5] = a[i][j][5] + w;
					}
//					for(k = 0;k < a[i][j].length;k = k + 3){ // For AnimateArrows
//						a[i][j][k+0] = a[i][j][k+0] + u;
//						a[i][j][k+1] = a[i][j][k+1] + v;
//						a[i][j][k+2] = a[i][j][k+2] + w;
//					}
				}else{
					a[i][j][1] = a[i][j][1] + u;
					a[i][j][2] = a[i][j][2] + v;
					a[i][j][3] = a[i][j][3] + w;
				}
				j++;
			}
		}else{
			a[i][0] = a[i][0] + u;
			a[i][1] = a[i][1] + v;
			a[i][2] = a[i][2] + w;
		}
	}
	return a;
}

function updateShapes(){

	var i, j, k, n_i0, n_i1, pathd, u, u1, u2, len;
	var circle, line, n_i, type, visibility, vec;

	depth = Math.floor(zoom * (eyez - maxzoom) / 100 + eyez);
	wsize_proj = getWindowSizeProjection();

	k = 0;
	for(i in Arrows){
		u1 = -(depth - eyez) / (Arrows[i][0][2] - eyez);
		u2 = -(depth - eyez) / (Arrows[i][1][2] - eyez);
	
		Shapes[k].x1 = (u1 * Arrows[i][0][0]) + x_window_shift;
		Shapes[k].y1 = -(u1 * Arrows[i][0][1]) + y_window_shift;
		Shapes[k].x2 = (u2 * Arrows[i][1][0]) + x_window_shift;
		Shapes[k].y2 = -(u2 * Arrows[i][1][1]) + y_window_shift;
		Shapes[k].len = dist(new Array(Shapes[k].x1, Shapes[k].y1), new Array(Shapes[k].x2, Shapes[k].y2))

		if(5*Arrows[i].s > max_arrowhead_size){Shapes[k].f = max_arrowhead_size;}else{Shapes[k].f = 5*Arrows[i].s;}
		k++;
	}

	for(i in Lines){
		u1 = -(depth - eyez) / (Lines[i][0][2] - eyez);
		u2 = -(depth - eyez) / (Lines[i][1][2] - eyez);
	
		Shapes[k].x1 = (u1 * Lines[i][0][0]) + x_window_shift;
		Shapes[k].y1 = -(u1 * Lines[i][0][1]) + y_window_shift;
		Shapes[k].x2 = (u2 * Lines[i][1][0]) + x_window_shift;
		Shapes[k].y2 = -(u2 * Lines[i][1][1]) + y_window_shift;
		k++;
	}

	for(i in Points){
		u = -(depth - eyez) / (Points[i][2] - eyez);

		Shapes[k].cx = (u * Points[i][0]) + x_window_shift;
		Shapes[k].cy = -(u * Points[i][1]) + y_window_shift;
		//Shapes[k].zindex = k;
		k++;
	}

	for(i in Paths){
		pathd = '';
		j = 0;
		while(j < Paths[i].length){
			if(!Paths[i][j]){break;}
			type = Paths[i][j][0];
			if(type == 'Z'){
				pathd += type;
			}else{
				u = -(depth - eyez) / (Paths[i][j][3] - eyez);
				pathd += type + " " + ((u * Paths[i][j][1]) + x_window_shift) + " " + (-(u * Paths[i][j][2]) + y_window_shift) + " ";
			}
			j++;
		}
		Shapes[k].vis = 1;
		Shapes[k].path = pathd;
		k++;
	}

	for(i in PathsC){
		pathd = '';
		j = 0;
		while(j < PathsC[i][0].length){
			if(PathsC[i][0][j] !== 0 && !PathsC[i][0][j]) break;

			n_i = points_i_to_k[PathsC[i][0][j]];
			if(j == 0){type = "M";}else{type = "L";}
			pathd += type + Shapes[n_i].cx + " " + Shapes[n_i].cy + " ";
			j++;
		}
		Shapes[k].path = pathd;
		k++;
	}

	for(i in LinesC){
		n_i0 = points_i_to_k[LinesC[i][0]];
		n_i1 = points_i_to_k[LinesC[i][1]];
	
		Shapes[k].x1 = Shapes[n_i0].cx;
		Shapes[k].y1 = Shapes[n_i0].cy;
		Shapes[k].x2 = Shapes[n_i1].cx;
		Shapes[k].y2 = Shapes[n_i1].cy;
		k++;
	}

	for(i in Textlinks){

		u = -(depth - eyez) / (Textlinks[i][2] - eyez);

		Shapes[k].vis = 1;
		Shapes[k].x = (u * Textlinks[i][0]);
		Shapes[k].y = -(u * Textlinks[i][1]);
		if(Textlinks[i].text_size){
			Shapes[k].font_size = pixel_to_font_size(Textlinks[i].text_size);
		}else{
			Shapes[k].font_size = Textlinks[i].font_size;
		}
		if(Textlinks[i].vertical){Shapes[k].vertical = 1}else{Shapes[k].vertical = 0;}

		//Shapes[k].zindex = k;
		k++;
	}

	if(sort_shapes) zindex.sort(function(a,b){return a.z - b.z})

	for(j in zindex){
		i = zindex[j].i;

		if(layer_groups[Shapes[i].layer_group].visibility == 0 || layer_groups[Shapes[i].layer_group][Shapes[i].layer].visibility == 0){visibility = "hidden";}else{visibility = "";}
		if(Shapes[i].type == "arrow"){
			line = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(line);
			line.setAttribute("x1", Shapes[i].x1);
			line.setAttribute("y1", Shapes[i].y1);
			line.setAttribute("x2", Shapes[i].x2);
			line.setAttribute("y2", Shapes[i].y2);
			line.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(line);
			
			vec = new Array(Shapes[i].x1 - Shapes[i].x2, Shapes[i].y1 - Shapes[i].y2);

			vec = uvector(vec);
			v1 = rotateVector(vec, arrow_angle);
			v2 = rotateVector(vec, -arrow_angle);
			arrowhead = svgDocument.getElementById(Shapes[i].id + "arrowhead");
			if(sort_shapes) svgDocument.removeChild(arrowhead);
			arrowhead.setAttribute("d", "M" + (Shapes[i].x2 + v1[0]*Shapes[i].f) + " " + (Shapes[i].y2 + v1[1]*Shapes[i].f) + " L" + (Shapes[i].x2) + " " + (Shapes[i].y2)  + " L" + (Shapes[i].x2 + v2[0]*Shapes[i].f) + " " + (Shapes[i].y2 + v2[1]*Shapes[i].f));
			arrowhead.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(arrowhead);
		}
		if(Shapes[i].type == "Paths" || Shapes[i].type == "PathsC"){
			path = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(path);
			path.setAttribute("d", Shapes[i].path);
			path.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(path);
		}
		if(Shapes[i].type == "point"){
			circle = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(circle);
			circle.setAttribute("cx", Shapes[i].cx);
			circle.setAttribute("cy", Shapes[i].cy);
			circle.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(circle);
		}
		if(Shapes[i].type == "lineC"){
			line = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(line);
			line.setAttribute("x1", Shapes[i].x1);
			line.setAttribute("y1", Shapes[i].y1);
			line.setAttribute("x2", Shapes[i].x2);
			line.setAttribute("y2", Shapes[i].y2);
			line.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(line);
		}
		if(Shapes[i].type == "line"){
			line = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(line);
			line.setAttribute("x1", Shapes[i].x1);
			line.setAttribute("y1", Shapes[i].y1);
			line.setAttribute("x2", Shapes[i].x2);
			line.setAttribute("y2", Shapes[i].y2);
			line.setAttribute("visibility", visibility);
			if(sort_shapes) svgDocument.appendChild(line);
		}
		if(Shapes[i].type == "textlink"){
			textlink = svgDocument.getElementById(Shapes[i].id);
			if(sort_shapes) svgDocument.removeChild(textlink);
			textlink.setAttribute("font-size", Math.ceil(Shapes[i].font_size));
			textlink.setAttribute("visibility", visibility);
			textlink.setAttribute("x", Shapes[i].x + x_window_shift);
			textlink.setAttribute("y", Shapes[i].y + y_window_shift);
			if(Shapes[i].vertical){
				//alert(Shapes[i].x + x_window_shift + ', ' + (-Shapes[i].y + y_window_shift));
				textlink.setAttribute("transform", 'rotate(-90, ' + (Shapes[i].x + x_window_shift) + ', ' + (Shapes[i].y + y_window_shift) + ')');
				//textlink.setAttribute("x", 0);
				//textlink.setAttribute("y", 0);
				//textlink.setAttribute("transform", 'rotate(10, ' + 600 + ', ' + 600 + ')');
			}
			if(sort_shapes) svgDocument.appendChild(textlink);
		}
	}
}

function zoom_shape(d, mouseX, mouseY){
	if(d == 0){return;}

	var zoom_speed_n = zoom_speed;
	if(BrowserDetect.browser == "Firefox") var zoom_speed_n = zoom_speed*0.5;

	var d = d/zoom_speed_n;

	scale(Arrows, 1 + d);
	scale(Lines, 1 + d);
	scale(Paths, 1 + d);
	scale(Points, 1 + d);
	scale(Textlinks, 1 + d);
	scale(RefPoints, 1 + d);

	if(AnimatePoints.length > 0 || AnimateArrows.length > 0 || AnimateLines.length > 0){
		scale(AnimateArrows, 1 + d);
		scale(AnimatePoints, 1 + d);
		scale(AnimateLines, 1 + d);
	}

	updateShapes();
}
