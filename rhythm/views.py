from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from json import dumps
from pandas import DataFrame
import os.path
from hashlib import md5
from time import time
from .DivisionMethods import interface_to_methods, process_upload_original
from .PatternMining import process_upload_od, process_upload_sequence, interface_to_eclat, interface_to_ps

# Create your views here.


def index(request):
    return render(request, 'rhythm/index.html')


def index_association(request):
    return render(request, 'rhythm/index_association.html')


def index_others(request):
    return render(request, 'rhythm/index_others.html')


def index_test(request):
    # tuple_dict = request.META.items()  # 将字典转换成可遍历的元组。

    # # tuple_dict.sort()  # 对元组进行排序，方便查看。

    # html = []

    # for k, v in tuple_dict:

    #     html.append('<tr><td>%s</td><td>%s</td></tr>' % (k, v))

    # return HttpResponse('<table>%s</table>' % '\n'.join(html))
    return render(request, 'rhythm/index_test.html')


def select(request):
    # get method_name
    post_ = request.POST
    method_name = post_['method']
    token = post_['token']
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
        content = deal_with_first_seven_methods(post_, method_name, token)
    else:
        content = {
            "extra_information": '',
        }
    return HttpResponse(dumps(content))


def frequent_mining(request):
    post = request.POST
    token = post['token']
    min_sup = float(post['sup'])
    # min_conf = float(post['conf'])
    rtn, itemset = interface_to_eclat.frequent_itemset_mining(min_sup, token)
    if rtn == 1:
        context = {
            'is_itemset_empty': True
        }
    else:
        cnt, rule = interface_to_eclat.fr_rules(itemset[1], token)
        context = {
            'is_itemset_empty': False,
            'itemset_count': len(itemset[0]),
            'itemsets': itemset[0],
            'freq_rules_count': cnt,
            'freq_rules': rule
        }
    return HttpResponse(dumps(context))


def sequential_mining(request):
    post = request.POST
    token = post['token']
    min_sup = float(post['sup'])
    min_conf = float(post['conf'])
    time = int(post['time'])
    weather = int(post['weather'])
    dayofweek = int(post['dayofweek'])
    _ = process_upload_sequence.process_original_traj(
        token, time, weather, dayofweek, False)
    # print("#"*99)
    seq_num, seqs = interface_to_ps.sequence_mining(min_sup, token)
    if seq_num == 0:
        context = {
            'is_seq_empty': True
        }
    else:
        cnt, rule = interface_to_ps.rules(seqs, min_conf)
        context = {
            'is_seq_empty': False,
            'seq_count': seq_num,
            'seqs': seqs,
            'seq_rules_count': cnt,
            'seq_rules': rule,
            # 'seq_data_range': data_range,
            # 'seq_encoding': rules,
        }
    return HttpResponse(dumps(context))


