
function_name = new Array();
url_path = new Array();
innerHTML_id = new Array();
request_status = new Array();
xmlHttp = new Array();
time1 = new Array();
time2 = new Array();
var req_ct = 0;
var skip_buffer = 10;
var skip_to = 0;
var ajax_output;
var auto_view_r_result = 0;

function ajax_alert_return(j, xmlHttp_object){
	alert(xmlHttp_object[j].responseText);
}

function ajax_fill_element(j, xmlHttp_object){
	document.getElementById(innerHTML_id[j]).innerHTML = xmlHttp_object[j].responseText;
	window.status= '';
}

function ajax_fill_element_return_call(j, xmlHttp_object){
	document.getElementById(innerHTML_id[j]).innerHTML = xmlHttp_object[j].responseText;
	on_ajax_request_return();
}

function ajax_fill_element_return_call2(j, xmlHttp_object){
	document.getElementById(innerHTML_id[j]).innerHTML = xmlHttp_object[j].responseText;
	on_ajax_request_return2(url_path[j]);
}

function ajax_get_xml_http_object(){
	var xmlHttp=null;
	try{ // Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();}
	catch(e){ // Internet Explorer		
		try{
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");}
		catch(e){
			xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");}
	}
	return xmlHttp;
}

function ajax_request(url, send_content, call_function, element_id){
	url_path[req_ct] = url;
	function_name[req_ct] = call_function;
	innerHTML_id[req_ct] = element_id;
	request_status[req_ct] = 0;

	xmlHttp[req_ct]=ajax_get_xml_http_object();
	if(xmlHttp[req_ct]==null){
		alert ("Browser does not support HTTP Request");
		return;}
	xmlHttp[req_ct].onreadystatechange=ajax_state_changed;
	xmlHttp[req_ct].open("POST", url, true);
	xmlHttp[req_ct].setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlHttp[req_ct].send(send_content);	
	window.status= 'Command to ' + url + ' sent.';

	time1[req_ct] = new Date().getTime() / 1000;

	req_ct++;
}

function ajax_state_changed(){
	var j;
	for(j = skip_to;j < xmlHttp.length; j++){
		if(request_status[j] == 1){continue;}
		if(xmlHttp[j].readyState==4 || xmlHttp[j].readyState=="complete"){
			//alert(skip_to + ' -- ' + j);
			eval(function_name[j] + '(j, xmlHttp)');

			time2[j] = new Date().getTime() / 1000;
			if(document.getElementById("run_time")) document.getElementById("run_time").innerHTML = "Run-time: " + Math.round((time2[j] - time1[j])*100)/100 + " sec";
			
			request_status[j] = 1;
			if(j - skip_buffer > 0){skip_to = j - skip_buffer;}
		}	
	}
}

function array_unique(arr) {
	var hash = {}, result = [];
	for(var i = 0, l = arr.length;i < l;++i){
    	if(hash[ arr[i] ] === true) continue;
		hash[ arr[i] ] = true;
		result.push(arr[i]);    	
    }
    return result;
}

function array_unique_properties(arr, property) {
	var hash = {}, result = [];
	for(var i = 0, l = arr.length;i < l;++i){
    	if(hash[ arr[i][property] ] === true) continue;
		hash[ arr[i][property] ] = true;
		result.push(arr[i][property]);    	
    }
    return result;
}

var BrowserDetect = {
	//Source: http://www.quirksmode.org/js/detect.html

	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) != -1)
					return data[i].identity;
			}
			else if (dataProp)
				return data[i].identity;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{
			string: navigator.userAgent,
			subString: "Chrome",
			identity: "Chrome"
		},
		{ 	string: navigator.userAgent,
			subString: "OmniWeb",
			versionSearch: "OmniWeb/",
			identity: "OmniWeb"
		},
		{
			string: navigator.vendor,
			subString: "Apple",
			identity: "Safari",
			versionSearch: "Version"
		},
		{
			prop: window.opera,
			identity: "Opera",
			versionSearch: "Version"
		},
		{
			string: navigator.vendor,
			subString: "iCab",
			identity: "iCab"
		},
		{
			string: navigator.vendor,
			subString: "KDE",
			identity: "Konqueror"
		},
		{
			string: navigator.userAgent,
			subString: "Firefox",
			identity: "Firefox"
		},
		{
			string: navigator.vendor,
			subString: "Camino",
			identity: "Camino"
		},
		{		// for newer Netscapes (6+)
			string: navigator.userAgent,
			subString: "Netscape",
			identity: "Netscape"
		},
		{
			string: navigator.userAgent,
			subString: "MSIE",
			identity: "Explorer",
			versionSearch: "MSIE"
		},
		{
			string: navigator.userAgent,
			subString: "Gecko",
			identity: "Mozilla",
			versionSearch: "rv"
		},
		{ 		// for older Netscapes (4-)
			string: navigator.userAgent,
			subString: "Mozilla",
			identity: "Netscape",
			versionSearch: "Mozilla"
		}
	],
	dataOS : [
		{
			string: navigator.platform,
			subString: "Win",
			identity: "Windows"
		},
		{
			string: navigator.platform,
			subString: "Mac",
			identity: "Mac"
		},
		{
			   string: navigator.userAgent,
			   subString: "iPhone",
			   identity: "iPhone/iPod"
	    },
		{
			string: navigator.platform,
			subString: "Linux",
			identity: "Linux"
		}
	]

};

