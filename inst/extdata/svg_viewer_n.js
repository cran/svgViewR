var background_color;

function addReverseAnimationStates(a){
	var i, j, k;

	for(i in a){
		for(j = a[i].length - 1;j >= 0;j--){
			var new_j = a[i].length;
			a[i][new_j] = new Array();
			for(k = 0;k < a[i][j].length;k++){
				a[i][new_j][k] = a[i][j][k];
			}
		}
	}
	return a;
}

function animateShapes(){
	var i, j, k;

	if(animation_repeat > -1 && animation_count > animation_repeat) return

	var anim_n_i = anim_n;
	
	if(AnimatePoints.length > 0 && anim_n == AnimatePoints[0].length) anim_n = 0
	if(AnimateArrows.length > 0 && anim_n == AnimateArrows[0].length) anim_n = 0
	if(AnimateLines.length > 0 && anim_n == AnimateLines[0].length) anim_n = 0
	
	if(anim_n < anim_n_i) animation_count++
	if(animation_repeat > -1 && animation_count > animation_repeat) return

	for(i = 0; i < AnimatePoints.length; i++){
		for(j = 0; j < AnimatePoints[i][anim_n].length; j++) Points[AnimatePoints[i].idx][j] = AnimatePoints[i][anim_n][j]			
	}

	for(i = 0; i < AnimateArrows.length; i++){
		k = 0;
		for(j = 0; j < AnimateArrows[i][anim_n].length / 2; j++, k++) Arrows[AnimateArrows[i].idx][0][j] = AnimateArrows[i][anim_n][k]			
		for(j = 0; j < AnimateArrows[i][anim_n].length / 2; j++, k++) Arrows[AnimateArrows[i].idx][1][j] = AnimateArrows[i][anim_n][k]
	}

	for(i = 0; i < AnimateLines.length; i++){
		k = 0;
		for(j = 0; j < AnimateLines[i][anim_n].length / 2; j++, k++) Lines[AnimateLines[i].idx][0][j] = AnimateLines[i][anim_n][k]
		for(j = 0; j < AnimateLines[i][anim_n].length / 2; j++, k++) Lines[AnimateLines[i].idx][1][j] = AnimateLines[i][anim_n][k]
	}
	
	animation_length_wreverse = animation_length
	if(animation_reverse) animation_length_wreverse = animation_length*2

	if(Translate.length > 0){
		if((animation_count*animation_length_wreverse + anim_n) < Translate.length){
			currentEvent = "translateX";
			d = Translate[anim_n][0];
			doEvent();
	
			currentEvent = "translateY";
			d = Translate[anim_n][1];
			doEvent();
	
			currentEvent = "translateZ";
			d = Translate[anim_n][2];
			doEvent();
		}
	}

	if(Rotate.length > 0){
		if((animation_count*animation_length_wreverse + anim_n) < Rotate.length){
			currentEvent = "rotateXaxis";
			d = Rotate[anim_n][0];
			doEvent();
	
			currentEvent = "rotateYaxis";
			d = Rotate[anim_n][1];
			doEvent();
	
			currentEvent = "rotateZaxis";
			d = Rotate[anim_n][2];
			doEvent();
		}
	}

	anim_n++;
	updateShapes();
}

function baseName(ev) {
	var id = ev.target.getAttribute("id");
	return id;
}

function degToRad(d){
	return d*(Math.PI/180);
}

function detectKeyUp(e){
	var evt = e || window.event;
	if(evt.keyCode==82 && globalkeypress == "r"){globalkeypress = '';return;}
}

function dist(a, b){
	var i;
	var s = 0;
	for(i = 0;i < a.length;i++) s += Math.pow(b[i] - a[i], 2)
	return Math.sqrt(s);
}

function getMouseXYLocal(e){
	if(IE){return new Array(event.clientX,event.clientY);}else{return new Array(e.pageX,e.pageY);}
}

