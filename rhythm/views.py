# from django.views import generic
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
# Create your views here.

# class IndexView(generic.DetailView):

def index(request):
    context = {
        'json_file': None,
        'method_name': None,
        'parameter': None,
    }
    return render(request, 'rhythm/index.html', context)

def results(request, method_name, parameter):
    context = {
        'json_file': None,
        'method_name': method_name,
        'parameter': parameter,
    }
    # return HttpResponse(method_name + str(parameter))
    return render(request, 'rhythm/index.html', context)

def select(request):
    method_name = request.POST['choice']
    parameter = request.POST['number']
    return HttpResponseRedirect(reverse('rhythm:results', args=(method_name,parameter,)))
