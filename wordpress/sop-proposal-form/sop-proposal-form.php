<?php
/**
 * Plugin Name: SOP Proposal Form
 * Description: Secure, consent-based proposal submissions for SEO Outsourcing Philippines. Configure WordPress mail before publishing.
 * Version: 1.1.0
 * Requires PHP: 8.1
 * Text Domain: sop-proposal-form
 */
if (!defined('ABSPATH')) exit;

/** Set SOP_LEADS_EMAIL explicitly in wp-config.php. Never silently send leads to the site admin. */
function sop_pf_recipient() {
    $email = defined('SOP_LEADS_EMAIL') ? SOP_LEADS_EMAIL : ''; 
    return is_email($email) ? $email : '';
}
function sop_pf_pick($name, $allowed, $default) {
    $v = isset($_GET[$name]) ? sanitize_text_field(wp_unslash($_GET[$name])) : $default;
    return in_array($v, $allowed, true) ? $v : $default;
}
function sop_pf_form() {
    $plans = array('Not sure - recommend a scope'=>'Not sure - recommend a scope',
        'SEO Essential'=>'SEO Essential — starting at $700/month',
        'SEO Growth'=>'SEO Growth — starting at $1,000/month',
        'SEO Scale'=>'SEO Scale — starting at $1,500/month',
        'Custom project / dedicated team'=>'Custom project or dedicated team');
    $services = array('not-sure'=>'Help me choose',
        'white-label-seo'=>'White-label SEO','technical-seo'=>'Technical SEO',
        'on-page-seo'=>'On-page SEO','local-seo'=>'Local SEO',
        'seo-content'=>'SEO content','seo-reporting'=>'SEO reporting',
        'seo-audits'=>'SEO audit','seo-strategy'=>'SEO strategy',
        'link-building'=>'Link building','multi-location-seo'=>'Multi-location SEO');
    $service = sop_pf_pick('service',array_keys($services),'not-sure');
    $industries = array('not-specified'=>'Not specified','dental'=>'Dental practices','healthcare'=>'Healthcare clinics','ecommerce'=>'E-commerce','saas'=>'SaaS / B2B software','home-services'=>'Home services','hospitality'=>'Hospitality','multi-location'=>'Multi-location operations','law-firms'=>'Australian law firms','plumbers'=>'Australian plumbing','electricians'=>'Australian electrical','hvac'=>'Australian HVAC','pest-control'=>'Australian pest control','builders-roofing'=>'Australian building / roofing','real-estate'=>'Australian real estate','accountants'=>'Australian accounting','ndis-providers'=>'Australian NDIS','solar-installers'=>'Australian solar');
    $legacy_industry = isset($_GET['service']) ? sanitize_key(wp_unslash($_GET['service'])) : '';
    $industry = sop_pf_pick('industry',array_keys($industries),in_array($legacy_industry,array_keys($industries),true) ? $legacy_industry : 'not-specified');
    $audiences = array('agency'=>'Agency / client accounts','business'=>'My own business');
    $plan = sop_pf_pick('plan',array_keys($plans),'Not sure - recommend a scope');
    $audience = sop_pf_pick('audience',array_keys($audiences),'agency');
    $status = isset($_GET['sop_status']) && $_GET['sop_status'] === 'invalid' ? 'invalid' : '';
    if (isset($_GET['sop_receipt']) && is_string($_GET['sop_receipt'])) {
        $receipt = sanitize_text_field(wp_unslash($_GET['sop_receipt']));
        if (preg_match('/^[a-zA-Z0-9]{24}$/', $receipt)) {
            $cache_key = 'sop_receipt_' . hash('sha256', $receipt);
            $saved = get_transient($cache_key);
            if (in_array($saved, array('sent','error'), true)) {
                $status = $saved;
                delete_transient($cache_key);
            }
        }
    }
    ob_start();
    if (!sop_pf_recipient()) {
        if (current_user_can('manage_options')) echo '<div class="alert visible error" role="alert">Form is disabled. Configure SOP_LEADS_EMAIL and verify delivery before launch.</div>';
        echo '<p>The online proposal form is temporarily unavailable. Please email <a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a> with your website and SEO request. Do not send passwords or sensitive records.</p>';
        return ob_get_clean();
    }
    if ($status === 'sent') echo '<div class="alert visible success" role="status">Your inquiry was received by the configured mail service. Keep the submitted details for your records. You can follow up by email if needed.</div>';
    if ($status === 'error') echo '<div class="alert visible error" role="alert">The request could not be delivered. Please try again or email the company directly.</div>';
    if ($status === 'invalid') echo '<div class="alert visible error" role="alert">Please check all required fields, the privacy consent, and try again.</div>';
    ?>
    <form class="sop-proposal-form" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
      <input type="hidden" name="action" value="sop_send_proposal">
      <?php wp_nonce_field('sop_send_proposal','sop_nonce'); ?>
      <div class="form-grid">
        <div class="field"><label for="sop-name">Full name *</label><input id="sop-name" type="text" name="name" maxlength="120" autocomplete="name" required></div>
        <div class="field"><label for="sop-email">Work email *</label><input id="sop-email" type="email" name="email" maxlength="254" autocomplete="email" required></div>
        <div class="field"><label for="sop-company">Company / agency</label><input id="sop-company" type="text" name="company" maxlength="160" autocomplete="organization"></div>
        <div class="field"><label for="sop-website">Website URL</label><input id="sop-website" type="url" name="website" maxlength="300" placeholder="https://example.com"></div>
        <div class="field"><label for="sop-audience">I need support for *</label><select id="sop-audience" name="audience" required>
        <?php foreach($audiences as $key=>$label) echo '<option value="'.esc_attr($key).'" '.selected($key,$audience,false).'>'.esc_html($label).'</option>'; ?>
        </select></div>
        <div class="field"><label for="sop-service">Primary SEO need</label><select id="sop-service" name="service">
        <?php foreach($services as $key=>$label) echo '<option value="'.esc_attr($key).'" '.selected($key,$service,false).'>'.esc_html($label).'</option>'; ?>
        </select></div>
        <div class="field"><label for="sop-industry">Client industry (optional)</label><select id="sop-industry" name="industry">
        <?php foreach($industries as $key=>$label) echo '<option value="'.esc_attr($key).'" '.selected($key,$industry,false).'>'.esc_html($label).'</option>'; ?>
      </select></div>
      <div class="field"><label for="sop-plan">Support level *</label><select id="sop-plan" name="plan" required>
        <?php foreach($plans as $key=>$label) echo '<option value="'.esc_attr($key).'" '.selected($key,$plan,false).'>'.esc_html($label).'</option>'; ?>
        </select></div>
      </div>
      <div class="field"><label for="sop-details">What SEO work do you need? *</label><textarea id="sop-details" name="details" required minlength="20" maxlength="5000" placeholder="Include target markets, workstreams and approval requirements."></textarea></div>
      <div aria-hidden="true" style="position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden"><label for="sop-confirm">Do not fill this in</label><input id="sop-confirm" name="phone_confirm" tabindex="-1" autocomplete="off"></div>
      <div class="field"><label style="display:flex;align-items:flex-start;gap:10px;font-size:13px"><input type="checkbox" required name="consent" value="1" style="width:auto;margin-top:5px">I agree to be contacted regarding this request and to the handling of my inquiry described in the <a href="<?php echo esc_url(home_url('/privacy-policy/')); ?>">Privacy Policy</a>. This is not a marketing subscription.</label></div>
      <button class="btn" type="submit">Request a tailored scope</button>
      <p class="legal-note">Do not submit passwords, patient information, or sensitive client records. If the form cannot deliver, email <a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a>.</p>
    </form>
    <?php return ob_get_clean();
}
add_shortcode('sop_proposal_form','sop_pf_form');

