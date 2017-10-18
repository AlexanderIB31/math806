"""Parabolic partial differential equation"""

from solution.finite_difference.parabolic.explicit_method import explicit_fd
from solution.finite_difference.parabolic.implicit_method import implicit_fd
from solution.finite_difference.parabolic.crank_nicolson_method import crank_nicolson_fd


class ParabolicPDE:
    """Solve parabolic partial differential equation

    Equation:
        dU/dt = a * d^2U/dx^2 + b * dU/dx + c * U + f(x, t)

        alpha * dU/dx(0, t) + beta * U(0, t) = phi_0(t)
        gamma * dU/dx(l, t) + delta * U(l, t) = phi_1(t)

        U(x, 0) = psi(x)

        x in [0, l]
        t in [0, T]
    """

    def __init__(self,
                 a, b, c, f,
                 alpha, beta, phi_0,
                 gamma, delta, phi_1,
                 psi,
                 min_x, max_x,
                 max_t):
        self.main_args = (a, b, c, f)
        self.boundary_left_args = (alpha, beta, phi_0)
        self.boundary_right_args = (gamma, delta, phi_1)
        self.initial_func = psi
        self.max_x = max_x
        self.min_x = min_x
        self.max_t = max_t

    def solve_explicit_method(self, split_x, split_t, boundary_approximation_func):
        return explicit_fd(self.main_args,
                           self.boundary_left_args,
                           self.boundary_right_args,
                           self.initial_func,
                           self.min_x, self.max_x,
                           self.max_t,
                           split_x, split_t,
                           boundary_approximation_func)

    def solve_implicit_method(self, split_x, split_t, boundary_approximation_func):
        return implicit_fd(self.main_args,
                           self.boundary_left_args,
                           self.boundary_right_args,
                           self.initial_func,
                           self.min_x, self.max_x,
                           self.max_t,
                           split_x, split_t,
                           boundary_approximation_func)

    def solve_crank_nicolson_method(self, split_x, split_t, boundary_approximation_func):
        return crank_nicolson_fd(self.main_args,
                                 self.boundary_left_args,
                                 self.boundary_right_args,
                                 self.initial_func,
                                 self.min_x, self.max_x,
                                 self.max_t,
                                 split_x, split_t,
                                 boundary_approximation_func)

    def solve(self, split_x, split_t, scheme_type, boundary_approximation_func):
        if scheme_type == 'explicit':
            return self.solve_explicit_method(split_x, split_t, boundary_approximation_func)
        if scheme_type == 'implicit':
            return self.solve_implicit_method(split_x, split_t, boundary_approximation_func)
        if scheme_type == 'crank_nicolson':
            return self.solve_crank_nicolson_method(split_x, split_t, boundary_approximation_func)

if __name__ == '__main__':
    pass
