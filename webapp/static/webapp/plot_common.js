Chart.defaults.global.animation = 0;
Chart.defaults.global.title.display = true;

window.desktop_point_radius = 1;
window.desktop_point_hit_radius = 5;
window.desktop_line_width = 2;
window.desktop_axes_font_size = 15;

window.mobile_point_radius = 0;
window.mobile_point_hit_radius = 3;
window.mobile_line_width = 1;
window.mobile_axes_font_size = 10;


function alert_errors_msg(errors_msg) {
    general_error_msg = '';
    for (i = 0; i < errors_msg.length; i++) {
        general_error_msg += errors_msg[i] + '\n';
    }
    if (general_error_msg.length != 0) {
        alert(general_error_msg);
    }
}


function random_in_range(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}


function get_random_colors(num) {
    var random_colors = [];
    for (var i = 0; i < num; i++) {
        var r = random_in_range(0, 255);
        var g = random_in_range(0, 255);
        var b = 520 - r - g;
        if (b > 255) {b = 255}
        var b = random_in_range(0, b);
        random_colors.push('rgb(' + r + ',' + g + ',' + b + ')');
    }
    return random_colors;
}


function get_input_params(params_value, params_check, suffix, dict) {
    for (i = 0; i < params_value.length; i++) {
        tmp = $('#' + params_value[i] + '-' + suffix).val();
        if (typeof tmp !== 'undefined') {
            dict[params_value[i]] = tmp;
        }
    }
    for (i = 0; i < params_check.length; i++) {
        if ($('#' + params_check[i] + '-' + suffix).prop('checked')) {
            dict[params_check[i]] = 'on';
        }
    }
}


function is_mobile() {
    return screen.width < 768;
}


function get_point_radius() {
    if (is_mobile()) {
        return window.mobile_point_radius;
    }
    else {
        return window.desktop_point_radius;
    }
}


function get_point_hit_radius() {
    if (is_mobile()) {
        return window.mobile_point_hit_radius;
    }
    else {
        return window.desktop_point_hit_radius;
    }
}


function get_line_width() {
    if (is_mobile()) {
        return window.mobile_line_width;
    }
    else {
        return window.desktop_line_width;
    }
}


function get_axes_font_size() {
    if (is_mobile()) {
        return window.mobile_axes_font_size;
    }
    else {
        return window.desktop_axes_font_size;
    }
}
