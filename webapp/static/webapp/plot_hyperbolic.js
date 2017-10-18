function get_input_hyperbolic() {
    params_value = ['a', 'b', 'c', 'e', 'f',
                'alpha', 'beta', 'phi_0',
                'delta', 'gamma', 'phi_l',
                'psi_1', 'psi_2',
                'min_x', 'max_x', 'max_t',
                'K', 'N',
                'analytic_solution'];
    params_check = ['explicit', 'implicit',
                    'o1p2', 'o2p2', 'o2p3',
                    'init_1', 'init_2'];
    d = {};
    get_input_params(params_value, params_check, 'hyperbolic', d);
    return d;
}

var prepare_solutions_datasets_hyperbolic = prepare_solutions_datasets_parabolic;
var prepare_errors_datasets_hyperbolic = prepare_errors_datasets_parabolic;
var plot_data_hyperbolic = plot_data_parabolic;
var plot_errors_hyperbolic = plot_errors_parabolic;


$(document).ready(function() {
    window.hyperbolic_solution_plot_chart = undefined;
    window.hyperbolic_error_plot_chart = undefined;
    window.hyperbolic_sol_canvas_id = "hyperbolic_solutions";
    window.hyperbolic_err_canvas_id = "hyperbolic_errors";

    $('#hyperbolic_solve_btn').click(function() {
        get_request_data = get_input_hyperbolic();
        $.getJSON("/solution/hyperbolic", get_request_data, function(solutions) {
            alert_errors_msg(solutions.errors_msg);
            window.hyperbolic_ds = prepare_solutions_datasets_hyperbolic(solutions);
            if (typeof window.hyperbolic_ds !== 'undefined' && window.hyperbolic_ds.length != 0) {
                window.hyperbolic_solution_plot_chart =
                    plot_data_hyperbolic(window.hyperbolic_solution_plot_chart,
                        window.hyperbolic_sol_canvas_id,
                        window.hyperbolic_ds,
                        0,
                        'x', 'U(x,t)');
            }
            window.hyperbolic_err_ds = prepare_errors_datasets_hyperbolic(solutions);
            if (typeof window.hyperbolic_err_ds !== 'undefined' && window.hyperbolic_err_ds.length != 0) {
                window.hyperbolic_error_plot_chart =
                    plot_errors_hyperbolic(window.hyperbolic_error_plot_chart,
                        window.hyperbolic_err_canvas_id,
                        window.hyperbolic_err_ds,
                        't');
            }
        })
        .fail(function() { alert('Не удается связаться с сервером') });

        change_giperb_t();

        var hyperbSlider = document.getElementById('time_hyperb');
        hyperbSlider.noUiSlider.on('update', function(values, handle) {
            var step_t = parseFloat(window.hyperbolic_current_max_t / window.hyperbolic_current_step_t_count);
		    var cur_step_t_num = Math.round(values[handle] / step_t);

		    if (isNaN(cur_step_t_num)) {
                return;
            }
		    if (typeof window.hyperbolic_ds !== 'undefined' && window.hyperbolic_ds.length != 0) {
                window.hyperbolic_solution_plot_chart =
                    plot_data_hyperbolic(window.hyperbolic_solution_plot_chart,
                        window.hyperbolic_sol_canvas_id,
                        window.hyperbolic_ds,
                        cur_step_t_num,
                        'x', 'U(x,t)');
            }
	    });
    });
});
