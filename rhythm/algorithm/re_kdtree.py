#!python numbers=disable

# Copyleft 2008 Sturla Molden
# University of Oslo

#import psyco
#psyco.full()
import os.path as pwd
import numpy as np
import pandas as pd

def kdtree( data, divide_depth=1 ):
    """
    build a kd-tree for O(n log n) nearest neighbour search

    input:
        data:       2D ndarray, shape =(ndim,ndata), preferentially C order
        leafsize:   max. number of data points to leave in a leaf

    output:
        kd-tree:    list of tuples
    """

    ndim = data.shape[0]
    ndata = data.shape[1]

    # find bounding hyper-rectangle
    hrect = np.zeros((2,data.shape[0]))
    hrect[0,:] = data.min(axis=1)
    hrect[1,:] = data.max(axis=1)

    # create root of kd-tree
    idx = np.argsort(data[0,:], kind='mergesort')
    data[:,:] = data[:,idx]
    splitval = data[0,ndata/2]

    left_hrect = hrect.copy()
    right_hrect = hrect.copy()
    left_hrect[1, 0] = splitval
    right_hrect[0, 0] = splitval

    # idx, data, left_hrect, right_hrect, left_nodeptr, right_nodeptr
    tree = [(None, None, left_hrect, right_hrect, None, None)]
    # data, idx, depth, parent, leftbranch
    stack = [(data[:,:ndata/2], idx[:ndata/2], 1, 0, True),
             (data[:,ndata/2:], idx[ndata/2:], 1, 0, False)]

    # recursively split data in halves using hyper-rectangles:
    while stack:

        # pop data off stack
        data, didx, depth, parent, leftbranch = stack.pop()
        ndata = data.shape[1]
        nodeptr = len(tree)

        # update parent node

        _didx, _data, _left_hrect, _right_hrect, left, right = tree[parent]

        tree[parent] = (_didx, _data, _left_hrect, _right_hrect, nodeptr, right) if leftbranch \
            else (_didx, _data, _left_hrect, _right_hrect, left, nodeptr)

        # insert node in kd-tree

        # leaf node?
        if depth <= divide_depth:
        # if ndata <= leafsize:
            _didx = didx.copy()
            _data = data.copy()
            # leaf = (_didx, _data, None, None, 0, 0)
            leaf = (_didx, _data, None, None, -1, -1)
            tree.append(leaf)

        # not a leaf, split the data in two      
        else:
            splitdim = depth % ndim
            idx = np.argsort(data[splitdim,:], kind='mergesort')
            data[:,:] = data[:,idx]
            didx = didx[idx]
            nodeptr = len(tree)
            stack.append((data[:,:ndata/2], didx[:ndata/2], depth+1, nodeptr, True))
            stack.append((data[:,ndata/2:], didx[ndata/2:], depth+1, nodeptr, False))
            splitval = data[splitdim,ndata/2]
            if leftbranch:
                left_hrect = _left_hrect.copy()
                right_hrect = _left_hrect.copy()
            else:
                left_hrect = _right_hrect.copy()
                right_hrect = _right_hrect.copy()
            left_hrect[1, splitdim] = splitval
            right_hrect[0, splitdim] = splitval
            # append node to tree
            tree.append((None, None, left_hrect, right_hrect, None, None))

    return tree

