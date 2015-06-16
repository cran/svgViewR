function show_hide_control(element){
	
	var action;
	var class_name;
	var div_container = element.parentNode.parentNode;
	var i;

	for(i = 0; i < div_container.childNodes.length; i++){

		class_name = div_container.childNodes[i].className;
		
		if(class_name == undefined) continue

		if(class_name == 'control_main'){

			if(element.innerHTML == 'Show'){
				action = 'show';
				element.innerHTML = 'Hide';
				div_container.childNodes[i].style.display = '';
				document.getElementById("control_container").style.width = '300px';
			}else{
				action = 'hide';
				element.innerHTML = 'Show';
				div_container.childNodes[i].style.display = 'none';
				document.getElementById("control_container").style.width = '50px';
			}
		}

		if(class_name == 'control_layers_main' || class_name == 'control_layer_main'){
			if(element.innerHTML.charCodeAt(0) == 9660){
				action = 'hide';
				element.innerHTML = '&#9658;';
				div_container.childNodes[i].style.display = 'none';
			}else{
				action = 'show';
				element.innerHTML = '&#9660;';
				div_container.childNodes[i].style.display = '';
			}
		}
	}

	for(i = 0; i < div_container.childNodes.length; i++){

		class_name = div_container.childNodes[i].className;
		
		if(class_name == undefined) continue

		if(class_name == 'control_layer_subheader'){
			if(action == 'hide'){
				div_container.childNodes[i].style.display = 'none';
			}else{
				div_container.childNodes[i].style.display = '';
			}

		}
	}
}

function layer_visibility(element){

	var class_name;
	var div_header = element.parentNode.parentNode;
	var div_container = element.parentNode.parentNode.parentNode;
	var i;
	
	// Get parent layer
	for(i = 0; i < div_header.childNodes.length; i++){

		class_name = div_header.childNodes[i].className;
		if(class_name == undefined) continue
		if(class_name != 'control_layer_text' && class_name != 'control_layer_text_nochild') continue

		var parent_layer = div_header.childNodes[i].innerHTML;
	}

	// Find all child layers
	layers = find_layer_children(div_container)

	// Remove duplicate layer names
	layers = array_unique(layers)

	// Get opacity to apply to layers
	var opacity = element.value

	// Show hide all child layers and layers of the same name
	layer_visibility_children(document.getElementById("control_layers_container"), layers, opacity)
}

function layer_visibility_children(container, layers, opacity){

	var container_class;
	var header;
	var header_class;
	var layer_text;
	var main_class;
	var i, j, k;
	var idx_input;
	var idx_vis;
	var main;

	for(i = 0; i < container.childNodes.length; i++){

		container_class = container.childNodes[i].className;

		if(container_class == undefined) continue

		if(container_class == 'control_layer_header'){

			// Clear layer text
			layer_text;

			header = container.childNodes[i];

			for(j = 0; j < header.childNodes.length; j++){
				header_class = header.childNodes[j].className;
				if(header_class == 'control_layer_shape_vis_range') idx_vis = j;
				if(header_class == 'control_layer_text' || header_class == 'control_layer_text_nochild') layer_text = header.childNodes[j].innerHTML;
			}
			
			if(layer_text == undefined) continue
			
			if(layers.indexOf(layer_text) > -1){

				// Change opacity for any shapes that list layer
				changeLayerOpacity(layer_text, (opacity/100));

				// Find slider element
				for(k = 0; k < header.childNodes[idx_vis].childNodes.length; k++){
					if(header.childNodes[idx_vis].childNodes[k].tagName == 'INPUT') idx_input = k;
				}
				
				// Change opacity slider in control panel
				header.childNodes[idx_vis].childNodes[idx_input].value = opacity;
			}
		}

		if(container_class == 'control_layer_main' || container_class == 'control_layers_main') main = container.childNodes[i];
	}

	if(main == undefined) return;

	for(i = 0; i < main.childNodes.length; i++){

		main_class = main.childNodes[i].className;

		if(main_class == undefined || main_class != 'control_layer_container') continue

		layer_visibility_children(main.childNodes[i], layers, opacity)
	}
}

function find_layer_children(container, layers){

	var container_class;
	var header;
	var header_class;
	var main_class;
	var i, j;
	var main;

	if(layers == undefined) layers = [];

	for(i = 0; i < container.childNodes.length; i++){

		container_class = container.childNodes[i].className;

		if(container_class == undefined) continue

		if(container_class == 'control_layer_header'){
		
			header = container.childNodes[i];

			for(j = 0; j < header.childNodes.length; j++){
			
				header_class = header.childNodes[j].className;

				if(header_class != 'control_layer_text' && header_class != 'control_layer_text_nochild') continue

				layers.push(header.childNodes[j].innerHTML)
			}
		}

		if(container_class == 'control_layer_main') main = container.childNodes[i];
	}

	if(main == undefined) return layers;

	for(i = 0; i < main.childNodes.length; i++){

		main_class = main.childNodes[i].className;

		if(main_class == undefined || main_class != 'control_layer_container') continue

		layers.concat(find_layer_children(main.childNodes[i], layers))
	}

	return layers;
}
