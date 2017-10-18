import json
from django.http import HttpResponse
from solution.finite_difference.parabolic_pde import ParabolicPDE
from solution.finite_difference.common.arithmetic_parser import FunctionFromStr


MAX_STEP_NUM_X = 100
MAX_STEP_NUM_T = 100


def pretty_label(label):
    d = dict(explicit='Явная',
             implicit='Неявная',
             crank_nicolson='Кранк-Николсон',
             o1p2='г.у. 1 порядка 2 точки',
             o2p2='г.у. 2 порядка 2 точки',
             o2p3='г.у. 2 порядка 3 точки')

    return d[label] if label in d else 'Unknown'


def unpack_params(rget):
    main_args_names = ['a', 'b', 'c', 'f']
    left_boundary_args_names = ['alpha', 'beta', 'phi_0']
    right_boundary_args_names = ['gamma', 'delta', 'phi_l']
    initial_args_names = ['psi']
    grid_params_names = ['K', 'N', 'min_x', 'max_x', 'max_t']
    scheme_types_names = ['implicit', 'explicit', 'crank_nicolson']
    app_orders_names = ['o1p2', 'o2p2', 'o2p3']
    analytic_sol_name = 'analytic_solution'

    params = {}

    try:
        params['main_args'] = [float(rget[x]) if x not in ('f',) else FunctionFromStr(rget[x])
                               for x in main_args_names]
        params['left_boundary_args'] = [float(rget[x]) if x not in ('phi_0',) else FunctionFromStr(rget[x])
                                        for x in left_boundary_args_names]
        params['right_boundary_args'] = [float(rget[x]) if x not in ('phi_l',) else FunctionFromStr(rget[x])
                                         for x in right_boundary_args_names]
        params['initial_args'] = [float(rget[x]) if x not in ('psi',) else FunctionFromStr(rget[x])
                                  for x in initial_args_names]
        params['grid_params'] = [rget[x] for x in grid_params_names]
        params['scheme_types'] = [x for x in scheme_types_names if x in rget and rget[x] == 'on']
        params['app_orders'] = [x for x in app_orders_names if x in rget and rget[x] == 'on']
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
    params['main_args'][-1].set_args_name('x', 't')
    params['left_boundary_args'][-1].set_args_name('t')
    params['right_boundary_args'][-1].set_args_name('t')
    params['initial_args'][-1].set_args_name('x')

    a, b, c, f = params['main_args']
    alpha, beta, phi_0 = params['left_boundary_args']
    gamma, delta, phi_l = params['right_boundary_args']
    psi, = params['initial_args']
    K, N = map(int, params['grid_params'][:2])
    min_x, max_x, max_t = map(float, params['grid_params'][2:])
    step_x = (max_x - min_x) / N
    step_t = max_t / K

    if len(params['scheme_types']) == 0:
        errors.append("Не выбрана схема решения")
        return False

    if len(params['app_orders']) == 0:
        errors.append("Не выбран тип аппроксимации граничных условий")
        return False

    if a <= 0:
        errors.append("Кэффициент 'a' должен быть больше 0")
        return False

    if alpha == 0 and beta == 0:
        errors.append("Коэффициенты alpha и beta не должны быть оба равны нулю")
        return False

    if gamma == 0 and delta == 0:
        errors.append("Коэффициенты gamma и delta не должны быть оба равны нулю")
        return False

    if max_x <= min_x:
        errors.append("Необходимо l0 < l1")
        return False

    if max_t <= 0:
        errors.append("Необходимо T > 0")
        return False

    not_valid_funcs = []
    f(min_x, 0)  # runtime check
    if not f.valid:
        not_valid_funcs.append('f(x, t)')
    phi_0(0)
    if not phi_0.valid:
        not_valid_funcs.append('phi_0(t)')
    phi_l(0)
    if not phi_l.valid:
        not_valid_funcs.append('phi_l(t)')
    psi(min_x)
    if not psi.valid:
        not_valid_funcs.append('psi(x)')
    if len(not_valid_funcs) != 0:
        errors.append("Функции заданы некорректно: " + ', '.join(not_valid_funcs))
        return False

    if 'explicit' in params['scheme_types']:
        sigma = a * step_t / step_x ** 2
        if sigma > 0.5:
            errors.append('Число Куранта (sigma) в явной схеме не может превосходить 0.5')
            params['scheme_types'].remove('explicit')

    if 'o1p2' in params['app_orders']:
        if beta * step_x - alpha == 0:
            errors.append(
                'При аппроксимации граничных условий первым порядком точности по двум точкам \
не должно быть beta * h - alpha = 0')
            params['app_orders'].remove('o1p2')

    if params['analytic_sol'] is not None:
        params['analytic_sol'].set_args_name('x', 't')
        params['analytic_sol'](min_x, 0)
        if not params['analytic_sol'].valid:
            errors.append("Функция аналитического решения U(x, t) задана некорректно")
            params['analytic_sol'] = None

    if K > MAX_STEP_NUM_T:
        errors.append("Количество шагов по t ограничено максимальным значением = {}".format(MAX_STEP_NUM_T))
        params['grid_params'][0] = MAX_STEP_NUM_T

    if N > MAX_STEP_NUM_X:
        errors.append("Количество шагов по x ограничено максимальным значением = {}".format(MAX_STEP_NUM_X))
        params['grid_params'][1] = MAX_STEP_NUM_X

    return True


