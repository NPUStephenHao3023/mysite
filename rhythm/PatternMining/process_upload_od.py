import os.path
from timeit import default_timer
from traceback import format_exc
from datetime import datetime
from pandas import read_csv, to_datetime, DataFrame


def grid_number(is_o, point, latitude_pair, longitude_pair, height, width):
    row_height = (latitude_pair[1] - latitude_pair[0]) / height
    coln_width = (longitude_pair[1] - longitude_pair[0]) / width
    row_count = (point[0] - latitude_pair[0]) // row_height
    coln_count = (point[1] - longitude_pair[0]) // coln_width
    if is_o:
        rtn_num = int(row_count * width + coln_count + 24)
    else:
        rtn_num = int(row_count * width + coln_count + 24 + height * width)
    # print(type(rtn_num))
    return rtn_num


def generate_grid_position(height, width, latitude_pair, longitude_pair):
    points = {}
    row_height = (latitude_pair[1] - latitude_pair[0]) / height
    coln_width = (longitude_pair[1] - longitude_pair[0]) / width
    for i in height:
        for j in width:
            lat = latitude_pair[0] + i * row_height
            lon = longitude_pair[0] + j * coln_width
            points['{}'.format(i * height + j * width)] = (lat, lon)
    return points


def process_original_od(token, height, width):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    current_date = datetime.now().strftime("%Y-%m-%d")
    current_date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        start = default_timer()
        df = read_csv(current_dir + "\\dataset\\" +
                      "upload_od_original-{}.csv".format(token))
        # specified 4 headers
        keys = df.keys()
        if("day_of_week" not in keys or
            "time" not in keys or "weather" not in keys or
            "o_poi" not in keys or "d_poi" not in keys or
            "o_latitude" not in keys or "o_longitude" not in keys or
                "d_latitude" not in keys or "d_longitude" not in keys):
            # return 1
            raise KeyError(
                "Lack of one or all specified keys, please check column names.")
        df = df[~df.isnull().any(axis=1)]
        # specified shape without null value
        row_count, column_count = df.shape
        if(row_count < 1024 or column_count != 9):
            # return 1
            raise IndexError(
                "Number of records without null value is less than 1024 or columns count is not 9.")
        # sampling
        df = df.sample(n=1024)
        # sort by timestamp
        df = df.sort_values(by='time')
        # encoding rules, day_of_week:0-1, time:2-3, weather:4-5, o_poi:6-14, d_poi:15-23, o_num:24-123, d_num: 124-223
        # date_time = to_datetime(df['date_time'], unit='s')
        # df['hour'] = date_time.dt.hour
        # df['day_of_week'] = date_time.dt.dayofweek + 24
        df['time'] = df['time'] + 2
        df['weather'] = df['weather'] + 4
        df['o_poi'] = df['o_poi'] + 6
        df['d_poi'] = df['d_poi'] + 15
        latitude = df['o_latitude'].append(df['d_latitude'], ignore_index=True)
        longitude = df['o_longitude'].append(
            df['d_longitude'], ignore_index=True)
        min_lat = latitude.min()
        max_lat = latitude.max()
        min_lon = longitude.min()
        max_lon = longitude.max()
        df['o_num'] = df.apply(lambda row: grid_number(True,
                                                       (row['o_latitude'],
                                                        row['o_longitude']),
                                                       (min_lat, max_lat), (min_lon,
                                                                            max_lon),
                                                       height, width), axis=1)
        df['d_num'] = df.apply(lambda row: grid_number(False,
                                                       (row['d_latitude'],
                                                        row['d_longitude']),
                                                       (min_lat, max_lat), (min_lon,
                                                                            max_lon),
                                                       height, width), axis=1)
        # save to csv
        file_path = '{}\\dataset\\upload_od_processed-{}.txt'.format(
            current_dir, token)
        # with open(file_path, 'a') as f:
        df.to_csv(file_path, sep=' ', columns=[
                  'time', 'day_of_week', 'weather', 'o_num', 'd_num', 'o_poi', 'd_poi'],
                  header=False, index=False)
        data_range = {
            'time': str(list(df['hour'].unique() - 2)),
            'day_of_week': str(list(df['day_of_week'].unique())),
            'weather': str(list(df['weather'].unique() - 4)),
            'o_poi': str(list(df['o_poi'].unique() - 6)),
            'd_poi': str(list(df['d_poi'].unique() - 15)),
            'o_num': str(list(df['o_num'].unique() - 24)),
            'd_num': str(list(df['d_num'].unique() - 24 - height * width)),
        }
        point_pairs = generate_grid_position(height, width,
                                             (min_lat, max_lat), (min_lon, max_lon))
        stop = default_timer()
        run_time = stop - start
        results = {
            'date_time': current_date_time,
            'token': token,
            'run_time': run_time
        }
        new_row = DataFrame(results, index=[0])
        file_path = '{}\\try_process_upload_od\\try_{}.csv'.format(
            current_dir, current_date)
        with open(file_path, 'a') as f:
            new_row.to_csv(f, header=False, index=False)
        return 0, data_range, point_pairs
    except:
        # print(format_exc())
        results = {
            'date_time': current_date_time,
            'token': token,
            'exception_info': format_exc()
        }
        # print(results)
        new_row = DataFrame(results, index=[0])
        file_path = '{}\\except_process_upload_od\\except_{}.csv'.format(
            current_dir, current_date)
        with open(file_path, 'a') as f:
            new_row.to_csv(f, header=False, index=False)
        data_range = {}
        point_pairs = {}
        return 1, data_range, point_pairs


# print(process_original_od(10, 10))
