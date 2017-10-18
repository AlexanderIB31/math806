from solution.finite_difference.common.matrix import Matrix
from solution.finite_difference.common.matrix import Vector
from solution.finite_difference.common.tridiagonal_matrix_algorithm import TDMA
from solution.finite_difference.parabolic.implicit_method import _o1p2, _o2p2, _o2p3


def crank_nicolson_fd(main_args,
                      boundary_left_args, boundary_right_args,
                      initial_func,
                      min_x, max_x,
                      max_t,
                      split_x, split_t,
                      boundary_approximation_func='o1p2',
                      theta=0.5):
    """Solve parabolic partial differential equation with Crank - Nicolson finite difference method"""

    d = {
        'o1p2': _o1p2,  # o - order, p - points
        'o2p2': _o2p2,
        'o2p3': _o2p3
    }

    n = split_x + 1
    m = split_t + 1
    step_x = (max_x - min_x) / split_x
    step_t = max_t / split_t

    (complete_matrix,
     complete_vector) = d[boundary_approximation_func](main_args,
                                                       boundary_left_args, boundary_right_args,
                                                       step_x, step_t,
                                                       min_x, max_x)

    u = [None for _ in range(m)]
    u[0] = [initial_func(min_x + x * step_x) for x in range(n)]

    a, b, c, f = main_args

    A = a * (1 - theta) / step_x ** 2 - b * (1 - theta) / (2 * step_x)
    B = c * (1 - theta) - 2 * a * (1 - theta) / step_x ** 2 - 1 / step_t
    C = a * (1 - theta) / step_x ** 2 + b * (1 - theta) / (2 * step_x)

    X = b * theta / (2 * step_x) - a * theta / step_x ** 2
    Y = 2 * a * theta / step_x ** 2 - c * theta - 1 / step_t
    Z = - a * theta / step_x ** 2 - b * theta / (2 * step_x)

    matrix_u_t = Matrix(size=(n, 3))
    for i in range(1, n - 1):
        matrix_u_t[i] = [A, B, C]
    complete_matrix(matrix_u_t)

    for t in range(1, m):
        v = Vector(size=(n, 1))
        for x in range(1, n - 1):
            v[x] = (u[t - 1][x - 1] * X +
                    u[t - 1][x] * Y +
                    u[t - 1][x + 1] * Z +
                    (theta - 1) * f(min_x + x * step_x, t * step_t) -
                    theta * f(min_x + x * step_x, (t - 1) * step_t))
        complete_vector(v, t * step_t, matrix_u_t, u[t-1][0], u[t-1][-1])
        u[t] = list(TDMA(mtrx=matrix_u_t, vec=v).solve())

    return u


if __name__ == '__main__':
    pass