def calc_errors(sol_a, sol_b):
    f = lambda x, y: abs(x - y)
    return [max(map(f, sol_a[i], sol_b[i])) for i in range(min(len(sol_a), len(sol_b)))]


def parabolic(request):
    datasets = {'x': [],
                'data': [],
                't': [],
                'data_errors': [],
                'errors_msg': []}

    params = unpack_params(request.GET)
    if params is None:
        datasets['errors_msg'].append('Указаны не все параметры или параметры указаны неверно')
        return HttpResponse(json.dumps(datasets), content_type='application/json')

    if not validate_params(params, datasets['errors_msg']):
        return HttpResponse(json.dumps(datasets), content_type='application/json')

    K, N = map(int, params['grid_params'][:2])
    min_x, max_x, max_t = map(float, params['grid_params'][2:])
    step_x = (max_x - min_x) / N
    step_t = max_t / K

    x_list = [step_x * n for n in range(N + 1)]
    datasets['x'] = x_list

    t_list = [step_t * k for k in range(K + 1)]
    datasets['t'] = t_list

    a, b, c, f = params['main_args']
    alpha, beta, phi_0 = params['left_boundary_args']
    gamma, delta, phi_l = params['right_boundary_args']
    psi, = params['initial_args']

    solver = ParabolicPDE(a, b, c, f,
                          alpha, beta, phi_0,
                          gamma, delta, phi_l,
                          psi,
                          min_x, max_x,
                          max_t)

    u = params['analytic_sol']
    analytic_data = None
    if params['analytic_sol'] is not None:
        analytic_data = []
        for t in t_list:
            analytic_data.append([u(x, t) for x in x_list])
        datasets['data'].append({'label': 'Аналитическое решение',
                                 'y': analytic_data})

    for scheme in params['scheme_types']:
        for order in params['app_orders']:
            try:
                cur_solution = solver.solve(N, K, scheme, order)
            except Exception as e:
                print('*********************')
                print('parabolic: exception while solving', scheme, order)
                print('Parameters:')
                for k in params.keys():
                    print(k, ':', params[k])
                print(e)
                datasets['errors_msg'].append(
                    'Не удается решить: {0} ({1}), попробуйте поменять параметры решения'.format(pretty_label(scheme),
                                                                                                 pretty_label(order)))
                continue

            plot_data = {'label': '{0} ({1})'.format(pretty_label(scheme), pretty_label(order)),
                         'y': cur_solution}

            datasets['data'].append(plot_data)

            if analytic_data is not None:
                datasets['data_errors'].append({'label': '{0} ({1})'.format(pretty_label(scheme), pretty_label(order)),
                                                'y': calc_errors(analytic_data, cur_solution)})

    return HttpResponse(json.dumps(datasets), content_type='application/json')
