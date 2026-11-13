<?php
// Place as sop-private/config.php BESIDE public_html, never inside it.
return [
    'enabled' => false, // Set true after entering actual mail settings.
    'origin' => 'https://seooutsourcingphilippines.com',
    'secret' => 'REPLACE_WITH_64_RANDOM_HEX_CHARACTERS',
    'recipient' => 'info@seooutsourcingphilippines.com',
    'smtp_host' => '', // Copy actual SMTP values from your email provider.
    'smtp_port' => 465,
    'smtp_encryption' => 'ssl', // ssl on 465 or tls on 587.
    'smtp_username' => '',
    'smtp_password' => '',
    'smtp_from' => '', // An authenticated sender at your domain.
    'retention_days' => 90,
];
