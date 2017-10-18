"""Elliptic partial differential equation"""

import solution.finite_difference.elliptic.base_iteration as base_iter
from solution.finite_difference.elliptic.libman import Libman
from solution.finite_difference.elliptic.seidel import Seidel
from solution.finite_difference.elliptic.sor import SOR


class EllipticPDE:
    """Solve elliptic partial differential equation

    Equation:
        d^2U/dx^2 + d^2U/dy^2 + b_x * dU/dx + b_y * dU/dy + c * U + f(x, y) = 0

        alpha_1 * dU/dx(0, y) + beta_1 * U(0, y) = phi_1(y)
        alpha_2 * dU/dx(l_x, y) + beta_2 * U(l_x, y) = phi_2(y)
        alpha_3 * dU/dy(x, 0) + beta_3 * U(x, 0) = phi_3(x)
        alpha_4 * dU/dy(x, l_y) + beta_4 * U(x, l_y) = phi_4(x)

        x in [0, l_x]
        y in [0, l_y]
    """

    def __init__(self,
                 b_x, b_y, c, f,
                 alpha_1, beta_1, phi_1,
                 alpha_2, beta_2, phi_2,
                 alpha_3, beta_3, phi_3,
                 alpha_4, beta_4, phi_4,
                 min_x, max_x,
                 min_y, max_y,
                 step_num_x, step_num_y):
        self.main_args = (b_x, b_y, c, f)
        self.bound_1 = (alpha_1, beta_1, phi_1)
        self.bound_2 = (alpha_2, beta_2, phi_2)
        self.bound_3 = (alpha_3, beta_3, phi_3)
        self.bound_4 = (alpha_4, beta_4, phi_4)
        self.min_x = min_x
        self.max_x = max_x
        self.min_y = min_y
        self.max_y = max_y
        self.n = step_num_x
        self.m = step_num_y

    def libman(self):
        return Libman(self.main_args,
                      self.bound_1, self.bound_2, self.bound_3, self.bound_4,
                      self.min_x, self.max_x,
                      self.min_y, self.max_y,
                      self.n, self.m)

    def seidel(self):
        return Seidel(self.main_args,
                      self.bound_1, self.bound_2, self.bound_3, self.bound_4,
                      self.min_x, self.max_x,
                      self.min_y, self.max_y,
                      self.n, self.m)

    def sor(self, relax):
        return SOR(self.main_args,
                   self.bound_1, self.bound_2, self.bound_3, self.bound_4,
                   self.min_x, self.max_x,
                   self.min_y, self.max_y,
                   self.n, self.m,
                   relax=relax)

    @staticmethod
    def set_max_iterations_num(num):
        base_iter.MAX_ITERATION_NUM = num

if __name__ == '__main__':
    pass
