<?php
/**
 * Plugin Name: Blue Passport API
 * Description: Stripe Checkout + revisión de 7 días. Cobrar primero, publicar solo si el pago se confirma.
 * Version: 1.5.0
 * Author: The Blue Passport
 *
 * Configuración en wp-config.php (antes de "That's all, stop editing!"):
 *
 *   define('BLUE_PASSPORT_STRIPE_SECRET_KEY', 'sk_live_...');
 *   define('BLUE_PASSPORT_STRIPE_PRICE_CREW', 'price_...');   // 150 €/año — Blue Crew Member
 *   define('BLUE_PASSPORT_STRIPE_PRICE_EXPERT', 'price_...'); // 150 €/año — Blue Expert Member
 *   define('BLUE_PASSPORT_STRIPE_PRICE_PARTNER', 'price_1TuIpe4liFjrlSo9OU6ZihxR'); // 50 €/año — Blue Certified Partner
 *   define('BLUE_PASSPORT_FRONTEND_URL', 'https://thebluepassport.org'); // dominio del front React
 *   define('BLUE_PASSPORT_TRIAL_DAYS', 7); // días de revisión (= trial Stripe, sin cobro hasta Publish)
 *   define('BLUE_PASSPORT_ADMIN_EMAIL', 'pagos@thebluepassport.es,tarapow.v@gmail.com'); // recordatorios (coma-separados)
 *   define('BLUE_PASSPORT_CF7_FORM_ID', 123); // opcional: ID numérico del formulario Contact Form 7
 */

if (!defined('ABSPATH')) {
    exit;
}

// ---------------------------------------------------------------------------
// Config helpers
// ---------------------------------------------------------------------------

function bpapi_stripe_secret_key() {
    return defined('BLUE_PASSPORT_STRIPE_SECRET_KEY') ? BLUE_PASSPORT_STRIPE_SECRET_KEY : '';
}

function bpapi_frontend_url() {
    $url = defined('BLUE_PASSPORT_FRONTEND_URL') ? BLUE_PASSPORT_FRONTEND_URL : home_url();
    return rtrim($url, '/');
}

function bpapi_trial_days() {
    return defined('BLUE_PASSPORT_TRIAL_DAYS') ? (int) BLUE_PASSPORT_TRIAL_DAYS : 7;
}

function bpapi_admin_emails() {
    $emails = [];

    if (defined('BLUE_PASSPORT_ADMIN_EMAIL') && BLUE_PASSPORT_ADMIN_EMAIL) {
        foreach (explode(',', (string) BLUE_PASSPORT_ADMIN_EMAIL) as $email) {
            $email = sanitize_email(trim($email));
            if ($email) {
                $emails[] = $email;
            }
        }
    } else {
        $emails[] = 'pagos@thebluepassport.es';
    }

    // Siempre incluir estos destinatarios para recordatorios de revisión.
    $emails[] = 'pagos@thebluepassport.es';
    $emails[] = 'valentarapowblue@gmail.com';

    return array_values(array_unique($emails));
}

/** Destinatarios de avisos admin (string listo para wp_mail). */
function bpapi_admin_email() {
    return implode(',', bpapi_admin_emails());
}

/** Email de contacto para mensajes al solicitante (primer destinatario). */
function bpapi_contact_email() {
    $emails = bpapi_admin_emails();
    return $emails[0] ?? get_option('admin_email');
}

/**
 * ID del formulario Contact Form 7 (constante o primer form publicado).
 */
function bpapi_cf7_form_id() {
    if (defined('BLUE_PASSPORT_CF7_FORM_ID') && BLUE_PASSPORT_CF7_FORM_ID) {
        return (int) BLUE_PASSPORT_CF7_FORM_ID;
    }

    if (!post_type_exists('wpcf7_contact_form')) {
        return 0;
    }

    $forms = get_posts([
        'post_type'      => 'wpcf7_contact_form',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
        'orderby'        => 'ID',
        'order'          => 'ASC',
    ]);

    return !empty($forms) ? (int) $forms[0]->ID : 0;
}

/**
 * Envía el contacto vía Contact Form 7 (mail del servidor / Flamingo / SMTP).
 *
 * @return true|WP_Error
 */
function bpapi_submit_via_cf7($first_name, $last_name, $email, $message) {
    $form_id = bpapi_cf7_form_id();
    if (!$form_id || !function_exists('wpcf7_contact_form')) {
        return new WP_Error('cf7_unavailable', 'Contact Form 7 is not available', ['status' => 503]);
    }

    $contact_form = wpcf7_contact_form($form_id);
    if (!$contact_form) {
        return new WP_Error('cf7_not_found', 'Contact Form 7 form not found', ['status' => 404]);
    }

    $full_name = trim($first_name . ' ' . $last_name);
    $unit_tag  = sprintf('wpcf7-f%d-p0-o1', $form_id);

    // Campos estándar CF7 + aliases comunes.
    $_POST['_wpcf7']                = (string) $form_id;
    $_POST['_wpcf7_version']        = defined('WPCF7_VERSION') ? WPCF7_VERSION : '6.1.6';
    $_POST['_wpcf7_locale']         = function_exists('determine_locale') ? determine_locale() : 'es_ES';
    $_POST['_wpcf7_unit_tag']       = $unit_tag;
    $_POST['_wpcf7_container_post'] = '0';
    $_POST['your-name']             = $full_name;
    $_POST['your-email']            = $email;
    $_POST['your-subject']          = 'Consulta desde The Blue Passport';
    $_POST['your-message']          = $message;
    $_POST['first-name']            = $first_name;
    $_POST['last-name']             = $last_name;
    $_POST['email']                 = $email;
    $_POST['message']               = $message;
    $_POST['nombre']                = $full_name;
    $_POST['mensaje']               = $message;

    $result = $contact_form->submit();
    $status = isset($result['status']) ? $result['status'] : '';

    if ($status === 'mail_sent' || !empty($result['mail_sent'])) {
        return true;
    }

    $msg = isset($result['message']) ? wp_strip_all_tags($result['message']) : 'Could not send the message via Contact Form 7';
    return new WP_Error('cf7_failed', $msg, ['status' => 502, 'cf7_status' => $status]);
}

