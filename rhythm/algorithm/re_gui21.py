import os.path as pwd
import matplotlib.pyplot as plt
import mpld3
import pandas as pd
import numpy as np
from PIL import Image, ImageTk
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from matplotlib.backends.backend_tkagg import NavigationToolbar2TkAgg
from mpl_toolkits.mplot3d import Axes3D

import equal_grid
import kdtree
import equal_3d
import kdtree_3
import hebing
import time_space
import space_time


def calc_ent(x):
    """calculating the information entropy
    """
    x_value_list = set([x[i] for i in range(x.shape[0])])
    ent = 0.0
    for x_value in x_value_list:
        p = float(x[x == x_value].shape[0]) / x.shape[0]
        logp = np.log2(p)
        ent -= p * logp
    return ent

def figure_to_img(dataset_, method_, args):
    """dataset_ is the full name of dataset in csv format file,
        method_ is the full name of selected method,
        args is an list of arguments.
        ps:
            The format of dataset_ is like "dataset1.csv",
            and of method_ is one of the following: "2d_equal_grid",
            "2d_kdtree", "3d_equal_grid", "3d_kdtree", "3d_slice_merge",
            "time_space", "space_time", and of args is like [5] or [4, 10]
    """
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_
    # database_ = np.array(pd.read_csv('.\\dataset\\' + dataset_, header=None))
    database_ = np.array(pd.read_csv(dataset_path, header=None))
    whole_figure = plt.figure()
    extra_information = []
    img_address = dirname_ + "\\..\\"
    if method_ == "2d_equal_grid":
        parameter_ = args[0]
        subplot_added = whole_figure.add_subplot(1, 1, 1)
        equal_grid.equal_grid(subplot_added, database_, parameter_)
        grid_count = equal_grid.state_grid(database_, parameter_)
        img_address += method_ + "-" + str(parameter_)
    if method_ == "2d_kdtree":
        parameter_ = args[0]
        subplot_added = whole_figure.add_subplot(1, 1, 1)
        grid_count = kdtree.draw_fig(database_, subplot_added, parameter_)
        img_address += method_ + "-" + str(parameter_)
    if method_ == "3d_equal_grid":
        parameter_ = args[0]
        subplot_added = Axes3D(whole_figure)
        equal_3d.draw_fig(database_, subplot_added, parameter_)
        grid_count = equal_3d.state_num(database_, parameter_)
        img_address += method_ + "-" + str(parameter_)        
    if method_ == "3d_kdtree":
        parameter_ = args[0]
        subplot_added = whole_figure.gca(projection='3d')
        grid_count = kdtree_3.draw_fig(database_, parameter_, subplot_added)
        img_address += method_ + "-" + str(parameter_)
    if method_ == "3d_slice_merge":
        hebing.xifen(database_,xs = 50,ys = 50,zs = 30)  # slice
        hebing.hebing2(database_)                        # merge
        parameter_ = args[0]
        hebing.draw_fig(database_, parameter_, whole_figure)
        grid_count = hebing.state_num()
        img_address += method_ + "-" + str(parameter_)
    if method_ == "time_space":
        parameter_first = args[0]
        parameter_second = args[1]
        grid_count = time_space.draw_fig(database_, parameter_first,
                                         parameter_second, whole_figure)
        img_address += method_ + "-" + str(parameter_first) + "-" + str(parameter_second)
    if method_ == "space_time":
        parameter_first = args[0]
        parameter_second = args[1]
        grid_count = space_time.draw_f7(database_, parameter_first,
                                        parameter_second, whole_figure)
        img_address += method_ + "-" + str(parameter_first) + "-" + str(parameter_second)
    extra_information.append(str(calc_ent(np.array(grid_count))))
    extra_information.append(str(np.var(grid_count)))
    extra_information.append(str(np.std(grid_count)))
    extra_information.append(str(np.mean(grid_count)))
    extra_information.append(str(np.min(grid_count)))
    extra_information.append(str(np.max(grid_count)))
    extra_information.append(str(pd.Series(grid_count).skew()))
    extra_information.append(str(pd.Series(grid_count).kurt()))
    extra_information.append(str(len(grid_count)))
    # mpld3.show()
    # return mpld3.fig_to_html(whole_figure), extra_information
    img_address += ".png"
    whole_figure.savefig(img_address)
    return img_address, extra_information


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
    img_address = figure_to_img("dataset2.csv", "3d_equal_grid", [5])
    print(img_address)

test_figure_to_img()