function playPauseAnimation(){
	if(stop_anim == 1){clearInterval(intervalID);}else{startAnimation();}
}

function loadBackground(){

	if(document.getElementsByTagName("background").length){
		for(i = 0;i < document.getElementsByTagName("background").length;i++){

			var svg_elem = document.getElementsByTagName("background")[i];
			background_color  = svg_elem.getAttribute("color");

			var rect = document.createElementNS(svgns, "rect");

			rect.setAttribute("width", window_properties.width*4);
			rect.setAttribute("height", window_properties.height*4);
			rect.setAttribute("x", 0);
			rect.setAttribute("y", 0);
			rect.setAttribute("fill", background_color);
			svgDocument.appendChild(rect);
		}
	}else{
		background_color = "white";
	}
}

function onLoadFunctions(evt){

	svgns = "http://www.w3.org/2000/svg";
	XLINK = "http://www.w3.org/1999/xlink";

	svgDocument = document.getElementById("world");

	window.onresize = function(event) {
		onWindowResize();
		updateShapes();
	}

	if(BrowserDetect.browser == "Firefox"){
		svgDocument.style.width = getWindowWidth() + "px";
		svgDocument.style.height = getWindowHeight() + "px";
	}

	document.getElementById('keydown').focus();
	document.getElementById('keydown').onclick = setEvents;
	document.getElementById('keydown').onclick();
	document.onkeyup = detectKeyUp;
	svgDocument.onmousemove = getMouseMoveXY;
	svgDocument.onkeyup = detectKeyUp;
	svgDocument.onkeydown = detectKeyDown;
	if(window.addEventListener){svgDocument.addEventListener('DOMMouseScroll', scrollEvent, false);}
	svgDocument.onmousewheel = scrollEvent;

	setViewboxProperties();
	get_shapes();
	get_transformations();

	if(AnimatePoints[0]) animation_length = AnimatePoints[0].length;	
	if(AnimateArrows[0]) animation_length = AnimateArrows[0].length;	
	if(AnimateLines[0]) animation_length = AnimateLines[0].length;	

	loadBackground();
	preloadShapes();

	if(Images.length == 0){
		set_interzoom_interval = 0;
		zoom_scroll_strength = 0.1;
	}

	fitShapesToWindow();
	updateShapes();

	if(animation_length > 1){
		if(animation_reverse){AnimatePoints = addReverseAnimationStates(AnimatePoints);}
		if(animation_reverse){AnimateArrows = addReverseAnimationStates(AnimateArrows);}
		if(animation_reverse){AnimateLines = addReverseAnimationStates(AnimateLines);}
		startAnimation();
	}
}

function onWindowResize(){

	if(BrowserDetect.browser == "Firefox"){
		svgDocument.style.width = getWindowWidth() + "px";
		svgDocument.style.height = getWindowHeight() + "px";
	}

	setViewboxProperties();
	fitShapesToWindow();
}