/**
 * Fallback: envía con wp_mail a pagos@…
 *
 * @return true|WP_Error
 */
function bpapi_submit_via_wp_mail($first_name, $last_name, $email, $message) {
    $to = bpapi_contact_email();
    if (!$to) {
        return new WP_Error('no_recipient', 'No contact email configured', ['status' => 500]);
    }

    $full_name = trim($first_name . ' ' . $last_name);
    $subject   = 'Consulta desde The Blue Passport — ' . $full_name;
    $body      = "Nombre: {$full_name}\n"
        . "Email: {$email}\n\n"
        . "Mensaje:\n{$message}\n";

    $headers = [
        'Content-Type: text/plain; charset=UTF-8',
        'Reply-To: ' . $full_name . ' <' . $email . '>',
    ];

    $sent = wp_mail($to, $subject, $body, $headers);
    if (!$sent) {
        return new WP_Error('mail_failed', 'Could not send the message', ['status' => 502]);
    }

    return true;
}

// POST /contact  { firstName, lastName, email, message } → { ok: true }
function bpapi_route_contact(WP_REST_Request $request) {
    $first_name = sanitize_text_field($request['firstName'] ?: '');
    $last_name  = sanitize_text_field($request['lastName'] ?: '');
    $email      = sanitize_email($request['email'] ?: '');
    $message    = sanitize_textarea_field($request['message'] ?: '');

    if (!$first_name || !$last_name || !$email || !$message || !is_email($email)) {
        return new WP_Error('invalid_request', 'firstName, lastName, email and message are required', ['status' => 400]);
    }

    // Preferir Contact Form 7 (mail del servidor / Flamingo / SMTP del WP).
    $cf7 = bpapi_submit_via_cf7($first_name, $last_name, $email, $message);
    if (!is_wp_error($cf7)) {
        return ['ok' => true, 'via' => 'contact-form-7'];
    }

    // Fallback wp_mail si CF7 no está o falló.
    $mail = bpapi_submit_via_wp_mail($first_name, $last_name, $email, $message);
    if (is_wp_error($mail)) {
        return new WP_Error(
            'contact_failed',
            'Could not send the message',
            ['status' => 502]
        );
    }

    return ['ok' => true, 'via' => 'wp_mail'];
}

function bpapi_reminder_days() {
    // Día 5 de un plazo de 7: quedan ~2 días.
    $days = bpapi_trial_days();
    return max(1, $days - 2);
}

function bpapi_price_for_plan($plan) {
    $map = [
        'crew'    => defined('BLUE_PASSPORT_STRIPE_PRICE_CREW') ? BLUE_PASSPORT_STRIPE_PRICE_CREW : '',
        'expert'  => defined('BLUE_PASSPORT_STRIPE_PRICE_EXPERT') ? BLUE_PASSPORT_STRIPE_PRICE_EXPERT : '',
        'partner' => defined('BLUE_PASSPORT_STRIPE_PRICE_PARTNER') ? BLUE_PASSPORT_STRIPE_PRICE_PARTNER : '',
    ];
    return isset($map[$plan]) ? $map[$plan] : '';
}

// ---------------------------------------------------------------------------
// Stripe HTTP helpers
// ---------------------------------------------------------------------------

function bpapi_stripe_request($method, $path, $body = null) {
    $args = [
        'method'  => $method,
        'timeout' => 30,
        'headers' => ['Authorization' => 'Bearer ' . bpapi_stripe_secret_key()],
    ];
    if ($body !== null) {
        $args['body'] = $body;
    }

    $response = wp_remote_request('https://api.stripe.com' . $path, $args);

    if (is_wp_error($response)) {
        return new WP_Error('stripe_http', $response->get_error_message(), ['status' => 502]);
    }

    $data = json_decode(wp_remote_retrieve_body($response), true);
    $code = wp_remote_retrieve_response_code($response);

    if ($code >= 400) {
        $message = isset($data['error']['message']) ? $data['error']['message'] : 'Stripe error';
        return new WP_Error('stripe_api', $message, ['status' => 502]);
    }

    return $data;
}

// ---------------------------------------------------------------------------
// Application storage (custom post type, hidden from public)
// ---------------------------------------------------------------------------

add_action('init', 'bpapi_register_application_cpt');

function bpapi_register_application_cpt() {
    register_post_type('bp_application', [
        'label'        => 'BP Applications',
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-id-alt',
        'supports'     => ['title'],
        'capability_type' => 'post',
        'map_meta_cap' => true,
    ]);
}

function bpapi_get_application($id) {
    $post = get_post((int) $id);
    if (!$post || $post->post_type !== 'bp_application') {
        return null;
    }
    return $post;
}

// ---------------------------------------------------------------------------
// REST API — namespace blue-passport/v1
// Front: VITE_API_URL=https://thebluepassport.org/wp-json/blue-passport/v1
// ---------------------------------------------------------------------------

add_action('rest_api_init', 'bpapi_register_routes');

