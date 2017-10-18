function get_input_elliptic() {
    params_value = ['b_x', 'b_y', 'c', 'f',
                'alpha_1', 'beta_1', 'phi_1',
                'alpha_2', 'beta_2', 'phi_2',
                'alpha_3', 'beta_3', 'phi_3',
                'alpha_4', 'beta_4', 'phi_4',
                'min_x', 'max_x',
                'min_y', 'max_y',
                'N_X', 'N_Y',
                'eps', 'relax',
                'analytic_solution'];
    params_check = ['libman', 'seidel', 'sor'];
    d = {};
    get_input_params(params_value, params_check, 'elliptic', d);
    return d;
}


function prepare_solutions_datasets_x_elliptic(solutions) {
    if (solutions.data.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data.length);
    var max_step_x = solutions.x.length;
    var prepared_ds = [];

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    for (var x = 0; x < max_step_x; x++) {
        ds = [];
        solutions.data.forEach(function(item, i, _) {
            d = [];
            item.y[x].forEach(function(cur_y, j, _) {
                d.push({x: solutions.y[j], y: cur_y});
            });
            ds.push({
                label: item.label,
                fill: false,
                pointRadius: pr,
                pointHitRadius: phr,
                borderWidth: lw,
                backgroundColor: graph_random_colors[i],
                borderColor: graph_random_colors[i],
                data: d})
        });
        prepared_ds.push(ds);
    }
    return prepared_ds;
}


function prepare_solutions_datasets_y_elliptic(solutions) {
    if (solutions.data.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data.length);
    var max_step_y = solutions.y.length;
    var prepared_ds = [];

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    for (var y = 0; y < max_step_y; y++) {
        ds = [];
        solutions.data.forEach(function(item, i, _) {
            d = [];

            item.y.forEach(function(cur_x, j, _) {
                d.push({x: solutions.x[j], y: cur_x[y]});
            });
            ds.push({
                label: item.label,
                fill: false,
                pointRadius: pr,
                pointHitRadius: phr,
                borderWidth: lw,
                backgroundColor: graph_random_colors[i],
                borderColor: graph_random_colors[i],
                data: d})
        });
        prepared_ds.push(ds);
    }
    return prepared_ds;
}


function prepare_errors_datasets_x_elliptic(solutions) {
    if (solutions.data_errors_x.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data_errors_x.length);

    var prepared_err_ds = [];

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    solutions.data_errors_x.forEach(function(item, i, _) {
        d = [];
        item.y.forEach(function(cur_y, j, _) {
            d.push({x: solutions.x[j], y: cur_y});
        });
        prepared_err_ds.push({
            label: item.label,
            fill: false,
            pointRadius: pr,
            pointHitRadius: phr,
            borderWidth: lw,
            backgroundColor: graph_random_colors[i],
            borderColor: graph_random_colors[i],
            data: d});
    });
    return prepared_err_ds;
}


function prepare_errors_datasets_y_elliptic(solutions) {
    if (solutions.data_errors_y.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data_errors_y.length);

    var prepared_err_ds = [];

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    solutions.data_errors_y.forEach(function(item, i, _) {
        d = [];
        item.y.forEach(function(cur_y, j, _) {
            d.push({x: solutions.y[j], y: cur_y});
        });
        prepared_err_ds.push({
            label: item.label,
            fill: false,
            pointRadius: pr,
            pointHitRadius: phr,
            borderWidth: lw,
            backgroundColor: graph_random_colors[i],
            borderColor: graph_random_colors[i],
            data: d});
    });
    return prepared_err_ds;
}


var plot_data_elliptic = plot_data_parabolic;
var plot_errors_elliptic = plot_errors_parabolic;


