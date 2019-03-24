
def select1(request):
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
                        [[5, 10, 1], [3, 10, 1]] # 8*8*2
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
                    img_full_name_, extra_information = re_gui21.figure_to_img(dataset_1, method_1, list([i, j]))
                    temp_image = Image(image_full_name=img_full_name_,
                            extra_information=json.dumps(extra_information),
                            upload_time=timezone.now())
                    temp_image.save()
    return HttpResponse(json.dumps(""))