def test_some_functions():
    """
    # data = np.array([[2, 1, 3, 4], [5, 6, 7, 8], [0, 1, 11, 12]])
    # idx = np.argsort(data[0, :], axis=-1, kind='mergesort')
    # print('argsort result is % s' % idx)
    # print(data, data.shape)
    # print('data.min(axis=0) is % s' % data.min(axis=0))
    # print('data.min(axis=1) is % s' % data.min(axis=1))
    # print('data.min(axis=-1) is % s' % data.min(axis=-1))
    # print('data.min(axis=-2) is % s' % data.min(axis=-2))
    # print('data.max(axis=0) is % s' % data.max(axis=0))
    # print('data.max(axis=1) is % s' % data.max(axis=1))
    # print('data.max(axis=-1) is % s' % data.max(axis=-1))
    # # print(data.max(axis=2))
    # data_set = [0, 1] if 1 else [1, 2]
    # print(data_set)
    # print(np.zeros((2, 2)))
    # print(data[:, :1], data[:, 1:])
    """
    """
    # i = pd.date_range('2018/4/9', periods=4, freq='1D20min')
    # ts = pd.DataFrame({'A': [1,2,3,4]}, index=i)
    # print(ts)
    """
    raw_data = {'name': ['Willard Morris', 'Al Jennings', 'Omar Mullins', 'Spencer McDaniel'],
        'age': [20, 19, 22, 21],
        'favorite_color': ['blue', 'red', 'yellow', "green"],
        'grade': [88, 92, 95, 70],
        'birth_date': ['2014/1/1 10:40:30', '2014/1/1 10:40:30', '2014/1/1 10:40:30', '2014/1/1 10:40:30']}
    df = pd.DataFrame(raw_data, index = ['Willard Morris', 'Al Jennings', 'Omar Mullins', 'Spencer McDaniel'])
    # print(pd.to_datetime('1300/01/01 10:40:30', format='%Y/%m/%d', errors='coerce'))
    df['birth_date'] = pd.to_datetime(df['birth_date'])
    start_date = '20140101 10'
    end_date = '2014/01/01 14'
    mask = (df['birth_date'] >= start_date) & (df['birth_date'] <= end_date)
    # mask = (df['birth_date'] > start_date) & (df['birth_date'] <= end_date)
    df_filter = df.loc[mask]
    print(df_filter)

# def convert_date(date_):
    """
    convert date format like 20140816 to format like 2014-08-16 
    """

def count_in_or_between_parts(date_, start_hour_, end_hour_):
    """
    count in or between divided parts in specified date and hour.
    input:
        date_: a date format, like 20140816 and so on.
        hour_: a hour format, a integer between [0, 23]
    output:
        part_idx_gps: [(idx, gps)], idx and gps represents the index and position of some part
        sum_matrix: n * n matrix, sum_matrix[i, i] represents the trip times in i part,
                    and sum_matrix[i, j] represents the trip times between i and j part.  
    """
    dataset_ = date_ + '_train.txt'
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_
    chunksize = 10 ** 6
    data_array = []
    for chunk in pd.read_csv(dataset_path, header=None, chunksize=chunksize):
        chunk[4] = pd.to_datetime(chunk[4])
        start_datetime = date_ + " " + str(start_hour_)
        end_datetime = date_ + " " + str(end_hour_)
        mask = (chunk[4] >= start_datetime) & (chunk[4] < end_datetime)
        # TODO select rows from chunk
        # data_array = 
        if True not in mask[1]:
            break
        # data_array = np.array()

# test_some_functions()
# mask = [False, True]
# if False not in mask:
#     print(mask)
def demo_count_in_or_between_parts():
    dataset_ = '20140824_train.txt'
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_
    size = 10 ** 6
    start_time = pd.to_datetime('20140824 7:0:0')
    end_time = pd.to_datetime('20140824 8:0:0')
    hour_dataframe = pd.DataFrame()
    for chunk in pd.read_csv(dataset_path, chunksize=size):
        chunk.columns = ['taxi_id', 'latitude', 'longitude', 'passenger', 'time']
        chunk.time = chunk.time.apply(pd.to_datetime)
        mask = (chunk.time >= start_time) & (chunk.time < end_time)
        hour_dataframe = pd.concat([hour_dataframe, chunk.loc[mask]])
    # data character in every taxi_id
    up_off_pairs = []
    grouped = hour_dataframe.groupby('taxi_id', sort=False)
    for _, group in grouped:
        selected_group_length = len(group)
        group = group.sort_values(by=['time'])
        i = 0
        while i < selected_group_length - 1:
            if ((group.iloc[[i]].passenger == 1).bool() & (group.iloc[[i + 1]].passenger != 0).bool()):
                up_point_row = group.iloc[[i]]
                up_off_point = [[up_point_row.longitude, up_point_row.latitude]]
                j = i + 1
                while j < selected_group_length:
                    if (group.iloc[[j]].passenger == 0).bool():
                        off_point_row = group.iloc[[j - 1]]
                        up_off_point.append([off_point_row.longitude, off_point_row.latitude])
                        i = j + 1
                        break
                    else:
                        if j == selected_group_length - 1:
                            up_off_point.append([group.iloc[[j]].longitude, group.iloc[[j]].latitude])
                            i = j
                            break
                        else:
                            j += 1
                if len(up_off_point) == 2:
                    up_off_pairs.append(up_off_point)
            else:
                i += 1

demo_count_in_or_between_parts()