function bpapi_register_routes() {
    register_rest_route('blue-passport/v1', '/create-checkout-session', [
        'methods'             => 'POST',
        'callback'            => 'bpapi_route_create_checkout_session',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blue-passport/v1', '/checkout-session/(?P<session_id>[A-Za-z0-9_\-]+)', [
        'methods'             => 'GET',
        'callback'            => 'bpapi_route_get_checkout_session',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blue-passport/v1', '/applications/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'bpapi_route_get_application',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blue-passport/v1', '/applications/(?P<id>\d+)/profile', [
        'methods'             => 'POST',
        'callback'            => 'bpapi_route_submit_profile',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blue-passport/v1', '/applications/(?P<id>\d+)/publish-draft', [
        'methods'             => 'POST',
        'callback'            => 'bpapi_route_publish_draft',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('blue-passport/v1', '/contact', [
        'methods'             => 'POST',
        'callback'            => 'bpapi_route_contact',
        'permission_callback' => '__return_true',
    ]);

    // Expone contacto/social de Directorist en wp/v2/at_biz_dir (los metas _* no salen en REST por defecto).
    register_rest_field('at_biz_dir', 'bp_contact', [
        'get_callback' => 'bpapi_get_listing_contact',
        'schema'       => [
            'description' => 'Blue Passport listing contact and social info',
            'type'        => 'object',
            'context'     => ['view', 'embed'],
        ],
    ]);
}

/**
 * Contacto + redes desde metas estándar de Directorist.
 *
 * @param array $object Listing REST object (incluye id).
 * @return array
 */
function bpapi_get_listing_contact($object) {
    $id = isset($object['id']) ? (int) $object['id'] : 0;
    if (!$id) {
        return bpapi_empty_listing_contact();
    }

    $social_raw = get_post_meta($id, '_social', true);
    $social     = [];

    if (is_array($social_raw)) {
        foreach ($social_raw as $link) {
            if (empty($link['id']) || empty($link['url'])) {
                continue;
            }
            $social[] = [
                'id'  => sanitize_key($link['id']),
                'url' => esc_url_raw($link['url']),
            ];
        }
    }

    $phone2 = (string) get_post_meta($id, '_phone2', true);

    return [
        'email'   => (string) get_post_meta($id, '_email', true),
        'phone'   => (string) get_post_meta($id, '_phone', true),
        'phone2'  => $phone2,
        'whatsapp'=> $phone2,
        'website' => (string) get_post_meta($id, '_website', true),
        'address' => (string) get_post_meta($id, '_address', true),
        'social'  => $social,
    ];
}

function bpapi_empty_listing_contact() {
    return [
        'email'    => '',
        'phone'    => '',
        'phone2'   => '',
        'whatsapp' => '',
        'website'  => '',
        'address'  => '',
        'social'   => [],
    ];
}

/**
 * Arma el array _social de Directorist a partir del perfil (linkedin + extras).
 *
 * @param array $profile
 * @return array
 */
function bpapi_build_directorist_social($profile) {
    $social = [];

    if (!empty($profile['linkedin'])) {
        $social[] = [
            'id'  => 'linkedin',
            'url' => esc_url_raw($profile['linkedin']),
        ];
    }

    if (!empty($profile['social']) && is_array($profile['social'])) {
        foreach ($profile['social'] as $link) {
            if (empty($link['id']) || empty($link['url'])) {
                continue;
            }
            $id = sanitize_key($link['id']);
            if ($id === 'linkedin' && !empty($profile['linkedin'])) {
                continue;
            }
            $social[] = [
                'id'  => $id,
                'url' => esc_url_raw($link['url']),
            ];
        }
    }

    return $social;
}

// POST /create-checkout-session  { plan, fullName, email, nationality, reviewConsent } → { url }
function bpapi_route_create_checkout_session(WP_REST_Request $request) {
    $plan     = sanitize_text_field($request['plan'] ?: 'crew');
    $fullName = sanitize_text_field($request['fullName'] ?: '');
    $email    = sanitize_email($request['email'] ?: '');
    $company  = sanitize_text_field($request['company'] ?: '');
    $category = sanitize_text_field($request['category'] ?: '');
    $country  = sanitize_text_field($request['country'] ?: '');
    $nationality = sanitize_text_field($request['nationality'] ?: $country);
    $review_consent = filter_var($request['reviewConsent'], FILTER_VALIDATE_BOOLEAN);

    if (!$fullName || !$email || !$nationality || !$review_consent) {
        return new WP_Error('invalid_request', 'fullName, email, nationality and reviewConsent are required', ['status' => 400]);
    }

    if (!in_array($plan, ['crew', 'expert', 'partner'], true)) {
        return new WP_Error('invalid_plan', 'plan must be crew, expert or partner', ['status' => 400]);
    }

    if (!bpapi_stripe_secret_key()) {
        return new WP_Error('not_configured', 'Stripe secret key is not configured', ['status' => 500]);
    }

    $price = bpapi_price_for_plan($plan);
    if (!$price) {
        return new WP_Error('invalid_plan', "No Stripe price configured for plan: {$plan}", ['status' => 400]);
    }

    $application_id = wp_insert_post([
        'post_type'   => 'bp_application',
        'post_status' => 'private',
        'post_title'  => $fullName . ' — ' . $email,
        'meta_input'  => [
            '_bp_full_name' => $fullName,
            '_bp_email'     => $email,
            '_bp_company'   => $company,
            '_bp_category'  => $category,
            '_bp_country'   => $country,
            '_bp_nationality' => $nationality,
            '_bp_review_consent' => $review_consent ? 'yes' : 'no',
            '_bp_plan'      => $plan,
            '_bp_status'    => 'pending_payment',
        ],
    ], true);

    if (is_wp_error($application_id)) {
        return new WP_Error('application_error', 'Could not create application', ['status' => 500]);
    }

    $frontend = bpapi_frontend_url();

    $session = bpapi_stripe_request('POST', '/v1/checkout/sessions', [
        'mode'                                 => 'subscription',
        'line_items[0][price]'                 => $price,
        'line_items[0][quantity]'              => 1,
        'subscription_data[trial_period_days]' => bpapi_trial_days(),
        'customer_email'                       => $email,
        'success_url'                          => $frontend . '/payment/success?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url'                           => $frontend . '/payment/cancel',
        'metadata[application_id]'             => $application_id,
        'metadata[plan]'                       => $plan,
    ]);

    if (is_wp_error($session)) {
        wp_delete_post($application_id, true);
        return $session;
    }

    update_post_meta($application_id, '_bp_stripe_session_id', $session['id']);

    return ['url' => $session['url'], 'applicationId' => $application_id];
}

// GET /checkout-session/:sessionId → { paid, status, applicationId }
function bpapi_route_get_checkout_session(WP_REST_Request $request) {
    $session_id = sanitize_text_field($request['session_id']);

    $session = bpapi_stripe_request('GET', '/v1/checkout/sessions/' . rawurlencode($session_id));
    if (is_wp_error($session)) {
        return $session;
    }

    $complete = isset($session['status']) && $session['status'] === 'complete';
    // Con trial, payment_status es "no_payment_required": la tarjeta quedó vinculada sin cobro.
    $paid = $complete || in_array($session['payment_status'] ?? '', ['paid', 'no_payment_required'], true);

    $application_id = isset($session['metadata']['application_id']) ? (int) $session['metadata']['application_id'] : 0;

    if ($application_id && $paid) {
        $current = get_post_meta($application_id, '_bp_status', true);
        if ($current === 'pending_payment') {
            update_post_meta($application_id, '_bp_status', 'paid_pending_profile');
        }
    }

    return [
        'paid'          => $paid,
        'status'        => $paid ? 'paid' : 'pending_payment',
        'applicationId' => $application_id ? (string) $application_id : '',
    ];
}

// GET /applications/:id → { fullName, profile, wordpressListingId }
function bpapi_route_get_application(WP_REST_Request $request) {
    $application = bpapi_get_application($request['id']);
    if (!$application) {
        return new WP_Error('not_found', 'Application not found', ['status' => 404]);
    }

    $profile_json = get_post_meta($application->ID, '_bp_profile', true);
    $listing_id   = (int) get_post_meta($application->ID, '_bp_listing_id', true);

    return [
        'id'                 => (string) $application->ID,
        'fullName'           => get_post_meta($application->ID, '_bp_full_name', true),
        'email'              => get_post_meta($application->ID, '_bp_email', true),
        'plan'               => get_post_meta($application->ID, '_bp_plan', true),
        'status'             => get_post_meta($application->ID, '_bp_status', true),
        'profile'            => $profile_json ? json_decode($profile_json, true) : null,
        'wordpressListingId' => $listing_id ?: null,
    ];
}

// POST /applications/:id/profile — guarda el perfil completo (JSON)
function bpapi_route_submit_profile(WP_REST_Request $request) {
    $application = bpapi_get_application($request['id']);
    if (!$application) {
        return new WP_Error('not_found', 'Application not found', ['status' => 404]);
    }

    $profile = $request->get_json_params();
    if (!is_array($profile)) {
        return new WP_Error('invalid_request', 'Invalid profile payload', ['status' => 400]);
    }

    update_post_meta($application->ID, '_bp_profile', wp_json_encode($profile));
    update_post_meta($application->ID, '_bp_status', 'profile_submitted');

    return ['ok' => true];
}

// POST /applications/:id/publish-draft — crea listing Directorist PENDING → { wordpressListingId }
function bpapi_route_publish_draft(WP_REST_Request $request) {
    $application = bpapi_get_application($request['id']);
    if (!$application) {
        return new WP_Error('not_found', 'Application not found', ['status' => 404]);
    }

    $existing = (int) get_post_meta($application->ID, '_bp_listing_id', true);
    if ($existing) {
        return ['wordpressListingId' => $existing];
    }

    $profile_json = get_post_meta($application->ID, '_bp_profile', true);
    $profile      = $profile_json ? json_decode($profile_json, true) : [];

    $full_name = get_post_meta($application->ID, '_bp_full_name', true);
    $email     = get_post_meta($application->ID, '_bp_email', true);
    $session   = get_post_meta($application->ID, '_bp_stripe_session_id', true);

    $review_deadline = time() + (bpapi_trial_days() * DAY_IN_SECONDS);

    $social = bpapi_build_directorist_social($profile);
    $whatsapp = isset($profile['whatsapp']) ? sanitize_text_field($profile['whatsapp']) : '';

    $listing_id = wp_insert_post([
        'post_type'    => 'at_biz_dir',
        'post_status'  => 'pending',
        'post_title'   => $full_name,
        'post_content' => isset($profile['biography']) ? wp_kses_post($profile['biography']) : '',
        'meta_input'   => [
            '_stripe_session_id' => $session,
            '_bp_application_id' => $application->ID,
            '_bp_review_started' => time(),
            '_bp_review_deadline' => $review_deadline,
            // Campos estándar de Directorist
            '_email'            => $email,
            '_phone'            => isset($profile['phone']) ? sanitize_text_field($profile['phone']) : '',
            '_phone2'           => $whatsapp,
            '_website'          => isset($profile['website']) ? esc_url_raw($profile['website']) : '',
            '_address'          => isset($profile['location']) ? sanitize_text_field($profile['location']) : '',
            '_tagline'          => isset($profile['shortDescription']) ? sanitize_text_field($profile['shortDescription']) : '',
        ],
    ], true);

    if (is_wp_error($listing_id)) {
        return new WP_Error('listing_error', 'Could not create listing', ['status' => 500]);
    }

    if (!empty($social)) {
        update_post_meta($listing_id, '_social', $social);
    }

    // Categorías Directorist
    if (!empty($profile['categoryIds']) && is_array($profile['categoryIds'])) {
        $term_ids = array_map('intval', $profile['categoryIds']);
        wp_set_object_terms($listing_id, $term_ids, 'at_biz_dir-category');
    }

    update_post_meta($application->ID, '_bp_listing_id', $listing_id);
    update_post_meta($application->ID, '_bp_status', 'pending_review');

    bpapi_send_admin_new_review_email($listing_id, $application->ID, $full_name, $email);

    return ['wordpressListingId' => $listing_id];
}

/**
 * Aviso inmediato al admin cuando un perfil queda pendiente de revisión.
 */
function bpapi_send_admin_new_review_email($listing_id, $application_id, $name, $email) {
    $admin = bpapi_admin_email();
    if (!$admin) {
        return;
    }

    $plan       = get_post_meta($application_id, '_bp_plan', true) ?: 'crew';
    $edit_link  = admin_url('post.php?post=' . (int) $listing_id . '&action=edit');
    $deadline   = (int) get_post_meta($listing_id, '_bp_review_deadline', true);
    $days_left  = $deadline
        ? max(0, (int) ceil(($deadline - time()) / DAY_IN_SECONDS))
        : bpapi_trial_days();

    $subject = 'Blue Passport: nueva solicitud pendiente — ' . $name;
    $body    = "Hola,\n\n"
        . "Hay una nueva solicitud Blue Passport pendiente de revisión.\n\n"
        . "Nombre: {$name}\n"
        . ($email ? "Email: {$email}\n" : '')
        . "Plan: {$plan}\n"
        . "Plazo de revisión: {$days_left} día(s)\n\n"
        . "Para aprobar: usá «Aprobar y cobrar» (cobra primero; solo publica si el pago sale OK).\n"
        . "Revisar en WordPress:\n{$edit_link}\n\n"
        . "— The Blue Passport\n";

    wp_mail($admin, $subject, $body);
}

// ---------------------------------------------------------------------------
// CORS — permite llamadas del front (Vercel / localhost) al REST API
// ---------------------------------------------------------------------------

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', 'bpapi_send_cors_headers');
}, 15);

