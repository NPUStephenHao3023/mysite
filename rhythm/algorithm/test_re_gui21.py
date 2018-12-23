import re_gui21

def test_figure_to_img():
    # html, info = figure_to_html("dataset2.csv", "3d_slice_merge", [1])
    # print(info)

    # pass
    # figure_to_html("dataset2.csv", "2d_equal_grid", [5])
    
    # pass
    # figure_to_html("dataset2.csv", "2d_kdtree", [2])
    # figure_to_html("dataset2.csv", "2d_kdtree", [3])

    # plot.show() in for statement -- in equal_3d.py, line 52
    # figure_to_html("dataset2.csv", "3d_equal_grid", [2])

    # plot.show() in for statement -- in kdtree_3.py, line 80
    # figure_to_html("dataset2.csv", "3d_kdtree", [2])

    # merge.csv not found
    # figure_to_html("dataset2.csv", "3d_slice_merge", [1])

    # figure_to_html("dataset2.csv", "time_space", [2, 2])
    # figure_to_html("dataset2.csv", "space_time", [3, 3])
    # img_address, extra_information = figure_to_img("dataset2.csv", "2d_kdtree", [2])
    # img_address = figure_to_img("dataset2.csv", "3d_equal_grid", [5])
    # img_address, extra_information = re_gui21.figure_to_img("dataset2.csv", "space_time", [3, 3])
    img_address, extra_information = re_gui21.figure_to_img("dataset1.csv", "space_time", [4, 4])
    print(img_address, extra_information)

test_figure_to_img()