function addDomAjaxREsult(){
    
    //just creates the sturctore that is in result.html
    if (getElement('resultbox')==null){
    var result_header = DIV({'align':'center','class':'graytexts'});
    result_header.innerHTML = "Result";
    var minions = DIV({'class':'minions','id':'minions'},result_header);
    var results = DIV({'class':'resultbox','id':'resultbox'});
    var main = DIV(
            {'class':'resultbigbox','id':'resultbigbox'},
            minions,
            results
            );

    //adding those to main part ..
    var result_container=getElement("resultcontent");
    appendChildNodes(result_container,main);
    }
    else
        getElement('resultbox').innerHTML = "";
}


function remoteFormRequest(form, target, options) {
	var query = Array();
    var contents = formContents(form);
    for (var j=0; j<contents[0].length; j++){
        if(compare(target,'group_small')==0){
            if(!query[contents[0][j]]){
                query[contents[0][j]] = [];
            }
            //add that here
            query[contents[0][j]].push(contents[1][j]);

        }
        else
            query[contents[0][j]] = contents[1][j];
    }
	query["tg_random"] = new Date().getTime();
	//makePOSTRequest(form.action, target, queryString(query));
	remoteRequest(form, form.action, target, query, options);
	return true;
}

function remoteRequest(source, target_url, target_dom, data, options) {
    //before
    if (options['before']) {
        eval(options['before']);
    }
    if ((!options['confirm']) || confirm(options['confirm'])) {
        makePOSTRequest(source, target_url, getElement(target_dom), queryString(data), options);
        //after
        if (options['after']) {
            eval(options['after']);
        }
    }
	return true;
}

function makePOSTRequest(source, url, target, parameters, options) {
  var http_request = false;
  if (window.XMLHttpRequest) { // Mozilla, Safari,...
     http_request = new XMLHttpRequest();
     if (http_request.overrideMimeType) {
        http_request.overrideMimeType('text/xml');
     }
  } else if (window.ActiveXObject) { // IE
     try {
        http_request = new ActiveXObject("Msxml2.XMLHTTP");
     } catch (e) {
        try {
           http_request = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
     }
  }
  if (!http_request) {
     alert('Cannot create XMLHTTP instance');
     return false;
  }

    var insertContents = function () {
        if (http_request.readyState == 4) {
            // loaded
            if (options['loaded']) {
                eval(options['loaded']);
            }
            if (http_request.status == 200) {
                if(target) {
                    target.innerHTML = http_request.responseText;
                }
                //success
                if (options['on_success']) {
                    eval(options['on_success']);
                }
            } else {
                //failure
                if (options['on_failure']) {
                    eval(options['on_failure']);
                } else {
                    alert('There was a problem with the request. Status('+http_request.status+')');
                }
            }
            //complete
            if (options['on_complete']) {
                eval(options['on_complete']);
            }
        }
    }
  
    http_request.onreadystatechange = insertContents;
    http_request.open('POST', url, true);
    http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http_request.setRequestHeader("Content-length", parameters.length);
    http_request.setRequestHeader("Connection", "close");
    http_request.send(parameters);
}

function glob_submit(form_element,target_dom){
    /*
     * Because it is a common function we have to move it here for better results
     * form_element is what we submit and the target_dom is the place that will be replaced
     */
    
    before_action = null;
    //sometimes we are not sure which dom to get so is that situation
    if(compare(target_dom,'not_sure')==0)
        target_dom = which_dom();

    //if we are in the index page should to that 
    if (compare(target_dom,'minioncontent')==0){
        before_action = "myj('#resultcontent').hide();myj('#widgetcontent').hide();myj('#methotdscontent').hide();myj('#modulescontent').hide();";
    }
    else if(compare(target_dom,'groupscontent')==0){
        before_action = "myj('#miniongroupcontents').hide();";
    }
    
    form_result = remoteFormRequest(form_element,target_dom, {
            'loading': null,
            'confirm': null, 
            'after':null,
            'on_complete':null, 
            'loaded':null, 
            'on_failure':null, 
            'on_success':null, 
            'before':before_action 
            }
            );
    
    return form_result;
}

function which_dom(){
    /*
     * We use the glob submit in lots of places so we should
     * know where we are actually so that method will handle that
     */

    dom_result = getElement('minioncontent');
    if (dom_result != null){
        //alert("Im giving back the minioncontent");
        return 'minioncontent';

    }
    
    dom_result = getElement('another');
    //will change it later
     if (dom_result != null){
        return 'another';
    }

    return dom_result;
}