function bpapi_send_cors_headers($value) {
    $origin  = get_http_origin();
    $allowed = [
        bpapi_frontend_url(),
        home_url(),
        'http://localhost:5180',
        'http://localhost:5173',
    ];

    if ($origin && in_array(rtrim($origin, '/'), array_map(function ($u) { return rtrim($u, '/'); }, $allowed), true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
        header('Vary: Origin');
    }

    return $value;
}

// ---------------------------------------------------------------------------
// Aprobación segura: cobrar primero, publicar solo si Stripe confirma el pago.
// ---------------------------------------------------------------------------

/**
 * Intenta terminar el trial y cobrar. Devuelve true o WP_Error.
 *
 * @param int $listing_id
 * @return true|WP_Error
 */
function bpapi_charge_subscription_for_listing($listing_id) {
    $listing_id = (int) $listing_id;
    $session_id = get_post_meta($listing_id, '_stripe_session_id', true);

    if (!$session_id) {
        return new WP_Error('no_session', 'Este listing no tiene sesión de Stripe vinculada.');
    }

    $session = bpapi_stripe_request('GET', '/v1/checkout/sessions/' . rawurlencode($session_id));
    if (is_wp_error($session)) {
        return $session;
    }
    if (empty($session['subscription'])) {
        return new WP_Error('no_subscription', 'No se encontró la suscripción de Stripe para este listing.');
    }

    $subscription_id = $session['subscription'];
    if (is_array($subscription_id)) {
        $subscription_id = $subscription_id['id'] ?? '';
    }
    if (!$subscription_id) {
        return new WP_Error('no_subscription', 'ID de suscripción inválido.');
    }

    // Termina el trial e intenta cobrar; falla con error si el pago no se completa.
    $updated = bpapi_stripe_request('POST', '/v1/subscriptions/' . rawurlencode($subscription_id), [
        'trial_end'        => 'now',
        'payment_behavior' => 'error_if_incomplete',
        'expand[0]'        => 'latest_invoice.payment_intent',
    ]);

    if (is_wp_error($updated)) {
        return $updated;
    }

    // Si expand no trajo el objeto invoice, pedirlo aparte.
    $invoice = isset($updated['latest_invoice']) ? $updated['latest_invoice'] : null;
    if (is_string($invoice) && $invoice !== '') {
        $fetched = bpapi_stripe_request('GET', '/v1/invoices/' . rawurlencode($invoice) . '?expand[]=payment_intent');
        if (!is_wp_error($fetched)) {
            $invoice = $fetched;
        }
    }

    $status = isset($updated['status']) ? $updated['status'] : '';
    $paid   = false;

    if (is_array($invoice)) {
        $paid = (!empty($invoice['paid']) || (isset($invoice['status']) && $invoice['status'] === 'paid'));
        $pi   = isset($invoice['payment_intent']) ? $invoice['payment_intent'] : null;
        if (!$paid && is_array($pi) && !empty($pi['status']) && $pi['status'] === 'succeeded') {
            $paid = true;
        }
    }

    // Suscripción ya activa con invoice pagada, o amount_due 0 (edge case).
    if ($status === 'active' && ($paid || (is_array($invoice) && isset($invoice['amount_due']) && (int) $invoice['amount_due'] === 0))) {
        update_post_meta($listing_id, '_bp_payment_confirmed', '1');
        update_post_meta($listing_id, '_bp_paid_at', time());
        update_post_meta($listing_id, '_bp_stripe_subscription_id', $subscription_id);
        delete_post_meta($listing_id, '_bp_payment_error');
        return true;
    }

    $message = 'Stripe no confirmó el cobro.';
    if ($status && $status !== 'active') {
        $message .= ' Estado de suscripción: ' . $status . '.';
    }
    if (is_array($invoice) && !empty($invoice['status'])) {
        $message .= ' Factura: ' . $invoice['status'] . '.';
    }

    return new WP_Error('payment_failed', $message, [
        'subscription_status' => $status,
        'invoice'             => is_array($invoice) ? ($invoice['id'] ?? '') : '',
    ]);
}

/**
 * Aprobar listing: cobrar → si OK publicar; si falla dejar pending.
 *
 * @param int $listing_id
 * @return true|WP_Error
 */
function bpapi_approve_and_charge($listing_id) {
    $listing_id = (int) $listing_id;
    $post       = get_post($listing_id);

    if (!$post || $post->post_type !== 'at_biz_dir') {
        return new WP_Error('invalid_listing', 'Listing no válido.');
    }

    if ($post->post_status === 'publish' && get_post_meta($listing_id, '_bp_payment_confirmed', true)) {
        return true;
    }

    if ($post->post_status !== 'pending' && $post->post_status !== 'publish') {
        return new WP_Error('invalid_status', 'Solo se pueden aprobar listings pendientes.');
    }

    $charge = bpapi_charge_subscription_for_listing($listing_id);
    $application_id = (int) get_post_meta($listing_id, '_bp_application_id', true);

    if (is_wp_error($charge)) {
        update_post_meta($listing_id, '_bp_payment_error', $charge->get_error_message());
        update_post_meta($listing_id, '_bp_payment_failed_at', time());
        if ($application_id) {
            update_post_meta($application_id, '_bp_status', 'payment_failed');
            update_post_meta($application_id, '_bp_payment_error', $charge->get_error_message());
        }
        return $charge;
    }

    // Publicar solo después del cobro confirmado.
    $published = wp_update_post([
        'ID'          => $listing_id,
        'post_status' => 'publish',
    ], true);

    if (is_wp_error($published)) {
        update_post_meta($listing_id, '_bp_payment_error', 'Pago OK pero no se pudo publicar: ' . $published->get_error_message());
        return $published;
    }

    if ($application_id) {
        update_post_meta($application_id, '_bp_status', 'approved');
        delete_post_meta($application_id, '_bp_payment_error');
    }

    delete_post_meta($listing_id, '_bp_payment_error');
    return true;
}

/**
 * Si alguien publica a mano sin cobro confirmado, revertir a pending.
 * Listings sin sesión Stripe (creados a mano) no se bloquean.
 */
add_action('transition_post_status', 'bpapi_guard_publish_without_payment', 5, 3);

function bpapi_guard_publish_without_payment($new_status, $old_status, $post) {
    if ($post->post_type !== 'at_biz_dir' || $new_status !== 'publish' || $old_status === 'publish') {
        return;
    }

    if (get_post_meta($post->ID, '_bp_payment_confirmed', true)) {
        return;
    }

    // Solo listings del flujo Blue Passport (tienen sesión Stripe).
    if (!get_post_meta($post->ID, '_stripe_session_id', true)) {
        return;
    }

    // Evitar bucle si nosotros mismos estamos revirtiendo.
    if (get_transient('bpapi_reverting_' . $post->ID)) {
        return;
    }

    set_transient('bpapi_reverting_' . $post->ID, 1, 30);

    wp_update_post([
        'ID'          => $post->ID,
        'post_status' => 'pending',
    ]);

    update_post_meta(
        $post->ID,
        '_bp_payment_error',
        'No se puede publicar sin cobro confirmado. Usá el botón «Aprobar y cobrar».'
    );

    if (is_admin()) {
        set_transient('bpapi_admin_notice_' . get_current_user_id(), [
            'type'    => 'error',
            'message' => 'El listing sigue pendiente: primero hay que cobrar con «Aprobar y cobrar». La publicación manual quedó bloqueada.',
        ], 60);
    }

    delete_transient('bpapi_reverting_' . $post->ID);
}

// Mover un listing a papelera → cancela la suscripción sin cobrar.
add_action('wp_trash_post', 'bpapi_cancel_stripe_on_reject');

function bpapi_cancel_stripe_on_reject($post_id) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'at_biz_dir') {
        return;
    }

    $session_id = get_post_meta($post_id, '_stripe_session_id', true);
    if (!$session_id) {
        return;
    }

    // Si ya se cobró y luego se archiva, no cancelamos acá (evitar sorpresas).
    // Solo cancelar suscripciones aún en trial / no confirmadas.
    if (get_post_meta($post_id, '_bp_payment_confirmed', true)) {
        return;
    }

    $session = bpapi_stripe_request('GET', '/v1/checkout/sessions/' . rawurlencode($session_id));
    if (is_wp_error($session) || empty($session['subscription'])) {
        return;
    }

    $subscription_id = $session['subscription'];
    if (is_array($subscription_id)) {
        $subscription_id = $subscription_id['id'] ?? '';
    }
    if (!$subscription_id) {
        return;
    }

    bpapi_stripe_request('DELETE', '/v1/subscriptions/' . rawurlencode($subscription_id));

    $application_id = (int) get_post_meta($post_id, '_bp_application_id', true);
    if ($application_id) {
        update_post_meta($application_id, '_bp_status', 'rejected');
    }
}