BrowserDetect.init();

function clean(array, deleteValue){
	for(var i = 0; i < array.length; i++) {
		if(array[i] == deleteValue){
			array.splice(i, 1);
			i--;
			continue;
		}
		if(isNaN(deleteValue) && isNaN(array[i])){
			array.splice(i, 1);
			i--;
			continue;
		}
	}
	return array;
}

function createCookie(name, value, sec){
	if (sec) {
		var date = new Date();
		date.setTime(date.getTime()+(sec*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function deleteCookie(name) {
	createCookie(name,"",-1);
}

function extract_number(strString){
	var strValidChars = "0123456789.-";
	var strChar;
	var returnString = "";
	var i;
	
	if (strString.length == 0) return false;

	for (i = 0; i < strString.length; i++){
		strChar = strString.charAt(i);
		if(strValidChars.indexOf(strChar) > -1) returnString += strChar;
	}
	return parseFloat(returnString);
}

function extract_alpha(strString){
	var strNonAlphaChars = "0123456789.-";
	var strChar;
	var returnString = "";
	var i;
	
	if (strString.length == 0) return false;

	for (i = 0; i < strString.length; i++){
		strChar = strString.charAt(i);
		if(strNonAlphaChars.indexOf(strChar) == -1) returnString += strChar;
	}
	return returnString;
}

function getCookie(Name){ 
	var re=new RegExp(Name+"=[^;]+", "i"); //construct RE to search for target name/value pair
	if (document.cookie.match(re)) //if cookie found
		return document.cookie.match(re)[0].split("=")[1] //return its value
	return false;
}

function getWindowHeight(){
	var y = 0;
	if (self.innerHeight) {
		y = self.innerHeight;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		y = document.documentElement.clientHeight;
	} else if (document.body) {
		y = document.body.clientHeight;
	}

	return y;
}

function getWindowWidth(){
	var x = 0;
	if (self.innerHeight) {
		x = self.innerWidth;
	} else if (document.documentElement && document.documentElement.clientHeight) {
		x = document.documentElement.clientWidth;
	} else if (document.body) {
		x = document.body.clientWidth;
	}
	
	return x;
}

function has_numeric(strString){
	var strValidChars = "0123456789.-";
	var strChar;
	var blnResult = false;
	var i;
	
	if (strString.length == 0) return false;

	//  test strString consists of valid characters listed above
	for (i = 0; i < strString.length && blnResult == false; i++){
		strChar = strString.charAt(i);
		if (strValidChars.indexOf(strChar) > -1){
			blnResult = true;
		}
	}
	return blnResult;
}

function is_array(input){
	return typeof(input)=='object'&&(input instanceof Array);
}

function is_numeric(strString){
	var strValidChars = "0123456789.-";
	var strChar;
	var blnResult = true;
	var i;
	
	if (strString.length == 0) return false;

	//  test strString consists of valid characters listed above
	for (i = 0; i < strString.length && blnResult == true; i++){
		strChar = strString.charAt(i);
		if (strValidChars.indexOf(strChar) == -1){
			blnResult = false;
		}
	}
	return blnResult;
}

function on_ajax_request_return2(url){
	ajax_request(url, 'function=print_ui', 'ajax_fill_element', 'ui_div');
	if(auto_view_r_result){
		document.getElementById('r_call_view').submit();
	}
	window.status= '';
}

function open_text_in_new_window(){
	window.open('A.html','A','width=300, height=200');
}

function parse_style_string(string){

	style_array = new Array();
	string_split1 = string.split(";");

	for(i in string_split1){
		if(string_split1[i] == "") continue;
		string_split2 = string_split1[i].split(":");
		style_array[string_split2[0]] = string_split2[1];
	}

	return style_array; 
}

function pixel_to_font_size(pixel_height){
	return pixel_height*1.43;
}

function sortasc(a,b){
	return a - b;
}

function toggle_div_visibility(id){
	div = document.getElementById(id);
	if(div.style.visibility == 'hidden'){
		div.style.visibility = '';
		div.style.height = '';
		//div.style.width = new_width + 'px';
	}else{
		div.style.visibility = 'hidden';
		div.style.height = '0px';
		div.style.width = '0px';
	}
}

function trim(stringToTrim){
	//http://www.somacon.com/p355.php
	return stringToTrim.replace(/^\s+|\s+$/g,"");
}

function ltrim(stringToTrim){
	//http://www.somacon.com/p355.php
	return stringToTrim.replace(/^\s+/,"");
}

function rtrim(stringToTrim){
	//http://www.somacon.com/p355.php
	return stringToTrim.replace(/\s+$/,"");
}
