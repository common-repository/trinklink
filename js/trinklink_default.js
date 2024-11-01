if (typeof jQuery !== 'undefined') {

    var trinklink_promo_affid = trnk_objects.aff_id !== undefined ? trnk_objects.aff_id : 1;
    var trinklink_promo_promoPageNo = 0;
    var trinklink_promo_promoType = 1;
    var trinklink_promo_promoFirstRun = 1;
    var trinklink_promo_promoPagelimit = 5;
    
    function trinklink_copyToClipboard(ID) {
        var $temp = jQuery("<input>");
        jQuery("body").append($temp);
        $temp.val(jQuery("#"+ID).text()).select();
        document.execCommand("copy");
        console.log($temp.val());
        $temp.remove();
        alert('Tracking link copied.');
    } 
    
    String.prototype.trnk_stripSlashes = function(){
        let limit = 65;
        let text = this.replace(/\\(.)/mg, "$1");
        return text.slice(0, limit) + (text.length > limit ? "..." : "");
    };    

    function get_promos(Type, badgeClick = false) {

        if (badgeClick === true) {
            trinklink_promo_promoPageNo = 0;
        }

        var jsonType = '';
        var dataName = '';


        switch (Type) {
            case 2:
                jsonType = 'promotion';
                dataName = 'promotion';
                break;
            case 3:
                jsonType = 'coupon';
                dataName = 'coupon';
                break;
            default:
                jsonType = '';
                dataName = 'all';
                break;
        }

        trinklink_promo_promoType = Type; //required

        jQuery(".promo_badge").css("background-color", "#6c757d");
        jQuery("#trinklink_promo_" + dataName).css("background-color", "#28A745");

        jQuery("#trinklink_promo_next,#trinklink_promo_prev").hide();
        jQuery("#trinklink_promo").append("<div id='loader' class='col-12 trnk_loader'><img style='align:center;width:40px;' src='"+trnk_objects.plugin_url+"/images/loader.gif'></div>");
        jQuery.getJSON("https://site.reklamaction.com/tools/coupons/index.php/coupons/json?aff_id=" + trinklink_promo_affid + "&page=" + trinklink_promo_promoPageNo + "&limit=" + trinklink_promo_promoPagelimit + "&type=" + jsonType + "&rand=" + (Math.floor(Math.random() * 1000)), function (data) {

            if (data.status === 1) {

                if (eval("data." + dataName + ".length") > 0) {
                    let content = '<table style="width:100%;max-width:600px;">';

                    jQuery.each(eval("data." + dataName), function (key, val) {

                        let couponCode = '';

                        if (val.type === 'coupon') {
                            couponCode = '<br><span style="color:rgb(40, 167, 69);">Coupon Code: ' + val.coupon_code + '<span>';
                        }

                        let previewLink = val.preview_link.replace("aff_id=0&", "aff_id=" + trinklink_promo_affid + "&");

                        content += '<tr class="promo_row">';
                        content += '<td style="padding:5px;width:90%;">';
                        content += '<span id="copy_promo_' + val.id + '" style="display:none;" >' + val.tracking_link + '</span>';
                        content += '<a href="' + val.tracking_link + '" target="_blank;" style="display:block;text-decoration:none;">';
                        content += '<span style="font-weight:bold;color:gray;">' + val.offer_name + '</span>';
                        content += '<span style="color:black;"> - ' + val.description.trnk_stripSlashes() + couponCode + '</span>';
                        content += '</a></td>';
                        content += '<td style="padding:5px;width:10%;"><span id="copy_btn_promo_' + val.id + '" class="copy_btn_promo" onclick="trinklink_copyToClipboard(\'copy_promo_' + val.id + '\');"><i class="fa fa-copy"></i></span></td>';
                        content += '</tr>';
                        content += '<tr style="height:10px;"></tr>';
                    });

                    content += '</table>';

                    jQuery("#trinklink_promo").html(content);
                    
                    content = '';

                    if ((parseInt(trinklink_promo_promoPagelimit) * (parseInt(trinklink_promo_promoPageNo) + 1)) < parseInt(data.count)) {
                        jQuery("#trinklink_promo_next").show();
                    }

                    if (trinklink_promo_promoPageNo > 0) {
                        jQuery("#trinklink_promo_prev").show();
                    }

                } else {
                    let content = '<div class="alert alert-info" style="width: 100%;margin-top:10px;" role="alert">No product found.</div>';
                    jQuery("#trinklink_promo_next").hide();
                    jQuery("#promo").append(content);
                }


            } else {
                jQuery("#trinklink_promo_next").hide();
            }

            jQuery("#loader").remove();

        });
    }
     

    jQuery(document).ready(function () {
        
        jQuery("#trinklink_promo_wrapper").show();

        get_promos(1);

        jQuery("#trinklink_promo_next").click(function () {
            trinklink_promo_promoPageNo++;
            get_promos(trinklink_promo_promoType);
            document.getElementById('promo_all').scrollIntoView();
        });

        jQuery("#trinklink_promo_prev").click(function () {
            trinklink_promo_promoPageNo--;
            get_promos(trinklink_promo_promoType);
            document.getElementById('promo_all').scrollIntoView();
        });
    });
}