function preloadShapes(){ 	 	
	//w = getWindowWidth();
	//h = getWindowHeight();

	//resizeObjectsToWindow(w*scale,h*scale);
	var i, j;
	var k = 0;
	for(i in Arrows){
		Shapes[k] = new Array();
		Shapes[k].id = Arrows[i].id;
		Shapes[k].type = "arrow";
		Shapes[k].layer_name = Arrows[i].layer;
		Shapes[k].layer_group_name = Arrows[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = Arrows[i].z_index;
		zindex[k].i = k;

		var line = document.createElementNS(svgns, "line");
		line.setAttribute("id", Arrows[i].id);
		line.setAttribute("style", "stroke:" + Arrows[i].stroke + ";stroke-width:" + Arrows[i].stroke_width + ";opacity:" + Arrows[i].stroke_opacity + ";");
		svgDocument.appendChild(line);

		arrowhead = document.createElementNS(svgns, "path");
		arrowhead.setAttribute("id", Arrows[i].id + "arrowhead");
		arrowhead.setAttribute("style", "stroke:" + Arrows[i].stroke + ";stroke-width:" + Arrows[i].stroke_width + ";opacity:" + Arrows[i].stroke_opacity + ";fill:none;");
		svgDocument.appendChild(arrowhead);
		k++;
	}

	for(i in Lines){
		Shapes[k] = new Array();
		Shapes[k].id = Lines[i].id;
		Shapes[k].type = "line";
		Shapes[k].layer_name = Lines[i].layer;
		Shapes[k].layer_group_name = Lines[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = Lines[i].z_index;
		zindex[k].i = k;

		var line = document.createElementNS(svgns, "line");
		line.setAttribute("id", Lines[i].id);
		line.setAttribute("style", "stroke:" + Lines[i].stroke + ";stroke-width:" + Lines[i].stroke_width + ";opacity:" + Lines[i].opacity + ";");
		svgDocument.appendChild(line);
		k++;
	}

	for(i in Points){
		Shapes[k] = new Array();
		Shapes[k].id = Points[i].id;
		Shapes[k].type = "point";
		Shapes[k].layer_name = Points[i].layer;
		Shapes[k].layer_group_name = Points[i].layer_group;
		points_i_to_k[i] = k;

		zindex[k] = new Array();
		zindex[k].z = Points[i].z_index;
		zindex[k].i = k;

		circle = document.createElementNS(svgns, "circle");
		circle.setAttribute("id", Points[i].id);
		circle.setAttribute("r", Points[i].radius);
		circle.setAttribute("fill", Points[i].fill);
		circle.setAttribute("style", "stroke:" + Points[i].stroke + ";stroke-width:" + Points[i].stroke_width + ";fill-opacity:" + Points[i].fill_opacity + ";stroke-opacity:" + Points[i].stroke_opacity + ";");
		svgDocument.appendChild(circle);
		k++;
	}

	for(i in Paths){
		Shapes[k] = new Array();
		Shapes[k].id = Paths[i].id;
		Shapes[k].type = "Paths";
		Shapes[k].layer_name = Paths[i].layer;
		Shapes[k].layer_group_name = Paths[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = Paths[i].z_index;
		zindex[k].i = k;

		path = document.createElementNS(svgns, "path");
		path.setAttribute("id", Paths[i].id);
		path.setAttribute("style", "fill:" + Paths[i].fill + ";fill-opacity:" + Paths[i].fill_opacity + ";stroke:" + Paths[i].stroke + ";stroke-width:" + Paths[i].stroke_width + ";stroke-opacity:" + Paths[i].stroke_opacity + ";");
		svgDocument.appendChild(path);
		k++;
	}

	for(i in PathsC){
		Shapes[k] = new Array();
		Shapes[k].id = PathsC[i].id;
		Shapes[k].type = "PathsC";
		Shapes[k].layer_name = PathsC[i].layer;
		Shapes[k].layer_group_name = PathsC[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = PathsC[i].z_index;
		zindex[k].i = k;
		//PathsC[i].stroke_width = 4;

		path = document.createElementNS(svgns, "path");
		path.setAttribute("id", PathsC[i].id);
		path.setAttribute("style", "fill:" + PathsC[i].fill + ";fill-opacity:" + PathsC[i].fill_opacity + ";stroke:" + PathsC[i].stroke + ";stroke-width:" + PathsC[i].stroke_width + ";stroke-opacity:" + PathsC[i].stroke_opacity + ";");
		svgDocument.appendChild(path);
		k++;
	}

	for(i in Textlinks){
		Shapes[k] = new Array();
		Shapes[k].id = Textlinks[i].id;
		Shapes[k].type = "textlink";
		Shapes[k].vz_min = Textlinks[i].vz_min;
		Shapes[k].vz_max = Textlinks[i].vz_max;
		Shapes[k].layer_name = Textlinks[i].layer;
		Shapes[k].layer_group_name = Textlinks[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = Textlinks[i].z_index;
		zindex[k].i = k;

		if(!Textlinks[i].font_size){Textlinks[i].font_size = 12;}

		textBlock = document.createTextNode(Textlinks[i].text);
		var textlink = document.createElementNS(svgns, "text");
		textlink.setAttribute("id", Textlinks[i].id);
		textlink.setAttribute("text-anchor", Textlinks[i].text_anchor);
		textlink.setAttribute("font-size", Textlinks[i].font_size);
		textlink.setAttribute("font-weight", Textlinks[i].font_weight);
		textlink.setAttribute("fill", Textlinks[i].fill);
		textlink.setAttribute("opacity", Textlinks[i].opacity);
		//alert(Textlinks[i].id + " " + Textlinks[i].text_anchor + " " + Textlinks[i].font_size + " " + Textlinks[i].fill + " " + Textlinks[i].opacity);
		
		if(Textlinks[i].italic){var font_style = "italic";}else{var font_style = "";}
		if(Textlinks[i].bold){var font_weight = "bold";}else{var font_weight = "";}
		textlink.setAttribute("style", "font-family:" + Textlinks[i].font_name + ";letter-spacing:0;font-style:" + font_style + ";font-weight:" + font_weight + ";");
		//textlink.setAttribute("writing-mode", "rl-tb");
		
		//alert(Textlinks[i].font_name);
		//textlink.addEventListener("mousemove", function(evt) { evt.preventDefault(); }, false);
		//textlink.addEventListener("mouseover", function(evt) { evt.preventDefault(); }, false);
		
		textlink.appendChild(textBlock);
		svgDocument.appendChild(textlink);

		k++;
	}

	for(i in LinesC){
		Shapes[k] = new Array();
		Shapes[k].id = LinesC[i].id;
		Shapes[k].type = "lineC";
		Shapes[k].layer_name = LinesC[i].layer;
		Shapes[k].layer_group_name = LinesC[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = LinesC[i].z_index;
		zindex[k].i = k;

		line = document.createElementNS(svgns, "line");
		line.setAttribute("id", LinesC[i].id);
		line.setAttribute("style", "stroke:" + "rgb(" + line_color_r + "," + line_color_g + "," + line_color_b + ")" + ";stroke-width:" + LinesC[i].stroke_width
		+ ";stroke-opacity:" + LinesC[i].stroke_opacity + ";");
		svgDocument.appendChild(line);
		k++;
	}

	for(i in Images){
		Shapes[k] = new Array();
		Shapes[k].id = Images[i].id;
		Shapes[k].type = "image";
		Shapes[k].layer_name = Images[i].layer;
		Shapes[k].layer_group_name = Images[i].layer_group;

		zindex[k] = new Array();
		zindex[k].z = Images[i].z_index;
		zindex[k].i = k;

		var image = document.createElementNS(svgns, "image");
		image.setAttribute("id", Images[i].id);
		image.setAttributeNS(XLINK,"href", Images[i].href);
		image.setAttribute("style", "opacity:" + Images[i].opacity + ";");
		svgDocument.appendChild(image);
		k++;
	}

	layer_groups_unique = array_unique_properties(Shapes, "layer_group_name");
	layers_unique = array_unique_properties(Shapes, "layer_name");

	// CREATE ARRAY TO SAVE LAYER GROUP VISIBILITY
	layer_groups = new Array();
	for(i in layer_groups_unique){
		layer_groups[i] = new Array();
		layer_groups[i].visibility = 1;
		layer_groups[i].name = layer_groups_unique[i];
	
		var layers_by_group = new Array();
		for(j in Shapes){
			if(Shapes[j].layer_group_name !== layer_groups_unique[i]) continue;
			layers_by_group[layers_by_group.length] = Shapes[j].layer_name;
		}
		layers_by_group_unique = array_unique(layers_by_group);

		for(j in layers_by_group_unique){
			layer_groups[i][j] = new Array();
			layer_groups[i][j].visibility = 1;
			layer_groups[i][j].name = layers_by_group_unique[j];
		}
	}

	// MATCH LAYER NAMES WITH NUMBER INDEX IN LAYERS_UNIQUE
	for(i in Shapes){
		for(j in layer_groups){
			if(Shapes[i].layer_group_name !== layer_groups[j].name) continue
			Shapes[i].layer_group = j;

			for(k in layer_groups[j]){
				if(Shapes[i].layer_name !== layer_groups[j][k].name) continue
				Shapes[i].layer = k;
				break;
			}
			break;
		}
	}
	
	write_layer_control_panel(layer_groups);

//	Shapes.sort(function(a,b){return b.zindex - a.zindex})
}

function rotateTrig(r){return {sin : -Math.sin(r), cos : Math.cos(r)};}

function rotateVector(v, deg){
	var rad = degToRad(deg);
	var vec = new Array(v[0]*Math.cos(rad) - v[1]*Math.sin(rad), v[0]*Math.sin(rad) + v[1]*Math.cos(rad));
	return vec;
}

function setEvents(e) {
	var eventHandler = detectKeyDown;
	document['on'+this.id] = eventHandler;
}

function setViewboxProperties(){
	window_properties.height = getWindowHeight();
	window_properties.width = getWindowWidth();

	view_box.height = window_properties.height;
	view_box.width = window_properties.width;

	x_window_shift = view_box.width/2;
	y_window_shift = view_box.height/2;
}

function startAnimation(){
	if(animation_reverse){var animation_duration_n = animation_duration/2;}else{var animation_duration_n = animation_duration;}
	var animation_interval = (animation_duration_n*1000) / animation_length;
	intervalID = setInterval(animateShapes, Math.round(animation_interval));
}

function string_to_array_cs(string){

	var i, j;
	var t_arr = string.split(",");

	r_arr = new Array();
	for(i = 0;i < t_arr.length;i++){
		i_arr = trim(t_arr[i]).split(" ");
		
		r_arr[i] = new Array();
		for(j = 0;j < i_arr.length;j++) r_arr[i][j] = parseFloat(i_arr[j])
	}

	return r_arr;
}

function svg_path_string_to_array(string){

	var i, j, a;
	var s = "";
	
	// SPLIT PATH BY LETTERS, NUMBERS, SPACES OR COMMAS
	// TO ADD!!: Z AT THE END OF THE PATH
	m_arr = new Array();
	for(i=0;i < string.length;i++){
		a = string.substring(i, i+1);

		if(is_numeric(a) == is_numeric(s)) s += a
		if(a == " " || a == ","){
			m_arr[m_arr.length] = trim(s.toUpperCase());
			s = "";
		}
		if(is_numeric(a) !== is_numeric(s)){
			if(s.length) m_arr[m_arr.length] = trim(s.toUpperCase())
			s = a;
		}
	}
	m_arr[m_arr.length] = trim(s.toUpperCase());

	r_arr = new Array();
	if(is_numeric(m_arr[3])){
		for(j = 0, k = 0;j < m_arr.length;j = j + 4, k++){
			r_arr[k] = new Array();
			r_arr[k][0] = m_arr[j];
			r_arr[k][1] = parseFloat(m_arr[j+1]);
			r_arr[k][2] = parseFloat(m_arr[j+2]);
			r_arr[k][3] = parseFloat(m_arr[j+3]);
		}
	}else{
		if(m_arr[3] == "Q"){

			r_arr[0] = new Array();
			r_arr[0][0] = m_arr[0];
			r_arr[0][1] = parseFloat(m_arr[1]);
			r_arr[0][2] = parseFloat(m_arr[2]);
			for(j = 4, k = 1;j < m_arr.length;j = j + 2, k++){
				r_arr[k] = new Array();
				r_arr[k][0] = "";
				r_arr[k][1] = parseFloat(m_arr[j]);
				r_arr[k][2] = parseFloat(m_arr[j+1]);
			}
			r_arr[1][0] = "Q";
			if(!is_numeric(m_arr[m_arr.length-1])) r_arr[r_arr.length-1][0] = m_arr[m_arr.length-1]			
		}else{
			for(j = 0, k = 0;j < m_arr.length;j = j + 3, k++){
				r_arr[k] = new Array();
				r_arr[k][0] = m_arr[j];
				r_arr[k][1] = parseFloat(m_arr[j+1]);
				r_arr[k][2] = parseFloat(m_arr[j+2]);
			}
		}
	}

	return r_arr;
}

function uvector(v){
	var i, r;
	var s = 0;
	for(i = 0;i < v.length;i++) s += Math.pow(v[i], 2)
	var d = Math.sqrt(s);
	if(d == 0) return v;

	r = new Array();
	for(i = 0;i < v.length;i++) r[i] = v[i]/d
	return r;
}

function write_layer_control_panel(layer_groups){

	//if(layer_groups.length == 1 && layer_groups[0].name == "Default") return;
	var i, j;
	var k = 0;

	var div_control_panel_layers = document.getElementById("control_panel_layers");
	if(layer_groups != "") div_control_panel_layers.innerHTML += "Layers";

	style_arr = parse_style_string(div_control_panel_layers.getAttribute("style"));
	div_width = extract_number(style_arr.width);

	for(i in layer_groups){
		var div_layer_group = document.createElement("div");
		if(layer_groups.length > 1 && layer_groups[0].name !== "Default"){
			var table = document.createElement("table");
			table.setAttribute("style", "margin:0 0 0 5px;border-collapse: collapse;");
			var tr = document.createElement("tr");
	
			var td = document.createElement("td");
			td.innerHTML = "<input type=\"checkbox\" name=\"" + j + "\" onClick=\"javascript:if(layer_groups["+i+"].visibility){layer_groups["+i+"].visibility = 0;}else{layer_groups["+i+"].visibility = 1;};updateShapes();\" checked />";
			tr.appendChild(td);
	
			var td = document.createElement("td");
			td.setAttribute("style", "font-weight:bold;");
			td.innerHTML = layer_groups[i].name;
			tr.appendChild(td);
	
			table.appendChild(tr);
			div_control_panel_layers.appendChild(table);
	
			div_layer_group.setAttribute("style", "margin:0 0 0 15px;");
			k++;
		}

		if(layer_groups[i].length == 1 && layer_groups[i][0].name == "Default") continue;

		var table = document.createElement("table");
		for(j = 0;j < layer_groups[i].length;j++){
			var tr = document.createElement("tr");
	
			var td = document.createElement("td");
			td.innerHTML = "<input type=\"checkbox\" name=\"" + j + "\" onClick=\"javascript:if(layer_groups["+i+"]["+j+"].visibility){layer_groups["+i+"]["+j+"].visibility = 0;}else{layer_groups["+i+"]["+j+"].visibility = 1;};updateShapes();\" checked />";
			td.setAttribute("style", "line-height:5px;height:5px;");
			tr.appendChild(td);
	
			var td = document.createElement("td");
			td.innerHTML = layer_groups[i][j].name;
			td.setAttribute("style", "line-height:5px;height:5px;");
			tr.appendChild(td);
	
			table.appendChild(tr);
			k++;
		}

		div_layer_group.appendChild(table);
		if(k < 12){
			var overflow_style = "";
		}else{
			var overflow_style = "overflow-y:scroll;";
		}
		if(background_color == "black"){
			div_control_panel_layers.setAttribute("style", "height:300px;color:white;" + overflow_style);
		}else{
			div_control_panel_layers.setAttribute("style", "height:300px;" + overflow_style);
		}
		div_control_panel_layers.appendChild(div_layer_group);
	}
}
