from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone

import json

from .models import Image
from .algorithm import re_gui21
from .algorithm import re_kdtree
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
    # get method_full_name
    post_ = request.POST
    method_name = post_['method']
    # first seven methods names
    first_seven_methods = [
        'method1',
        'method2',
        'method3',
        'method4',
        'method5',
        'method6',
        'method7'
    ]
    if method_name in first_seven_methods:
        content = deal_with_first_seven_methods(post_, method_name)
        return HttpResponse(content)
    # else:
<<<<<<< HEAD
        # if method_name == 'trip_times_network':
        #     content = deal_with_trip_times_network(post_)
        #     return HttpResponse(content)
=======
    #     if method_name == 'trip_times_network':
    #         content = deal_with_trip_times_network(post_)
    #         return HttpResponse(content)
>>>>>>> 489c2d2d918ecd0f3198e40d647d09ac16cdd0f0


def deal_with_first_seven_methods(post, method_name):
    # get dataset_name
    dataset_name = post['dataset']
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
        parameter.append(int(post[method_name]))
    else:
        parameter.append(int(post[method_name + "_1"]))
        parameter.append(int(post[method_name + "_2"]))
    # get image and context
    img_full_name = dataset_name + "-" + method_full_name
    for parameter_ in parameter:
        img_full_name += "-" + str(parameter_)
    img_full_name += ".png"
    image = Image.objects.filter(
        image_full_name=img_full_name
    )
    if not image:
        img_full_name_, extra_information = re_gui21.figure_to_img(
            dataset_name, method_full_name, parameter)
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
    return json.dumps(context)


def select_to_generate_images(request):
    # Image.objects.all().delete()
    # dataset = ['dataset1.csv', 'dataset2.csv']
    dataset = ['dataset1.csv']
    # method_single = [
    #             "2d_equal_grid","2d_kdtree",
    #             "3d_equal_grid", "3d_kdtree",
    #             #  "3d_slice_merge"
    # ]
    method_double = [
        # "time_space",
        "space_time"
    ]
    # parameter_single = [
    #                     [5, 30, 5], # 2 * 6
    #                     [2, 10, 1], # 2 * 9
    #                     [2, 20, 1], # 2 * 19
    #                     [2, 10, 1], # 2 * 9
    #                     # [5, 30, 5]# 2 * 6
    # ]
    parameter_double = [
        # [[2, 24, 1], [2, 10, 1]],# 23*9*2
        [[5, 10, 1], [3, 10, 1]]  # 8*8*2
    ]
    # for dataset_ in dataset:
    #     for method_ in method_single:
    #         parameter = parameter_single[method_single.index(method_)]
    #         for i in range(parameter[0], parameter[1] + parameter[2], parameter[2]):
    #             img_full_name_, extra_information = re_gui21.figure_to_img(dataset_, method_, list([i]))
    #             temp_image = Image(image_full_name=img_full_name_,
    #                     extra_information=json.dumps(extra_information),
    #                     upload_time=timezone.now())
    #             temp_image.save()

    for dataset_1 in dataset:
        for method_1 in method_double:
            parameter1 = parameter_double[method_double.index(method_1)]
            for i in range(parameter1[0][0], parameter1[0][1] + parameter1[0][2], parameter1[0][2]):
                for j in range(parameter1[1][0], parameter1[1][1] + parameter1[1][2], parameter1[1][2]):
                    img_full_name_, extra_information = re_gui21.figure_to_img(
                        dataset_1, method_1, list([i, j]))
                    temp_image = Image(image_full_name=img_full_name_,
                                       extra_information=json.dumps(
                                           extra_information),
                                       upload_time=timezone.now())
                    temp_image.save()
    return HttpResponse(json.dumps(""))