// ---------------------------------------------------------------------------
// Admin UI — acción «Aprobar y cobrar»
// ---------------------------------------------------------------------------

add_filter('post_row_actions', 'bpapi_listing_row_actions', 20, 2);

function bpapi_listing_row_actions($actions, $post) {
    if ($post->post_type !== 'at_biz_dir' || $post->post_status !== 'pending') {
        return $actions;
    }
    if (!get_post_meta($post->ID, '_stripe_session_id', true)) {
        return $actions;
    }
    if (!current_user_can('edit_post', $post->ID)) {
        return $actions;
    }

    $url = wp_nonce_url(
        admin_url('admin-post.php?action=bpapi_approve_and_charge&listing_id=' . $post->ID),
        'bpapi_approve_' . $post->ID
    );

    $actions['bpapi_approve'] = '<a href="' . esc_url($url) . '" style="color:#0a7a3e;font-weight:600;">Aprobar y cobrar</a>';
    return $actions;
}

add_action('admin_post_bpapi_approve_and_charge', 'bpapi_handle_approve_and_charge');

function bpapi_handle_approve_and_charge() {
    if (!current_user_can('edit_posts')) {
        wp_die('Forbidden');
    }

    $listing_id = isset($_GET['listing_id']) ? (int) $_GET['listing_id'] : 0;
    check_admin_referer('bpapi_approve_' . $listing_id);

    $result = bpapi_approve_and_charge($listing_id);

    if (is_wp_error($result)) {
        set_transient('bpapi_admin_notice_' . get_current_user_id(), [
            'type'    => 'error',
            'message' => 'No se pudo cobrar. El listing sigue pendiente. Motivo: ' . $result->get_error_message(),
        ], 120);
    } else {
        set_transient('bpapi_admin_notice_' . get_current_user_id(), [
            'type'    => 'success',
            'message' => 'Pago confirmado. Listing publicado.',
        ], 120);
    }

    $redirect = wp_get_referer();
    if (!$redirect) {
        $redirect = admin_url('edit.php?post_type=at_biz_dir');
    }
    wp_safe_redirect($redirect);
    exit;
}