function sop_pf_submit() {
    $redirect = home_url('/contact/');
    if (strtoupper($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') { wp_safe_redirect(add_query_arg('sop_status','invalid',$redirect),303); exit; }
    if (!isset($_POST['sop_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['sop_nonce'])),'sop_send_proposal')) {
        wp_safe_redirect(add_query_arg('sop_status','invalid',$redirect),303); exit;
    }
    $data = array();
    foreach(array('name','email','company','website','details','audience','plan','service','industry','phone_confirm') as $key) {
        $data[$key] = isset($_POST[$key]) && is_string($_POST[$key]) ? wp_unslash($_POST[$key]) : '';
    }
    if ($data['phone_confirm'] !== '') { wp_safe_redirect($redirect,303); exit; }
    $data['name'] = sanitize_text_field($data['name']);
    $data['email'] = sanitize_email($data['email']);
    $data['company'] = sanitize_text_field($data['company']);
    $data['website'] = esc_url_raw(trim($data['website']),array('http','https'));
    $data['details'] = sanitize_textarea_field($data['details']);
    $data['audience'] = sanitize_key($data['audience']);
    $data['plan'] = sanitize_text_field($data['plan']);
    $data['service'] = sanitize_key($data['service']);
    $data['industry'] = sanitize_key($data['industry']);
    $valid_services = array('not-sure','white-label-seo','technical-seo','on-page-seo','local-seo','seo-content','seo-reporting','seo-audits','seo-strategy','link-building','multi-location-seo');
    $valid_industries = array('not-specified','dental','healthcare','ecommerce','saas','home-services','hospitality','multi-location','law-firms','plumbers','electricians','hvac','pest-control','builders-roofing','real-estate','accountants','ndis-providers','solar-installers');
    $valid_plans = array('Not sure - recommend a scope','SEO Essential','SEO Growth','SEO Scale','Custom project / dedicated team');
    $consent = isset($_POST['consent']) && $_POST['consent'] === '1';
    $valid = $consent && strlen($data['name'])>=2 && strlen($data['name'])<=120 && is_email($data['email'])
       && strlen($data['details']) >= 20 && strlen($data['details']) <= 5000
       && in_array($data['audience'], array('agency','business'),true) && in_array($data['plan'], $valid_plans,true) && in_array($data['service'], $valid_services,true) && in_array($data['industry'], $valid_industries,true)
       && strlen($data['company'])<=160 && (empty($data['website']) || filter_var($data['website'],FILTER_VALIDATE_URL));
    if (!$valid) { wp_safe_redirect(add_query_arg('sop_status','invalid',$redirect),303); exit; }
    if (!sop_pf_recipient()) { wp_safe_redirect(add_query_arg('sop_status','error',$redirect),303); exit; }
    // Fixed-rate guard; hashed IP, not the raw client address. Use a CDN/WAF for advanced abuse defense.
    $ip = isset($_SERVER['REMOTE_ADDR']) ? (string)$_SERVER['REMOTE_ADDR'] : 'unknown';
    $key = 'sop_rate_' . hash_hmac('sha256',$ip,wp_salt('auth'));
    $count = (int)get_transient($key);
    if ($count >= 3) { wp_safe_redirect(add_query_arg('sop_status','error',$redirect),303); exit; }
    set_transient($key,$count+1,30*MINUTE_IN_SECONDS);
    $subject = '[SEO outsourcing inquiry] ' . $data['plan'];
    $body = "Inquiry received at " . gmdate('c') . "\n\n";
    foreach(array('name','email','company','website','audience','plan','service','industry','details') as $k) $body .= ucfirst($k).": ".$data[$k]."\n";
    $headers = array('Content-Type: text/plain; charset=UTF-8', 'Reply-To: '.$data['email']);
    $ok = wp_mail(sop_pf_recipient(),$subject,$body,$headers);
    $receipt = wp_generate_password(24,false,false);
    set_transient('sop_receipt_'.hash('sha256',$receipt), $ok?'sent':'error', 5*MINUTE_IN_SECONDS);
    wp_safe_redirect(add_query_arg('sop_receipt',$receipt,$redirect),303); exit;
}
add_action('admin_post_nopriv_sop_send_proposal','sop_pf_submit');
add_action('admin_post_sop_send_proposal','sop_pf_submit');
