import json
from django.http import HttpResponse
from solution.finite_difference.elliptic_pde import EllipticPDE
from solution.finite_difference.common.arithmetic_parser import FunctionFromStr

MAX_STEP_NUM_X = 20
MAX_STEP_NUM_Y = 20
MAX_ITERATIONS_NUM = 3000


def pretty_label(label):
    d = dict(libman='Либман',
             seidel='Зейдель',
             sor='Верхняя релаксация')

    return d[label] if label in d else 'Unknown'


def unpack_params(rget):
    main_args_names = ['b_x', 'b_y', 'c', 'f']
    bound_1_names = ['alpha_1', 'beta_1', 'phi_1']
    bound_2_names = ['alpha_2', 'beta_2', 'phi_2']
    bound_3_names = ['alpha_3', 'beta_3', 'phi_3']
    bound_4_names = ['alpha_4', 'beta_4', 'phi_4']
    grid_params_names = ['N_X', 'N_Y', 'min_x', 'max_x', 'min_y', 'max_y']
    methods_names = ['libman', 'seidel', 'sor']
    eps_name = 'eps'
    relax_name = 'relax'
    analytic_sol_name = 'analytic_solution'

    params = {}

    try:
        params['main_args'] = [float(rget[x]) if x not in ('f',) else FunctionFromStr(rget[x])
                               for x in main_args_names]
        params['bound_1'] = [float(rget[x]) if x not in ('phi_1',) else FunctionFromStr(rget[x])
                             for x in bound_1_names]
        params['bound_2'] = [float(rget[x]) if x not in ('phi_2',) else FunctionFromStr(rget[x])
                             for x in bound_2_names]
        params['bound_3'] = [float(rget[x]) if x not in ('phi_3',) else FunctionFromStr(rget[x])
                             for x in bound_3_names]
        params['bound_4'] = [float(rget[x]) if x not in ('phi_4',) else FunctionFromStr(rget[x])
                             for x in bound_4_names]
        params['grid_params'] = [rget[x] for x in grid_params_names]
        params['methods'] = [x for x in methods_names if x in rget and rget[x] == 'on']
        params['eps'] = float(rget[eps_name])

        if relax_name in rget:
            params['relax'] = float(rget[relax_name])
        else:
            params['relax'] = None

        if analytic_sol_name in rget and len(rget[analytic_sol_name]) != 0:
            params['analytic_sol'] = FunctionFromStr(rget[analytic_sol_name])
        else:
            params['analytic_sol'] = None

    except KeyError as e:
        print('*********************')
        print('unpack_params: Exception KeyError:', e)
        return None
    except ValueError as e:
        print('*********************')
        print('unpack_params: Exception ValueError:', e)
        return None
    except Exception as e:
        print('*********************')
        print('unpack_params: Exception:', e)
        return None

    return params


def validate_params(params, errors):
    # Set functions arguments
    params['main_args'][-1].set_args_name('x', 'y')
    params['bound_1'][-1].set_args_name('y')
    params['bound_2'][-1].set_args_name('y')
    params['bound_3'][-1].set_args_name('x')
    params['bound_4'][-1].set_args_name('x')

    b_x, b_y, c, f = params['main_args']
    alpha_1, beta_1, phi_1 = params['bound_1']
    alpha_2, beta_2, phi_2 = params['bound_2']
    alpha_3, beta_3, phi_3 = params['bound_3']
    alpha_4, beta_4, phi_4 = params['bound_4']
    N_X, N_Y = map(int, params['grid_params'][:2])
    min_x, max_x, min_y, max_y = map(float, params['grid_params'][2:])
    step_x = (max_x - min_x) / N_X
    step_y = (max_y - min_y) / N_Y

    if len(params['methods']) == 0:
        errors.append("Не выбран метод решения")
        return False

    if alpha_1 == 0 and beta_1 == 0:
        errors.append("Коэффициенты alpha_1 и beta_1 не должны быть оба равны нулю")
        return False

    if alpha_2 == 0 and beta_2 == 0:
        errors.append("Коэффициенты alpha_2 и beta_2 не должны быть оба равны нулю")
        return False

    if alpha_3 == 0 and beta_3 == 0:
        errors.append("Коэффициенты alpha_3 и beta_3 не должны быть оба равны нулю")
        return False

    if alpha_4 == 0 and beta_4 == 0:
        errors.append("Коэффициенты alpha_4 и beta_4 не должны быть оба равны нулю")
        return False

    if max_x <= min_x:
        errors.append("Необходимо l0 < l1")
        return False

    if max_y <= min_y:
        errors.append("Необходимо d0 < d1")
        return False

    if params['eps'] < 0:
        errors.append("Точность решения eps = {} установлена в минимально возможное значение = 0".format(params['eps']))
        params['eps'] = 0

    not_valid_funcs = []
    f(0, 0)  # runtime check
    if not f.valid:
        not_valid_funcs.append('f(x, t)')
    phi_1(0)
    if not phi_1.valid:
        not_valid_funcs.append('phi_1(y)')
    phi_2(0)
    if not phi_2.valid:
        not_valid_funcs.append('phi_2(y)')
    phi_3(0)
    if not phi_3.valid:
        not_valid_funcs.append('phi_3(x)')
    phi_4(0)
    if not phi_4.valid:
        not_valid_funcs.append('phi_4(x)')
    if len(not_valid_funcs) != 0:
        errors.append("Функции заданы некорректно: " + ', '.join(not_valid_funcs))
        return False

    if ('sor' in params['methods'] and
            (params['relax'] is None or params['relax'] <= 1 or params['relax'] >= 2)):
        errors.append("Для метода верхней релаксации должен быть задан параметр релаксации в интервале (1;2)")
        params['methods'].remove('sor')

    if params['analytic_sol'] is not None:
        params['analytic_sol'].set_args_name('x', 'y')
        params['analytic_sol'](0, 0)
        if not params['analytic_sol'].valid:
            errors.append("Функция аналитического решения U(x, t) задана некорректно")
            params['analytic_sol'] = None

    if N_X > MAX_STEP_NUM_X:
        errors.append("Количество шагов по x ограничено максимальным значением = {}".format(MAX_STEP_NUM_X))
        params['grid_params'][0] = MAX_STEP_NUM_X

    if N_Y > MAX_STEP_NUM_Y:
        errors.append("Количество шагов по y ограничено максимальным значением = {}".format(MAX_STEP_NUM_Y))
        params['grid_params'][1] = MAX_STEP_NUM_Y

    return True


