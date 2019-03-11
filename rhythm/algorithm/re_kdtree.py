#!python numbers=disable

# Copyleft 2008 Sturla Molden
# University of Oslo

#import psyco
#psyco.full()
import numpy as np
import pandas as pd
import json
import os.path as pwd


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
    splitval = data[0,int(ndata/2)]

    left_hrect = hrect.copy()
    right_hrect = hrect.copy()
    left_hrect[1, 0] = splitval
    right_hrect[0, 0] = splitval

    # idx, data, left_hrect, right_hrect, left_nodeptr, right_nodeptr
    tree = [(None, None, left_hrect, right_hrect, None, None)]
    # data, idx, depth, parent, leftbranch
    stack = [(data[:,:int(ndata/2)], idx[:int(ndata/2)], 1, 0, True),
             (data[:,int(ndata/2):], idx[int(ndata/2):], 1, 0, False)]

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
        if depth >= divide_depth:
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
            stack.append((data[:,:int(ndata/2)], didx[:int(ndata/2)], depth+1, nodeptr, True))
            stack.append((data[:,int(ndata/2):], didx[int(ndata/2):], depth+1, nodeptr, False))
            splitval = data[splitdim,int(ndata/2)]
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

def get_hour_csv(date_, start_hour_, end_hour_):
    # dataset_ = '20140824_train.txt'
    dataset_ = date_ + '_train.txt'
    dataset_hour = date_ + '_train_' + start_hour_ + '_' + end_hour_ + '.csv'
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_
    size = 10 ** 6
    start_time = pd.to_datetime(date_ + ' ' + start_hour_ + ':0:0')
    end_time = pd.to_datetime(date_ + ' ' + end_hour_ + ':0:0')
    hour_dataframe = pd.DataFrame()
    for chunk in pd.read_csv(dataset_path, chunksize=size):
        chunk.columns = ['taxi_id', 'latitude', 'longitude', 'passenger', 'time']
        chunk.time = chunk.time.apply(pd.to_datetime)
        mask = (chunk.time >= start_time) & (chunk.time < end_time)
        hour_dataframe = pd.concat([hour_dataframe, chunk.loc[mask]])
    hour_dataframe.to_csv(dirname_ + "\\dataset\\" + dataset_hour, mode = 'w', index=False)

def get_od_pairs_csv(date_, start_hour_, end_hour_):
    # dataset_ = '20140824_train_7_vscode.csv'
    dataset_hour = date_ + '_train_' + start_hour_ + '_' + end_hour_ + '.csv'
    dataset_hour_od_pairs = date_ + '_train_' + start_hour_ + '_' + end_hour_+ '_od_pairs.csv'
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_hour
    hour_dataframe = pd.read_csv(dataset_path)
    column_names = ['origin_longitude', 'origin_latitude', 'destination_longitude', 'destination_latitude']
    up_off_pairs_df = pd.DataFrame(columns=column_names, dtype=np.float64)
    # print(up_off_pairs_df.dtypes)
    grouped = hour_dataframe.groupby('taxi_id', sort=False)
    for _, group in grouped:
        selected_group_length = len(group)
        group = group.sort_values(by=['time'])
        i = 0
        while i < selected_group_length - 1:
            if group.iloc[i]['passenger'] == np.int64(1) and group.iloc[i + 1]['passenger'] != np.int64(0):
                up_point_row = group.iloc[i]
                # print(up_point_row['longitude'])
                single_pair_df = pd.DataFrame([[up_point_row['longitude'], up_point_row['latitude'], 0.0, 0.0]], columns=column_names)
                j = i + 1
                while j < selected_group_length:
                    if group.iloc[j]['passenger'] == np.int64(0):
                        off_point_row = group.iloc[j - 1]
                        single_pair_df.iat[0, 2] = off_point_row['longitude']
                        single_pair_df.iat[0, 3] = off_point_row['latitude']
                        # single_pair_df.set_value(0, 'destination_longitude', off_point_row['longitude'])
                        # single_pair_df.set_value(0, 'destination_latitude', off_point_row['latitude'])
                        i = j + 1
                        break
                    else:
                        if j == selected_group_length - 1:
                            single_pair_df.iat[0, 2] = group.iloc[j]['longitude']
                            single_pair_df.iat[0, 3] = group.iloc[j]['latitude']
                            # single_pair_df.set_value(0, 'destination_longitude', group.iloc[j]['longitude'])                            
                            # single_pair_df.set_value(0, 'destination_latitude', group.iloc[j]['latitude'])                            
                            i = j
                            break
                        else:
                            j += 1
                if single_pair_df.iloc[0]['destination_longitude'] != np.float64(0) and single_pair_df.iloc[0]['destination_latitude'] != np.float64(0):
                    # print(single_pair_df)
                    # print(single_pair_df.dtypes)
                    up_off_pairs_df = pd.concat([up_off_pairs_df, single_pair_df])
                    # print(up_off_pairs_df)
                    # print(up_off_pairs_df.dtypes)
            else:
                i += 1
    up_off_pairs_df.to_csv(dirname_ + "\\dataset\\" + dataset_hour_od_pairs, mode = 'w', index=False)

