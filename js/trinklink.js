/*
 RS Trinklink V1.0
 */

// for WP plugin
if (trnk_aff_id === undefined && trnk_objects.aff_id !== undefined){
    var trnk_aff_id = trnk_objects.aff_id;  
    var trnk_aff_sub = trnk_objects.aff_sub;       
    var trnk_source = trnk_objects.source;        
    var trnk_excluded = trnk_objects.excluded !== '' ? trnk_objects.excluded.split(',') : [];
}
//

var trnk_l = document.links;
var trnk_length = 0;
var trnk_urls = [];
var trnk_json;

if (typeof trnk_href === "undefined") {
    var trnk_href = 'href';
}

function silentErrorHandler() {
    return true;
}

window.onerror = silentErrorHandler;
trnk_load_json(function (response) {
    trnk_json = JSON.parse(response);
});

if (document.readyState === 'ready' || document.readyState === 'interactive') {
    trnk_start();
} else {
    document.onreadystatechange = function () {
        if (document.readyState === "complete") {
            trnk_start();
        }
    }
}

function trnk_start() {
    let check_json = setInterval(function () {
        if (trnk_json !== "undefined") {
            trnk_get_urls();
            clearInterval(check_json);
        }
    }, 500);
    var check_lazy = setInterval(function () {
        trnk_check_lazy();
    }, 3000);
}

function trnk_get_urls() {
    trnk_urls = [];

    if (trnk_l.length === 0) {
        trnk_l = document.links;
    }

    for (var i = 0; i < trnk_l.length; i++) {
        trnk_urls.push(trnk_l[i]);
    }

    if (trnk_urls.length > 0 && trnk_json.length > 0) {
        trnk_json.forEach(function (jsn_obj) {
            if (trnk_excluded.includes(jsn_obj.offer_id)) {
                return;
            }
            trnk_urls.forEach(function (url_obj) {
                var trnk_httpsCnt = (url_obj.href.match(/https/g) || []).length;
                var trnk_httpCnt = (url_obj.href.match(/http/g) || []).length;
                if (trnk_httpsCnt >= 1) {
                    var trnk_exp = 'https';
                } else if (trnk_httpCnt >= 1) {
                    var trnk_exp = 'http';
                } else {
                    var trnk_exp = false;
                }
                var trnk_surls = url_obj.href.split(trnk_exp);

                if (trnk_surls.length > 2 && trnk_exp !== false && trnk_surls[2].search("adrtt") == -1 && trnk_surls[2].search("reklm") == -1 && trnk_surls[2].search("rdrtr") == -1) {
                    exp_url = new URL(trnk_exp + decodeURIComponent(trnk_surls[2]));
                    if (exp_url.hostname.replace('www.', '') === jsn_obj.url) {
                        url_obj.href = exp_url.href;
                        url_obj.setAttribute(trnk_href, trnk_create(url_obj, jsn_obj, 1));
                    }
                } else {
                    if (url_obj.hostname.replace('www.', '') === jsn_obj.url) {
                        trnk_create(url_obj, jsn_obj, 0);
                    }
                }
                trnk_surls = [];
            });
        });
    }
}

function trnk_create(url_obj, jsn_obj, return_result) {
    var trck_replace = {'aff_id=1': 'aff_id=' + trnk_aff_id, '{aff_id}': trnk_aff_id, '{aff_sub}': trnk_aff_sub, '{source}': trnk_source}

    var source = trnk_replace_all(jsn_obj.source, trck_replace);
    var tracking = trnk_replace_all(jsn_obj.tracking, trck_replace);
    var source_sign = '?';

    if ((url_obj.href.match(/\?/g) || []).length > 0) {
        source_sign = '&';
    }

    var new_url = tracking + '&url=' + encodeURIComponent(url_obj.href + source_sign + source);

    if (return_result === 0) {
        url_obj.href = new_url;
    } else {
        return new_url;
    }

}

function trnk_load_json(callback) {
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

function trnk_check_lazy() {
    let trnk_body = document.body;
    let trnk_html = document.documentElement;
    trnk_height = Math.max(trnk_body.scrollHeight, trnk_body.offsetHeight, trnk_html.clientHeight, trnk_html.scrollHeight, trnk_html.offsetHeight);
    if (trnk_length === 0) {
        trnk_length = trnk_height;
    } else if (trnk_length !== trnk_height) {
        trnk_length = trnk_height;
        trnk_l = '';
        clearInterval(check_lazy);
        trnk_start();
    } else {
        return;
    }
}

function trnk_sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function trnk_replace_all(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}