def calc_errors_x(sol_a, sol_b):
    f = lambda x, y: abs(x - y)
    return [max(map(f, sol_a[i], sol_b[i])) for i in range(min(len(sol_a), len(sol_b)))]


def calc_errors_y(sol_a, sol_b):
    sol_a = list(zip(*sol_a))
    sol_b = list(zip(*sol_b))
    f = lambda x, y: abs(x - y)
    return [max(map(f, sol_a[i], sol_b[i])) for i in range(min(len(sol_a), len(sol_b)))]


def elliptic(request):
    datasets = {'x': [],
                'y': [],
                'data': [],
                'data_errors_x': [],
                'data_errors_y': [],
                'errors_msg': []}

    params = unpack_params(request.GET)
    if params is None:
        datasets['errors_msg'].append('Указаны не все параметры или параметры указаны неверно')
        return HttpResponse(json.dumps(datasets), content_type='application/json')

    if not validate_params(params, datasets['errors_msg']):
        return HttpResponse(json.dumps(datasets), content_type='application/json')

    N_X, N_Y = map(int, params['grid_params'][:2])
    min_x, max_x, min_y, max_y = map(float, params['grid_params'][2:])
    step_x = (max_x - min_x) / N_X
    step_y = (max_y - min_y) / N_Y

    x_list = [step_x * nx for nx in range(N_X + 1)]
    datasets['x'] = x_list

    y_list = [step_y * ny for ny in range(N_Y + 1)]
    datasets['y'] = y_list

    b_x, b_y, c, f = params['main_args']
    alpha_1, beta_1, phi_1 = params['bound_1']
    alpha_2, beta_2, phi_2 = params['bound_2']
    alpha_3, beta_3, phi_3 = params['bound_3']
    alpha_4, beta_4, phi_4 = params['bound_4']

    EllipticPDE.set_max_iterations_num(MAX_ITERATIONS_NUM)
    solver_factory = EllipticPDE(b_x, b_y, c, f,
                                 alpha_1, beta_1, phi_1,
                                 alpha_2, beta_2, phi_2,
                                 alpha_3, beta_3, phi_3,
                                 alpha_4, beta_4, phi_4,
                                 min_x, max_x,
                                 min_y, max_y,
                                 N_X, N_Y)

    u = params['analytic_sol']
    analytic_data = None
    if params['analytic_sol'] is not None:
        analytic_data = []
        for x in x_list:
            analytic_data.append([u(x, y) for y in y_list])
        datasets['data'].append({'label': 'Аналитическое решение',
                                 'y': analytic_data})

    for method in params['methods']:
        try:
            if method == 'libman':
                solver = solver_factory.libman()
            elif method == 'seidel':
                solver = solver_factory.seidel()
            elif method == 'sor':
                solver = solver_factory.sor(params['relax'])
            else:
                print('*********************')
                print('Unknown method name while solving elliptic:', method)
                continue
            cur_solution = solver.solve(params['eps'])
            if solver.cur_iter_num > solver.max_iter_num:
                datasets['errors_msg'].append("""Итерационный метод '{0}' достиг максимального количества итераций = {1}.
Точность в последней итерации = {2}.""".format(pretty_label(method),
                                               solver.max_iter_num,
                                               solver.final_eps))
        except Exception as e:
            print('*********************')
            print('elliptic: exception while solving', method)
            print('Parameters:')
            for k in params.keys():
                print(k, ':', params[k])
            print(e)
            datasets['errors_msg'].append(
                'Не удается решить: {0}, попробуйте поменять параметры решения'.format(pretty_label(method)))
            continue

        plot_data = {'label': '{0}'.format(pretty_label(method)),
                     'y': cur_solution}

        datasets['data'].append(plot_data)

        if analytic_data is not None:
            datasets['data_errors_x'].append({'label': '{0}'.format(pretty_label(method)),
                                              'y': calc_errors_x(analytic_data, cur_solution)})
            datasets['data_errors_y'].append({'label': '{0}'.format(pretty_label(method)),
                                              'y': calc_errors_y(analytic_data, cur_solution)})

    return HttpResponse(json.dumps(datasets), content_type='application/json')
