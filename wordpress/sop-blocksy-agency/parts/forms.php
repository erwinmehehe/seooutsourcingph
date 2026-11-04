<?php
if (!defined('ABSPATH')) exit;

function sop_agency_lead_recipient(): string {
    $email = defined('SOP_LEADS_EMAIL') ? (string) SOP_LEADS_EMAIL : '';
    return is_email($email) ? $email : '';
}

function sop_agency_notice(): void {
    if (empty($_GET['sop_receipt'])) return;
    $receipt = sanitize_text_field(wp_unslash($_GET['sop_receipt']));
    if (!preg_match('/^[a-zA-Z0-9]{24}$/', $receipt)) return;
    $key = 'sop_agency_receipt_' . hash('sha256', $receipt);
    $outcome = get_transient($key);
    delete_transient($key);
    if (!in_array($outcome, ['sent','error'], true)) return;
    echo '<p class="sop-form-notice '.($outcome === 'sent' ? 'sop-form-ok' : 'sop-form-error').'" role="status">';
    echo $outcome === 'sent' ? 'Thanks. Your request was sent. We will review the website and scope you provided.' : 'We could not submit your request. Please email us directly.';
    echo '</p>';
}

function sop_agency_form(string $variation = 'short'): void {
    $full = $variation === 'full';
    echo '<div class="sop-lead-card" id="lead-form"><div class="sop-form-head"><p class="sop-eyebrow">Project enquiry</p><h2>'.($full?'Tell us about your SEO requirements':'Tell us what you need done').'</h2><p>Share the website and the workstream. We will respond with an appropriate next step, not a generic package.</p></div>';
    sop_agency_notice();
    if (!sop_agency_lead_recipient()) {
        echo '<p class="sop-form-notice sop-form-error">The online enquiry form is not yet connected. To enquire, email <a href="mailto:info@seooutsourcingphilippines.com">info@seooutsourcingphilippines.com</a>.</p></div>';
        return;
    }
    $service = isset($_GET['service']) ? sanitize_key(wp_unslash($_GET['service'])) : '';
    $services = sop_agency_services();
    echo '<form action="'.esc_url(admin_url('admin-post.php')).'" method="post" class="sop-form">';
    echo '<input type="hidden" name="action" value="sop_agency_lead">';
    echo '<input type="hidden" name="nonce" value="'.esc_attr(wp_create_nonce('sop_agency_lead')).'">';
    echo '<div class="sop-honeypot" aria-hidden="true"><label>Leave this blank<input name="company_fax" type="text" tabindex="-1" autocomplete="off"></label></div>';
    echo '<div class="sop-field-grid"><label>Full name <span aria-hidden="true">*</span><input name="name" type="text" autocomplete="name" required maxlength="120" placeholder="Your name"></label>';
    echo '<label>Work email <span aria-hidden="true">*</span><input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@company.com"></label></div>';
    echo '<label>Company website <input name="website" type="url" inputmode="url" maxlength="300" placeholder="https://yourcompany.com"></label>';
    echo '<div class="sop-field-grid"><label>Who needs support?<select name="audience" required><option value="agency">Agency / client accounts</option><option value="business">Our own business</option></select></label>';
    echo '<label>SEO workstream<select name="service"><option value="not-sure">Help me choose</option>';
    foreach ($services as $slug=>$data) echo '<option value="'.esc_attr($slug).'"'.selected($service, $slug, false).'>'.esc_html($data['title']).'</option>';
    echo '</select></label></div>';
    if ($full) {
        echo '<label>What does success look like for this project?<textarea name="details" rows="4" maxlength="1800" placeholder="Current challenges, target markets, or a priority task"></textarea></label>';
    } else {
        echo '<label>Biggest challenge <span class="sop-optional">optional</span><textarea name="details" rows="2" maxlength="1800" placeholder="e.g. Technical SEO backlog on three client sites"></textarea></label>';
    }
    echo '<label class="sop-consent"><input type="checkbox" name="consent" value="yes" required><span>I agree to be contacted about this enquiry and have read the <a href="'.sop_agency_link('/privacy-policy/').'">privacy policy</a>.</span></label>';
    echo '<button type="submit" class="sop-btn sop-btn--dark sop-submit">Request a project scope <span aria-hidden="true">↗</span></button>';
    echo '<p class="sop-form-fine">No guaranteed rankings or revenue. Your enquiry is sent to the configured lead recipient.</p></form></div>';
}

add_action('admin_post_nopriv_sop_agency_lead', 'sop_agency_handle_lead');
add_action('admin_post_sop_agency_lead', 'sop_agency_handle_lead');
function sop_agency_handle_lead(): void {
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') wp_die('Invalid request', '', ['response'=>405]);
    $redirect = wp_validate_redirect(wp_get_referer() ?: home_url('/contact/'), home_url('/contact/'));
    // Only allow return URLs on the same site. wp_validate_redirect rejects external hosts.
    $nonce = isset($_POST['nonce']) ? sanitize_text_field(wp_unslash($_POST['nonce'])) : '';
    if (!wp_verify_nonce($nonce, 'sop_agency_lead')) wp_die('Form expired. Reload and try again.', '', ['response'=>403]);
    $bad = !empty($_POST['company_fax']);
    $name = sanitize_text_field(wp_unslash($_POST['name'] ?? ''));
    $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $website = esc_url_raw(trim(wp_unslash($_POST['website'] ?? '')), ['http','https']);
    $audience = sanitize_key(wp_unslash($_POST['audience'] ?? 'agency'));
    $service = sanitize_key(wp_unslash($_POST['service'] ?? 'not-sure'));
    $details = sanitize_textarea_field(wp_unslash($_POST['details'] ?? ''));
    $consent = isset($_POST['consent']) && $_POST['consent'] === 'yes';
    $remote = isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : 'unknown';
    $rate_key = 'sop_agency_rate_' . hash_hmac('sha256', $remote, wp_salt('auth'));
    $recipient = sop_agency_lead_recipient();
    $allowed_services = array_merge(['not-sure'], array_keys(sop_agency_services()));
    $valid = !$bad && $recipient !== '' && $consent && $name !== '' && strlen($name) <= 120 && is_email($email)
        && in_array($audience, ['agency','business'], true) && in_array($service, $allowed_services, true)
        && (!$website || wp_http_validate_url($website)) && strlen($details) <= 1800 && !get_transient($rate_key);
    $sent = false;
    if ($valid) {
        set_transient($rate_key, '1', MINUTE_IN_SECONDS * 2);
        $message = implode("\n", [
            'SEO Outsourcing Philippines — new scope enquiry',
            'Name: ' . $name, 'Email: ' . $email, 'Website: ' . ($website ?: '(not supplied)'),
            'Audience: ' . $audience, 'Service: ' . $service, 'Details: ' . $details,
            'Consent to be contacted: Yes', 'Submitted at: ' . gmdate('c')
        ]);
        $sent = wp_mail($recipient, 'New SEO scope enquiry — ' . $name, $message, [
            'Content-Type: text/plain; charset=UTF-8',
            'Reply-To: ' . $email
        ]);
    }
    $receipt = wp_generate_password(24, false, false);
    set_transient('sop_agency_receipt_' . hash('sha256', $receipt), $sent ? 'sent' : 'error', MINUTE_IN_SECONDS * 10);
    $redirect = remove_query_arg('sop_receipt', $redirect);
    wp_safe_redirect(add_query_arg('sop_receipt', $receipt, $redirect) . '#lead-form', 303);
    exit;
}
