function get_input_parabolic() {
    params_value = ['a', 'b', 'c', 'f',
                'alpha', 'beta', 'phi_0',
                'delta', 'gamma', 'phi_l',
                'psi',
                'min_x', 'max_x', 'max_t',
                'K', 'N',
                'analytic_solution'];
    params_check = ['explicit', 'implicit', 'crank_nicolson',
                    'o1p2', 'o2p2', 'o2p3'];
    d = {};
    get_input_params(params_value, params_check, 'parabolic', d);
    return d;
}


function prepare_solutions_datasets_parabolic(solutions) {
    if (solutions.data.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data.length);
    var max_step_t = solutions.data[0].y.length;
    var prepared_ds = [];

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    for (var t = 0; t < max_step_t; t++) {
        ds = [];
        solutions.data.forEach(function(item, i, _) {
            d = [];
            item.y[t].forEach(function(cur_y, j, _) {
                d.push({x: solutions.x[j], y: cur_y});
            });
            ds.push({
                label: item.label,
                fill: false,
                pointRadius: pr,
                pointHitRadius: phr,
                borderWidth: lw,
                backgroundColor: graph_random_colors[i],
                borderColor: graph_random_colors[i],
                data: d});
        });
        prepared_ds.push(ds);
    }
    return prepared_ds;
}


function prepare_errors_datasets_parabolic(solutions) {
    if (solutions.data_errors.length == 0) {
        return [];
    }
    graph_random_colors = get_random_colors(solutions.data_errors.length);

    var pr = get_point_radius();
    var phr = get_point_hit_radius();
    var lw = get_line_width();

    var prepared_err_ds = [];

    solutions.data_errors.forEach(function(item, i, _) {
        d = [];
        item.y.forEach(function(cur_y, j, _) {
            d.push({x: solutions.t[j], y: cur_y});
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


function plot_data_parabolic(chart_obj, canvas_id, ds, step_t, label_x, label_y) {
    ctx = document.getElementById(canvas_id);

	if (typeof ds === 'undefined' || ds.length == 0) {
		return;
	}

    if (typeof chart_obj !== 'undefined') {
        chart_obj.destroy();
    }

	Chart.defaults.global.title.text = "Решение";

    var font_size = get_axes_font_size();

	return new Chart(ctx, {
        type: 'line',
        data: {
        	datasets: ds[step_t]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: label_x,
                        fontSize: font_size,
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: label_y,
                        fontSize: font_size,
                    }
                }]
            }
        }
    });
}


function plot_errors_parabolic(chart_obj, canvas_id, ds, label_x) {
	ctx = document.getElementById(canvas_id);

	if (typeof ds === 'undefined' || ds.length == 0) {
		return;
	}

    if (typeof chart_obj !== 'undefined') {
      chart_obj.destroy();
    }

	Chart.defaults.global.title.text = "Погрешность";

    var font_size = get_axes_font_size();

	return new Chart(ctx, {
        type: 'line',
        data: {
        	datasets: ds
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: label_x,
                        fontSize: font_size,
                    }
                }],
            }
        }
    });
}


$(document).ready(function() {
    window.parabolic_solution_plot_chart = undefined;
    window.parabolic_error_plot_chart = undefined;
    window.parabolic_sol_canvas_id = "parabolic_solutions";
    window.parabolic_err_canvas_id = "parabolic_errors";

    $('#parabolic_solve_btn').click(function() {

        get_request_data = get_input_parabolic();
        $.getJSON("/solution/parabolic", get_request_data, function(solutions) {
            alert_errors_msg(solutions.errors_msg);
            window.parabolic_ds = prepare_solutions_datasets_parabolic(solutions);
            if (typeof window.parabolic_ds !== 'undefined' && window.parabolic_ds.length != 0) {
                window.parabolic_solution_plot_chart =
                    plot_data_parabolic(window.parabolic_solution_plot_chart,
                        window.parabolic_sol_canvas_id,
                        window.parabolic_ds,
                        0,
                        'x', 'U(x,t)');
            }
            window.parabolic_err_ds = prepare_errors_datasets_parabolic(solutions);
            if (typeof window.parabolic_err_ds !== 'undefined' && window.parabolic_err_ds.length != 0) {
                window.parabolic_error_plot_chart =
                    plot_errors_parabolic(window.parabolic_error_plot_chart,
                        window.parabolic_err_canvas_id,
                        window.parabolic_err_ds,
                        't');

            }
        })
        .fail(function() { alert('Не удается связаться с сервером') });

        change_par_t();

        var parabSlider = document.getElementById('time_val_par');
        parabSlider.noUiSlider.on('update', function(values, handle) {
            var step_t = parseFloat(window.parabolic_current_max_t / window.parabolic_current_step_t_count);
		    var cur_step_t_num = Math.round(values[handle] / step_t);

		    if (isNaN(cur_step_t_num)) {
                return;
            }
		    if (typeof window.parabolic_ds !== 'undefined' && window.parabolic_ds.length != 0) {
                window.parabolic_solution_plot_chart =
                    plot_data_parabolic(window.parabolic_solution_plot_chart,
                        window.parabolic_sol_canvas_id,
                        window.parabolic_ds,
                        cur_step_t_num,
                        'x', 'U(x,t)');
            }
	    });
    });
});