$(document).ready(function() {
    window.elliptic_solution_plot_chart_x = undefined;
    window.elliptic_solution_plot_chart_y = undefined;

    window.elliptic_error_plot_chart_x = undefined;
    window.elliptic_error_plot_chart_y = undefined;

    window.elliptic_sol_x_canvas_id = "elliptic_solutions_x";
    window.elliptic_sol_y_canvas_id = "elliptic_solutions_y";

    window.elliptic_err_x_canvas_id = "elliptic_errors_x";
    window.elliptic_err_y_canvas_id = "elliptic_errors_y";

    $('#elliptic_solve_btn').click(function() {
        get_request_data = get_input_elliptic();
        $.getJSON("/solution/elliptic", get_request_data, function(solutions) {
            alert_errors_msg(solutions.errors_msg);

            window.elliptic_ds_x = prepare_solutions_datasets_x_elliptic(solutions);
            window.elliptic_ds_y = prepare_solutions_datasets_y_elliptic(solutions);

            if (typeof window.elliptic_ds_x !== 'undefined' && window.elliptic_ds_x.length != 0) {
                window.elliptic_solution_plot_chart_x =
                    plot_data_elliptic(window.elliptic_solution_plot_chart_x,
                        window.elliptic_sol_x_canvas_id,
                        window.elliptic_ds_x,
                        0,
                        'y', 'U(x,y)');
            }

            if (typeof window.elliptic_ds_y !== 'undefined' && window.elliptic_ds_y.length != 0) {
                window.elliptic_solution_plot_chart_y =
                    plot_data_elliptic(window.elliptic_solution_plot_chart_y,
                        window.elliptic_sol_y_canvas_id,
                        window.elliptic_ds_y,
                        0,
                        'x', 'U(x,y)');
            }

            window.elliptic_err_ds_x = prepare_errors_datasets_x_elliptic(solutions);
            window.elliptic_err_ds_y = prepare_errors_datasets_y_elliptic(solutions);

            if (typeof window.elliptic_err_ds_x !== 'undefined' && window.elliptic_err_ds_x.length != 0) {
                window.elliptic_error_plot_chart_x =
                    plot_errors_elliptic(window.elliptic_error_plot_chart_x,
                        window.elliptic_err_x_canvas_id,
                        window.elliptic_err_ds_x,
                        'x');
            }

            if (typeof window.elliptic_err_ds_y !== 'undefined' && window.elliptic_err_ds_y.length != 0) {
                window.elliptic_error_plot_chart_y =
                    plot_errors_elliptic(window.elliptic_error_plot_chart_y,
                        window.elliptic_err_y_canvas_id,
                        window.elliptic_err_ds_y,
                        'y');
            }
        })
        .fail(function() { alert('Не удается связаться с сервером') });

        change_ellipt_x();

        var elliptSlider_x = document.getElementById('ellipt_x');
        elliptSlider_x.noUiSlider.on('update', function(values, handle) {
            var step_x = parseFloat(window.elliptic_current_len_x / window.elliptic_current_step_x_count);
		    var cur_step_x_num = Math.round(values[handle] / step_x);

		    if (isNaN(cur_step_x_num)) {
                return;
            }

		    if (typeof window.elliptic_ds_x !== 'undefined' && window.elliptic_ds_x.length != 0) {
                window.elliptic_solution_plot_chart_x =
                    plot_data_elliptic(window.elliptic_solution_plot_chart_x,
                        window.elliptic_sol_x_canvas_id,
                        window.elliptic_ds_x,
                        cur_step_x_num,
                        'y', 'U(x,y)');
            }
	    });

        change_ellipt_y();

	    var elliptSlider_y = document.getElementById('ellipt_y');
        elliptSlider_y.noUiSlider.on('update', function(values, handle) {
            var step_y = parseFloat(window.elliptic_current_len_y / window.elliptic_current_step_y_count);
		    var cur_step_y_num = Math.round(values[handle] / step_y);

		    if (isNaN(cur_step_y_num)) {
                return;
            }
		    if (typeof window.elliptic_ds_y !== 'undefined' && window.elliptic_ds_y.length != 0) {
                window.elliptic_solution_plot_chart_y =
                    plot_data_elliptic(window.elliptic_solution_plot_chart_y,
                        window.elliptic_sol_y_canvas_id,
                        window.elliptic_ds_y,
                        cur_step_y_num,
                        'x', 'U(x,y)');
            }
	    });
    });
});