add_action('add_meta_boxes', 'bpapi_add_payment_metabox');

function bpapi_add_payment_metabox() {
    add_meta_box(
        'bpapi_payment_box',
        'Blue Passport — Cobro',
        'bpapi_render_payment_metabox',
        'at_biz_dir',
        'side',
        'high'
    );
}

function bpapi_render_payment_metabox($post) {
    $session_id  = get_post_meta($post->ID, '_stripe_session_id', true);
    $confirmed   = get_post_meta($post->ID, '_bp_payment_confirmed', true);
    $error       = get_post_meta($post->ID, '_bp_payment_error', true);
    $paid_at     = (int) get_post_meta($post->ID, '_bp_paid_at', true);

    if (!$session_id) {
        echo '<p style="margin:0;">Este listing no pertenece al flujo Blue Passport (sin sesión Stripe).</p>';
        return;
    }

    if ($confirmed) {
        echo '<p style="margin:0 0 8px;"><strong style="color:#0a7a3e;">Pago confirmado</strong></p>';
        if ($paid_at) {
            echo '<p style="margin:0;color:#555;">' . esc_html(gmdate('Y-m-d H:i', $paid_at)) . ' UTC</p>';
        }
        return;
    }

    echo '<p style="margin:0 0 10px;">Estado: <strong>sin cobro</strong>. El listing no se publicará hasta cobrar.</p>';

    if ($error) {
        echo '<p style="margin:0 0 10px;padding:8px;background:#fff3f3;border-left:3px solid #d63638;"><strong>Último error:</strong><br>' . esc_html($error) . '</p>';
    }

    if ($post->post_status === 'pending' && current_user_can('edit_post', $post->ID)) {
        $url = wp_nonce_url(
            admin_url('admin-post.php?action=bpapi_approve_and_charge&listing_id=' . $post->ID),
            'bpapi_approve_' . $post->ID
        );
        echo '<p style="margin:0;"><a class="button button-primary" href="' . esc_url($url) . '">Aprobar y cobrar</a></p>';
        echo '<p class="description" style="margin-top:8px;">Stripe intentará cobrar el año. Solo si el pago sale OK se publica el perfil.</p>';
    }
}

