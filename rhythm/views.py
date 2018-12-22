from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone

import json

from .models import Image
from .algorithm import re_gui21
# Create your views here.
def index(request):
    return render(request, 'rhythm/index.html')

def results(request, dataset_name, method_name, parameter):   
    context = {
        'image_name': None,
    }
    # return HttpResponse(method_name + str(parameter))
    return render(request, 'rhythm/index.html', context)

def select(request):
    # get dataset_name
    dataset_name = request.POST['dataset']
    # get method_full_name
    method_name = request.POST['method']
    if method_name == "method1":
        method_full_name = "2d_equal_grid"
    if method_name == "method2":
        method_full_name = "2d_kdtree"
    if method_name == "method3":
        method_full_name = "3d_equal_grid"
    if method_name == "method4":
        method_full_name = "3d_kdtree"
    if method_name == "method5":
        method_full_name = "3d_slice_merge"
    if method_name == "method6":
        method_full_name = "time_space"
    if method_name == "method7":
        method_full_name = "space_time"
  # get parameter
    parameter = list()    
    if method_name != "method6" and method_name != "method7":
        parameter.append(int(request.POST[method_name]))
    else:
        parameter.append(int(request.POST[method_name + "_1"]))
        parameter.append(int(request.POST[method_name + "_2"]))
    # get image and context
    img_full_name = dataset_name + "-" + method_full_name
    for parameter_ in parameter:
        img_full_name += "-" + str(parameter_)
    img_full_name += ".png"
    image = Image.objects.filter(
        image_full_name=img_full_name
    )
    if not image:
        img_full_name_, extra_information = re_gui21.figure_to_img(dataset_name, method_full_name, parameter)
        temp_image = Image(image_full_name=img_full_name_,
                            extra_information=json.dumps(extra_information),
                            upload_time=timezone.now())
        temp_image.save()
    else:
        temp_image = image[0]
    context = {
        "image_full_name": temp_image.image_full_name,
        "extra_information": temp_image.extra_information,
    }
    return HttpResponse(json.dumps(context))