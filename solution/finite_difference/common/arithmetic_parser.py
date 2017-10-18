import sympy
from sympy.parsing.sympy_parser import parse_expr


class FunctionFromStr:
    def __init__(self, s=None):
        self.args = []
        self.valid = False
        self.expr = None
        self.str_expr = ''
        self.str_expr_compiled = None
        self.global_env = dict()
        exec('from math import *', None, self.global_env)

        if s is None:
            return

        forbidden_keywords = ('import', 'return', 'exit', 'eval', 'exec', 'def', 'class', 'lambda', 'try', 'except')
        tmp = ''
        while True:
            tmp = s.replace(' ', '')
            for w in forbidden_keywords:
                tmp = tmp.replace(w, '')
            if tmp == s:
                break
            s = tmp

        try:
            self.expr = parse_expr(s)
            self.str_expr_compiled = compile('result=({})'.format(s), '', 'exec')
        except SyntaxError:
            return
        self.str_expr = s
        self.valid = True

    def __str__(self):
        return self.str_expr

    def set_args_name(self, *args):
        self.args = args

    def __call__(self, *args, **kwargs):
        if not self.valid:
            return None
        if len(self.args) != len(args):
            if len(self.args) > len(args):
                err = 'missing {} required positional argument: '.format(len(self.args) - len(args))
                err += ', '.join(self.args[len(args):])
            else:
                err = 'function takes {0} positional arguments but {1} were given'.format(len(self.args), len(args))
            raise TypeError(err)
        try:
            for i in range(len(args)):
                kwargs[self.args[i]] = args[i]
            exec(self.str_expr_compiled, self.global_env, kwargs)
            return kwargs['result']
        except Exception:
            self.valid = False
            return None

    def get_derivative(self, *args):
        res_func = FunctionFromStr(str(sympy.diff(self.expr, *args)))
        res_func.set_args_name(*self.args)
        return res_func

if __name__ == '__main__':
    pass