add_action('admin_notices', 'bpapi_render_admin_notices');

function bpapi_render_admin_notices() {
    $notice = get_transient('bpapi_admin_notice_' . get_current_user_id());
    if (!$notice || empty($notice['message'])) {
        return;
    }
    delete_transient('bpapi_admin_notice_' . get_current_user_id());

    $class = (!empty($notice['type']) && $notice['type'] === 'success') ? 'notice-success' : 'notice-error';
    echo '<div class="notice ' . esc_attr($class) . ' is-dismissible"><p>' . esc_html($notice['message']) . '</p></div>';
}

// ---------------------------------------------------------------------------
// WP-Cron diario — recordatorio día 5 + auto-rechazo día 7
// ---------------------------------------------------------------------------

register_activation_hook(__FILE__, 'bpapi_activate_plugin');
register_deactivation_hook(__FILE__, 'bpapi_deactivate_plugin');

function bpapi_activate_plugin() {
    if (!wp_next_scheduled('bpapi_daily_review_check')) {
        wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', 'bpapi_daily_review_check');
    }
}

function bpapi_deactivate_plugin() {
    $timestamp = wp_next_scheduled('bpapi_daily_review_check');
    if ($timestamp) {
        wp_unschedule_event($timestamp, 'bpapi_daily_review_check');
    }
}

