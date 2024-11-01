/* 
 * RS Icons page creator JS File
 */

// for WP plugin

var trinklink_rsip = {   
    affiliate_id : trnk_objects.aff_id !== undefined ? trnk_objects.aff_id : 1,
    affiliate_sub : '',
    source : '',
    content_div_id : 'trinklink_rs_icons',
    number_of_cols : 6,
    number_of_rows : 3,
    font_color: 'black',
    sorting : 1,
    random_listing : true, 
    included_offers : [],
    excluded_offers : []
}; 


// functions start
var trinklink_rsip_json;

trinklink_rsip_load_json(function (response) {
    trinklink_rsip_json = JSON.parse(response);  
    trinklink_rsip_sort();    
    if (trinklink_rsip.random_listing === true){
        trinklink_rsip_shuffle(trinklink_rsip_json);
    }
    trinklink_rsip_start();
});

function trinklink_rsip_start(){
    if (trinklink_rsip_json.length > 0) {
        let div = document.getElementById(trinklink_rsip.content_div_id);
        div.style.overflow = 'hidden';
        //div.style.width = trinklink_rsip.number_of_cols * 106+'px';
        //div.style.height = trinklink_rsip.number_of_rows * 52+'px';
        div.style.width = '100%';
        div.style.height = '100%';        
        
        
        let div_content = '';
        let i=0;
        let limit = trinklink_rsip.number_of_cols * trinklink_rsip.number_of_rows;
        trinklink_rsip_json.forEach(function (jsn_obj) {  
            
            if (trinklink_rsip.included_offers.length > 0) {
                if (trinklink_rsip.included_offers.includes(jsn_obj.offer_id) === false){
                    return; 
                }
            }
            
            if (trinklink_rsip.excluded_offers.length > 0) {
                if (trinklink_rsip.excluded_offers.includes(jsn_obj.offer_id) === true){
                    return; 
                }
            }            
            
            if (i >= limit){
                return;
            }
            
            let icon = 'https://www.google.com/s2/favicons?domain=https://'+jsn_obj.url;            
            let url = trinklink_rsip_create_url(jsn_obj, 1); 
            
            div_content += '<div style="width:100px; height:5apx;float:left; margin: 0 5px 10px 0;text-align:center;">';
            div_content += '<a style="text-decoration: none;color:'+trinklink_rsip.font_color+';" href="'+url+'" target="_blank">';
            div_content += '<div>';
            div_content += '<img style="width:24px;" alt="'+jsn_obj.url+'" src="'+icon+'"/>';             
            div_content += '</div>';
            div_content += '<div title="'+jsn_obj.url+'" target="_blank" style="font-family: Arial, Helvetica, sans-serif;font-size:12px;text-align:center;">';
            div_content += jsn_obj.url.length > 14 ? jsn_obj.url.substring(0,14)+'...' : jsn_obj.url;
            div_content += '</div>';    
            div_content += '</a>';    
            div_content += '</div>';         
            
            i++;
        });
        div.innerHTML = div_content; 
    }    
}

function trinklink_rsip_create_url( jsn_obj, return_result) {
    var trinklink_rsip_replace = {'aff_id=1': 'aff_id=' + trinklink_rsip.affiliate_id, '{aff_id}': trinklink_rsip.affiliate_id, '{aff_sub}': trinklink_rsip.affiliate_sub, '{source}': trinklink_rsip.source};

    var source = trinklink_rsip_replace_all(jsn_obj.source, trinklink_rsip_replace);
    var tracking = trinklink_rsip_replace_all(jsn_obj.tracking, trinklink_rsip_replace);
    var source_sign = '?';

    var new_url = tracking + '&url=' + encodeURIComponent('https://'+jsn_obj.url+ source_sign + source);
    return new_url;
}

function trinklink_rsip_load_json(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'https://trinklink1.s3-eu-west-1.amazonaws.com/data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

function trinklink_rsip_replace_all(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}

function trinklink_rsip_shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function trinklink_rsip_sort(){
    if (trinklink_rsip.sorting === 1){
        trinklink_rsip_json = trinklink_rsip_json.slice().sort((a, b) => b.popularity - a.popularity);   
    }
    
    if (trinklink_rsip.sorting === 2){
        trinklink_rsip_json = trinklink_rsip_json.slice().sort((a, b) => a.url.localeCompare(b.url)); 
    }  
    
    if (trinklink_rsip.sorting === 3){
        trinklink_rsip_json = trinklink_rsip_json.slice().sort((a, b) => b.url.localeCompare(a.url)); 
    }   
    
    if (trinklink_rsip.sorting === 4){
        trinklink_rsip_json = trinklink_rsip_json.slice().sort((a, b) => a.offer_id - b.offer_id); 
    }  
    
    if (trinklink_rsip.sorting === 5){
        trinklink_rsip_json = trinklink_rsip_json.slice().sort((a, b) => b.offer_id - a.offer_id);
    } 
    
    trinklink_rsip_json = trinklink_rsip_json.slice(0,(trinklink_rsip.number_of_cols * trinklink_rsip.number_of_rows));  
}