def upload_csv(request):
    if "GET" == request.method:
        return HttpResponseRedirect(reverse("rhythm:index"))
    # if not GET, then proceed
    if "csv_file" not in request.FILES:
        result = {
            # 'error': "Please upload file first."
            'error': "请先上传文件."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
        # return HttpResponse(result['error'])
    csv_file = request.FILES["csv_file"]
    if not csv_file.name.endswith('.csv'):
        result = {
            # 'error': "File is not CSV type"
            'error': "该文件不是CSV格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    # if file is too large, return
    file_size = csv_file.size/(10**6)
    if file_size > 40.0:
        result = {
            # 'error': "Uploaded file is too big ({:.2%} MB).".format(file_size)
            'error': "文件的大小不能超过40MB."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    token = generate_token()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = '{}\\DivisionMethods\\dataset\\upload_original-{}.csv'.format(
    #     current_dir, token)
    file_path = os.path.join(current_dir, 'DivisionMethods', 'dataset',
                             'upload_original-{}.csv'.format(token))
    with open(file_path, 'w+') as f:
        for chunk in csv_file.chunks():
            f.write(chunk.decode("utf-8"))
    retn_result = process_upload_original.process_original_csv(token)
    # retn_result = 0
    if retn_result == 1:
        result = {
            'error': "上传的文件不符合规定格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    result = {
        'error': "",
        'token': token
    }
    return HttpResponse(dumps(result, ensure_ascii=False))


def upload_od(request):
    if "GET" == request.method:
        return HttpResponseRedirect(reverse("rhythm:index_association"))
    # if not GET, then proceed
    if "od_file" not in request.FILES:
        result = {
            # 'error': "Please upload file first."
            'error': "请先上传文件."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    csv_file = request.FILES["od_file"]
    if not csv_file.name.endswith('.csv'):
        result = {
            # 'error': "File is not CSV type"
            'error': "该文件不是CSV格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    # if file is too large, return
    file_size = csv_file.size/(10**6)
    if file_size > 40.0:
        result = {
            # 'error': "Uploaded file is too big ({:.2%} MB).".format(file_size)
            'error': "文件的大小不能超过40MB."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    token = generate_token()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = '{}\\PatternMining\\dataset\\upload_od_original-{}.csv'.format(
    #     current_dir, token)
    file_path = os.path.join(current_dir, 'PatternMining', 'dataset',
                             'upload_od_original-{}.csv'.format(token))
    with open(file_path, 'w+') as f:
        for chunk in csv_file.chunks():
            f.write(chunk.decode("utf-8"))
    retn_result, data_range, point_pairs = process_upload_od.process_original_od(
        token, 10, 10)
    # retn_result = 0
    if retn_result == 1:
        result = {
            'error': "上传的文件不符合规定格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    result = {
        'error': "",
        'od_token': token,
        'od_data_range': data_range,
        'point_pairs': point_pairs
    }
    return HttpResponse(dumps(result, ensure_ascii=False))
    # return HttpResponse(result)


def upload_traj(request):
    if "GET" == request.method:
        return HttpResponseRedirect(reverse("rhythm:index_association"))
    # if not GET, then proceed
    if "traj_file" not in request.FILES:
        result = {
            # 'error': "Please upload file first."
            'error': "请先上传文件."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    csv_file = request.FILES["traj_file"]
    if not csv_file.name.endswith('.csv'):
        result = {
            # 'error': "File is not CSV type"
            'error': "该文件不是CSV格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    # if file is too large, return
    file_size = csv_file.size/(10**6)
    if file_size > 40.0:
        result = {
            # 'error': "Uploaded file is too big ({:.2%} MB).".format(file_size)
            'error': "文件的大小不能超过40MB."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    token = generate_token()
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # file_path = '{}\\PatternMining\\dataset\\upload_sequence_original-{}.csv'.format(
    #     current_dir, token)
    file_path = os.path.join(current_dir, 'PatternMining', 'dataset',
                             'upload_sequence_original-{}.csv'.format(token))
    with open(file_path, 'w+') as f:
        for chunk in csv_file.chunks():
            f.write(chunk.decode("utf-8"))
    retn_result = process_upload_sequence.process_upload_traj(token)
    # retn_result = 0
    if retn_result == 1:
        result = {
            'error': "上传的文件不符合规定格式."
        }
        return HttpResponse(dumps(result, ensure_ascii=False))
    result = {
        'error': "",
        'seq_token': token
    }
    return HttpResponse(dumps(result, ensure_ascii=False))


def deal_with_first_seven_methods(post, method_name, token):
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
    # generate img
    _, extra = interface_to_methods.interface_to_generate_img(
        "upload_processed", token, method_full_name, parameter, False)
    # return img info
    context = {
        # "image_full_name": img_addr,
        "extra_information": extra,
    }
    return context


def generate_token():
    curt_time = str(time())
    md = md5()
    md.update(curt_time.encode())
    return md.hexdigest()
