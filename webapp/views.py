from django.shortcuts import render


def index(request):
    context = {
        'parabolic': {'name': u'Параболическое уравнение' },
        'hyperbolic': {'name': u'Гиперболическое уравнение' },
        'elliptic': {'name': u'Эллиптическое уравнение' },
    }
    return render(request, 'webapp/index.html', context)