def part_index(leaf_tuples_list, longitude, latitude):
    index_ = -1
    for idx in range(len(leaf_tuples_list)):
        nd_array = leaf_tuples_list[idx][1]
        for i in range(nd_array.shape[1]):
            if nd_array[0,i] == longitude and nd_array[1,i] == latitude:
                index_ = idx
                return index_
    return index_

def count_in_or_between_parts(date_, start_hour_, end_hour_):
    """
    count in or between divided parts in specified date and hour.
    input:
        date_: a date format, like 20140816 and so on.
        start_hour_: a hour format, a integer between [0, 23]
        end_hour_: a hour format, a integer between [1, 24]
    output:
        part_idx_gps: [(idx, gps)], idx and gps represents the index and position of some part
        sum_matrix: n * n matrix, sum_matrix[i, i] represents the trip times in i part,
                    and sum_matrix[i, j] represents the trip times between i and j part.  
    """
    dataset_hour_od_pairs = date_ + '_train_' + start_hour_ + '_' + end_hour_+ '_od_pairs.csv'
    dataset_hour_idx_gps = date_ + '_train_' + start_hour_ + '_' + end_hour_ + '_idx_gps.json'
    dataset_hour_sum_matrix = date_ + '_train_' + start_hour_ + '_' + end_hour_ + '_sum_matrix.json'
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_hour_od_pairs
    up_off_pairs_df = pd.read_csv(dataset_path)
    origin_df = up_off_pairs_df[['origin_longitude', 'origin_latitude']].copy()
    origin_df.columns = ['longitude', 'latitude']
    destination_df = up_off_pairs_df[['destination_longitude', 'destination_latitude']].copy()
    destination_df.columns = ['longitude', 'latitude']
    points_df = pd.concat([origin_df, destination_df])
    points_array = points_df.values
    points_T_array = points_array.transpose()
    tree_tuples_list = kdtree(points_T_array, divide_depth=8)
    leaf_tuples_list = [item for item in tree_tuples_list if item[4] == -1 and item[5] == -1]
    part_idx_gps = []
    for idx in range(len(leaf_tuples_list)):
        single_part = (idx, (leaf_tuples_list[idx][1][0,0], leaf_tuples_list[idx][1][1,0]))
        part_idx_gps.append(single_part)
    # part_idx_gps = json.dumps(dict(part_idx_gps))
    with open(dirname_ + "\\dataset\\" + dataset_hour_idx_gps, 'w') as outfile:
        json.dump(dict(part_idx_gps), outfile)
    # print(part_idx_gps)
    # print(len(part_idx_gps))
    sum_matrix =  np.zeros((len(part_idx_gps), len(part_idx_gps)), dtype=np.int)
    for i in range(len(up_off_pairs_df)):
        idx_up = part_index(leaf_tuples_list, up_off_pairs_df.iloc[i]['origin_longitude'], up_off_pairs_df.iloc[i]['origin_latitude'])
        idx_off = part_index(leaf_tuples_list, up_off_pairs_df.iloc[i]['destination_longitude'], up_off_pairs_df.iloc[i]['destination_latitude'])
        if idx_up >= 0 and idx_off >= 0:
            sum_matrix[idx_up, idx_off] += 1
    # print(sum_matrix)
    sum_matrix_list = sum_matrix.tolist()
    with open(dirname_ + "\\dataset\\" + dataset_hour_sum_matrix, 'w') as output_:
        json.dump(sum_matrix_list, output_)
    # return part_idx_gps, sum_matrix

def load_idx_gps_and_sum_matrix_json(date_, start_hour_, end_hour_):
    dirname_ = pwd.dirname(__file__)
    json_path = dirname_ + "\\dataset\\"
    idx_gps_json_ = json_path + date_ + '_train_' + start_hour_ + '_' + end_hour_ + '_idx_gps.json'
    sum_matrix_json_ = json_path + date_ + '_train_' + start_hour_ + '_' + end_hour_ + '_sum_matrix.json'
    with open(idx_gps_json_) as input_:
        idx_gps_ = json.load(input_)
    with open(sum_matrix_json_) as infile:
        sum_matrix_ = json.load(infile)
    return idx_gps_, sum_matrix_

# count_in_or_between_parts('20140824', '7', '8')