// Por si el plugin se subió sobrescribiendo el archivo sin reactivar.
add_action('init', 'bpapi_ensure_cron_scheduled');

function bpapi_ensure_cron_scheduled() {
    if (!wp_next_scheduled('bpapi_daily_review_check')) {
        wp_schedule_event(time() + HOUR_IN_SECONDS, 'daily', 'bpapi_daily_review_check');
    }
}

add_action('bpapi_daily_review_check', 'bpapi_run_daily_review_check');

function bpapi_run_daily_review_check() {
    $listings = get_posts([
        'post_type'      => 'at_biz_dir',
        'post_status'    => 'pending',
        'posts_per_page' => 100,
        'meta_query'     => [
            [
                'key'     => '_stripe_session_id',
                'compare' => 'EXISTS',
            ],
        ],
    ]);

    if (empty($listings)) {
        return;
    }

    $now            = time();
    $reminder_after = bpapi_reminder_days() * DAY_IN_SECONDS;
    $deadline_days  = bpapi_trial_days() * DAY_IN_SECONDS;

    foreach ($listings as $listing) {
        $started  = (int) get_post_meta($listing->ID, '_bp_review_started', true);
        $deadline = (int) get_post_meta($listing->ID, '_bp_review_deadline', true);

        if (!$started) {
            $started = strtotime($listing->post_date_gmt . ' GMT');
            update_post_meta($listing->ID, '_bp_review_started', $started);
        }

        if (!$deadline) {
            $deadline = $started + $deadline_days;
            update_post_meta($listing->ID, '_bp_review_deadline', $deadline);
        }

        $age = $now - $started;

        // Día 7+: auto-rechazar ANTES de que Stripe cobre al terminar el trial.
        if ($now >= $deadline || $age >= $deadline_days) {
            bpapi_auto_reject_listing($listing);
            continue;
        }

        // Día 5+: recordatorio al admin (una sola vez).
        if ($age >= $reminder_after && !get_post_meta($listing->ID, '_bp_reminder_sent', true)) {
            bpapi_send_admin_reminder($listing, $deadline);
            update_post_meta($listing->ID, '_bp_reminder_sent', '1');
        }
    }
}

function bpapi_send_admin_reminder($listing, $deadline) {
    $admin = bpapi_admin_email();
    if (!$admin) {
        return;
    }

    $name       = $listing->post_title;
    $edit_link  = admin_url('post.php?post=' . $listing->ID . '&action=edit');
    $days_left  = max(0, (int) ceil(($deadline - time()) / DAY_IN_SECONDS));
    $email_meta = get_post_meta($listing->ID, '_email', true);

    $subject = sprintf('Blue Passport: quedan %d días para revisar a %s', $days_left, $name);
    $body    = "Hola,\n\n"
        . "Hay una solicitud Blue Passport pendiente de revisión.\n\n"
        . "Nombre: {$name}\n"
        . ($email_meta ? "Email: {$email_meta}\n" : '')
        . "Plazo restante: ~{$days_left} día(s)\n"
        . "Si no se aprueba o rechaza a tiempo, el sistema la rechazará automáticamente y no se cobrará nada.\n\n"
        . "Para aprobar: usá «Aprobar y cobrar» (cobra primero; solo publica si el pago sale OK).\n"
        . "Revisar en WordPress:\n{$edit_link}\n\n"
        . "— The Blue Passport\n";

    wp_mail($admin, $subject, $body);
}

function bpapi_auto_reject_listing($listing) {
    $email = get_post_meta($listing->ID, '_email', true);
    $name  = $listing->post_title;

    // Dispara bpapi_cancel_stripe_on_reject → cancela suscripción sin cobro.
    wp_trash_post($listing->ID);

    $application_id = (int) get_post_meta($listing->ID, '_bp_application_id', true);
    if ($application_id) {
        update_post_meta($application_id, '_bp_status', 'auto_rejected');
    }

    update_post_meta($listing->ID, '_bp_auto_rejected', '1');

    if ($email) {
        bpapi_send_applicant_auto_reject_email($email, $name);
    }

    $admin = bpapi_admin_email();
    if ($admin) {
        wp_mail(
            $admin,
            'Blue Passport: solicitud auto-rechazada — ' . $name,
            "La solicitud de {$name} fue rechazada automáticamente al cumplirse el plazo de revisión de "
            . bpapi_trial_days() . " días. No se realizó ningún cobro.\n\n"
            . "Listing ID: {$listing->ID}\n"
        );
    }
}

function bpapi_send_applicant_auto_reject_email($email, $name) {
    $contact = bpapi_contact_email();
    $subject = 'Blue Passport — update on your application';
    $body    = "Hello {$name},\n\n"
        . "Thank you for applying to The Blue Passport.\n\n"
        . "Our team was not able to complete the review of your profile within the "
        . bpapi_trial_days() . "-day review window, so your application was not published this time.\n\n"
        . "No charge was made to your card.\n\n"
        . "You are welcome to contact us or apply again if you would like to continue.\n"
        . ($contact ? "Contact: {$contact}\n\n" : "\n")
        . "Kind regards,\nThe Blue Passport team\n";

    wp_mail($email, $subject, $body);
}
