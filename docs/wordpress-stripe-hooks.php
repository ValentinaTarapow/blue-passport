<?php
/**
 * Blue Passport — Stripe authorize-and-capture hooks for Directorist.
 *
 * Install: paste at the end of the active theme's functions.php
 * (wp-content/themes/<theme>/functions.php) on thebluepassport.org.
 *
 * Requires: define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_live_...'); in wp-config.php
 * or replace the constant below (not recommended for production).
 */

if (!defined('BLUE_PASSPORT_STRIPE_SECRET_KEY')) {
    define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_live_REPLACE_ME');
}

function blue_passport_stripe_secret_key() {
    return BLUE_PASSPORT_STRIPE_SECRET_KEY;
}

// Charge annual membership when a pending listing is approved (pending → publish).
add_action('transition_post_status', 'blue_passport_charge_stripe_on_publish', 10, 3);

function blue_passport_charge_stripe_on_publish($new_status, $old_status, $post) {
    if ($post->post_type !== 'at_biz_dir' || $new_status !== 'publish' || $old_status !== 'pending') {
        return;
    }

    $session_id = get_post_meta($post->ID, '_stripe_session_id', true);
    if (!$session_id) {
        return;
    }

    $stripe_secret_key = blue_passport_stripe_secret_key();
    $response = wp_remote_get("https://api.stripe.com/v1/checkout/sessions/{$session_id}", [
        'headers' => ['Authorization' => 'Bearer ' . $stripe_secret_key],
    ]);

    if (is_wp_error($response)) {
        return;
    }

    $session_data = json_decode(wp_remote_retrieve_body($response), true);
    $subscription_id = $session_data['subscription'] ?? '';

    if ($subscription_id) {
        wp_remote_post("https://api.stripe.com/v1/subscriptions/{$subscription_id}", [
            'headers' => ['Authorization' => 'Bearer ' . $stripe_secret_key],
            'body' => ['trial_end' => 'now'],
        ]);
    }
}

// Cancel subscription when a listing is rejected (moved to trash).
add_action('wp_trash_post', 'blue_passport_cancel_stripe_on_reject');

function blue_passport_cancel_stripe_on_reject($post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'at_biz_dir') {
        return;
    }

    $session_id = get_post_meta($post_id, '_stripe_session_id', true);
    if (!$session_id) {
        return;
    }

    $stripe_secret_key = blue_passport_stripe_secret_key();
    $response = wp_remote_get("https://api.stripe.com/v1/checkout/sessions/{$session_id}", [
        'headers' => ['Authorization' => 'Bearer ' . $stripe_secret_key],
    ]);

    if (is_wp_error($response)) {
        return;
    }

    $session_data = json_decode(wp_remote_retrieve_body($response), true);
    $subscription_id = $session_data['subscription'] ?? '';

    if ($subscription_id) {
        wp_remote_request("https://api.stripe.com/v1/subscriptions/{$subscription_id}", [
            'method' => 'DELETE',
            'headers' => ['Authorization' => 'Bearer ' . $stripe_secret_key],
        ]);
    }
}
