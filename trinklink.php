<?php
/*
  Plugin Name: Trinklink
  Plugin URI:  https://trinklink.com
  Description: Turn your direct links into affiliate links! Turn the links on your site into affiliate links! Earn money from your exit traffic too! You must have an <a href="https://reklamaction.com/en/yayinci.html" target="_blank">Reklamstore Afiiliate</a> account to use the TrinkLink service.
  Version:     1.1.3
  Author:      Reklamstore
  Author URI:  https://reklamstore.com
  Settings:    https://reklamstore.com
 */

if (!defined('ABSPATH')) {
    die('Access denied.');
}

define('TRNK_NAME', 'Trinklink');
define('TRNK_REQUIRED_PHP_VERSION', '7.0');
define('TRNK_REQUIRED_WP_VERSION', '5.0');

define('TRNK_TRINKLINK_JS_VERSION', '1.0.0');
define('TRNK_ICON_PAGE_JS_VERSION', '1.0.0');
define('TRNK_DEFAULT_JS_VERSION', '1.0.0'); // for coupons
// check wp and php versions
$trnk_error = false;

if (version_compare(PHP_VERSION, TRNK_REQUIRED_PHP_VERSION, '<')) {
    $trnk_error = true;
}

if (version_compare($GLOBALS['wp_version'], TRNK_REQUIRED_WP_VERSION, '<')) {
    $trnk_error = true;
}

if ($trnk_error) {
    trinklink_requiremens_error();
}

// action triggers and js scripts
add_action('wp_enqueue_scripts', 'trinklink_add_script_to_head');
add_action('admin_enqueue_scripts', 'trinklink_default_js');
add_action('admin_menu', 'trinklink_register_options_page');

// register settings for save setting
register_setting('trinklink_options_group', 'trinklink_aff_id');
register_setting('trinklink_options_group', 'trinklink_aff_sub');
register_setting('trinklink_options_group', 'trinklink_source');
register_setting('trinklink_options_group', 'trinklink_excluded');

// functions
function trinklink_register_options_page() {
    add_options_page('Trinklink', 'Trinklink', 'manage_options', 'trnk_plugin', 'trinklink_options_page');
}

function trinklink_add_script_to_head() {
    if (get_option('trinklink_aff_id') != '') {

        wp_register_script('trinklink', plugins_url('js/trinklink.js', __FILE__), array(), TRNK_TRINKLINK_JS_VERSION, false);
        wp_localize_script('trinklink', 'trnk_objects',
                [
                    'aff_id' => esc_html(get_option('trinklink_aff_id')),
                    'aff_sub' => esc_html(get_option('trinklink_aff_sub')),
                    'source' => esc_html(get_option('trinklink_source')),
                    'excluded' => esc_html(get_option('trinklink_excluded')),
                ]
        );
        wp_enqueue_script('trinklink');
    }
}

function trinklink_default_js() {
    // register css
    wp_register_style('trinklink_bootstrap', plugins_url('css/bootstrap.min.css', __FILE__));
    wp_enqueue_style('trinklink_bootstrap');
    wp_register_style('trinklink_font_awesome', plugins_url('css/font_awesome.css', __FILE__));
    wp_enqueue_style('trinklink_font_awesome');
    wp_register_style('trinklink_default', plugins_url('css/default.css', __FILE__));
    wp_enqueue_style('trinklink_default');
    
    wp_enqueue_script('jquery');

    if (get_option('trinklink_aff_id') != '') {
        // default js
        wp_register_script('trinklink', plugins_url('js/trinklink_default.js', __FILE__), array(), TRNK_DEFAULT_JS_VERSION, false);
        wp_localize_script('trinklink', 'trnk_objects',
                [
                    'aff_id' => esc_html(get_option('trinklink_aff_id')),
                    'aff_sub' => esc_html(get_option('trinklink_aff_sub')),
                    'source' => esc_html(get_option('trinklink_source')),
                    'excluded' => esc_html(get_option('trinklink_excluded')),
                    'plugin_url' => plugins_url('',__FILE__),
                ]
        );
        wp_enqueue_script('trinklink');

        // icons js
        wp_register_script('trinklink_icons', plugins_url('js/trinklink_icon_page.js', __FILE__), array(), TRNK_ICON_PAGE_JS_VERSION, false);
        wp_localize_script('trinklink_icons', 'trnk_objects',
                [
                    'aff_id' => esc_html(get_option('trinklink_aff_id')),
                    'aff_sub' => esc_html(get_option('trinklink_aff_sub')),
                    'source' => esc_html(get_option('trinklink_source')),
                    'excluded' => esc_html(get_option('trinklink_excluded')),
                    'plugin_url' => plugins_url('',__FILE__),
                ]
        );
        wp_enqueue_script('trinklink_icons');

        // fa-icons js
        wp_register_script('trinklink_fa', plugins_url('js/font_awesome.js', __FILE__), array(), '6.0.0', false);
        wp_enqueue_script('trinklink_fa');
    }
}

function trinklink_options_page() {
    ?>
    <div class="wrap">
        <?php screen_icon(); ?>
        <style>
            .trnk_th_row{text-align: left;width:200px;}
            .trnk_optional{font-size: 11px;color: gray;}
        </style>
        <div>
            <img style="float: left; margin-right: 15px;" src="<?php echo plugins_url('images/trinklink-logo.png', __FILE__); ?>" /> 
            <h1>Plugin Settings</h1>
        </div>
        <hr>
        <form method="post" action="options.php">
            <?php settings_fields('trinklink_options_group'); ?>
            <p><b>You must have an <a href="https://reklamaction.com/en/yayinci.html" target="_blank">Reklamstore Afiiliate</a> account to use the TrinkLink service.</b></p>
            <p style='color:red;'>Please add your Reklamstore Afiiliate (partner) information to below. Otherwise, the plugin will not be activated.</p>
            <table style="margin-top:25px;">
                <tr valign="top">
                    <th scope="row" class="trnk_th_row"><label for="trinklink_aff_id">Affiliate (Partner) ID</label></th>
                    <td><input type="number" id="trinklink_aff_id" name="trinklink_aff_id" value="<?php echo esc_html(get_option('trinklink_aff_id')); ?>" required /></td>
                </tr>
                <tr valign="top">
                    <th scope="row" class="trnk_th_row"><label for="trinklink_aff_sub">Affiliate Sub ID (<span class='trnk_optional'>(Optional)<span></label></th>
                    <td><input type="text" id="trinklink_aff_sub" name="trinklink_aff_sub" value="<?php echo esc_html(get_option('trinklink_aff_sub')); ?>" /></td>
                </tr>    
                <tr valign="top">
                    <th scope="row" class="trnk_th_row"><label for="trinklink_source">Source <span class='trnk_optional'>(Optional)<span></label></th>
                    <td><input type="text" id="trinklink_source" name="trinklink_source" value="<?php echo esc_html(get_option('trinklink_source')); ?>" /></td>
                </tr>   
                <tr valign="top">
                    <th scope="row" class="trnk_th_row"><label for="trinklink_excluded">Excluded Offer ID's <span class='trnk_optional'>(Optional)<span></label></th>
                    <td><input type="text" id="trinklink_excluded" name="trinklink_excluded" value="<?php echo esc_html(get_option('trinklink_excluded')); ?>" /></td>
                </tr>              
            </table>
            <?php submit_button('Save Changes'); ?>
        </form>
            <hr class="trnk_hr">
            <div style="clear:both;">
                <h1>Top winning offers on Reklamstore:</h1> 
            </div>
            <div style="max-width:650px;border: 1px dotted lightgray;">
                <div id="trinklink_rs_icons" style="margin-top:10px;"></div>
            </div>

            <hr class="trnk_hr">    

            <h1 style="clear:both;">Promos and Coupon Codes on Reklamstore:</h1> 
            <div id="trinklink_promo_wrapper" class="col-md-12" style="margin-top: 15px;display:none;">
                <div>
                    <div class="col-md-12" style="padding-left: 0;height:35px;">
                        <div id="trinklink_promo_all" class="badge badge-secondary category_badge promo_badge" style=""onclick="get_promos(1,true)">All</div>
                        <div id="trinklink_promo_promotion" class="badge badge-secondary category_badge promo_badge" onclick="get_promos(2,true)">Promotions</div>
                        <div id="trinklink_promo_coupon" class="badge badge-secondary category_badge promo_badge" onclick="get_promos(3,true)">Coupons</div>
                    </div>  

                    <div id="trinklink_promo"></div>     

                    <div class="col-md-12" style="width:100%;max-width:600px; padding: 10px 0 0 0;">
                        <button id="trinklink_promo_next" style="display:none;width: 100%;float:right; width:30%;" type="button" class="btn btn-outline-secondary">Next <i class="fa fa-angle-double-right"></i></button>                      
                        <button id="trinklink_promo_prev" style="display:none;width: 100%;float:left; width:30%;" type="button" class="btn btn-outline-secondary"><i class="fa fa-angle-double-left"></i> Prev</button>                                  
                    </div>              
                </div>
            </div>
        </div>
    <?php
    }

    function trinklink_requiremens_error() {
        echo '
        <div class="error">
            <p><b>' . TRNK_NAME . ' plugin error</b>: Your environment doesn\'t meet all of the system requirements listed below.</p>
            <ul class="ul-disc">
                <li>
                    <strong>Required PHP Version: </strong>' . TRNK_REQUIRED_PHP_VERSION . '+
                    <em>(You\'re running version ' . PHP_VERSION . ')</em>
                </li>
                <li>
                    <strong>Required WordPress Version: </strong>' . TRNK_REQUIRED_WP_VERSION . '+
                    <em>(You\'re running version ' . esc_html($GLOBALS['wp_version']) . ')</em>
                </li>
            </ul>
            <p>If you need to upgrade your version of PHP you can ask your hosting company for assistance, and if you need help upgrading WordPress you can refer to <a href="http://codex.wordpress.org/Upgrading_WordPress">the Codex</a>.</p>
        </div>
        ';
    exit;
    }
                                                                        