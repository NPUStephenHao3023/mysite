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
    for i in range(height):
        for j in range(width):
            upper_left_lat = latitude_pair[0] + i * row_height
            upper_left_lon = longitude_pair[0] + j * coln_width
            lower_right_lat = upper_left_lat - row_height
            lower_right_lon = upper_left_lon + coln_width
            points['{}'.format(i * width + j)] = [(upper_left_lat,
                                                   upper_left_lon), (lower_right_lat, lower_right_lon)]
    return points


def process_original_od(token, height, width):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    current_date = datetime.now().strftime("%Y-%m-%d")
    current_date_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    try:
        start = default_timer()
        df = read_csv(os.path.join(current_dir, 'dataset',
                                   'upload_od_original-{}.csv'.format(token))
                      )
        # specified 10 headers
        keys = df.keys()
        if("day_of_week" not in keys or "road_id" not in keys or
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
        if(row_count < 1024 or column_count != 10):
            # return 1
            raise IndexError(
                "Number of records without null value is less than 1024 or columns count is not 10.")

        # sort by timestamp
        df = df.sort_values(by='time')
        # encoding rules, day_of_week:0-1, time:2-3, weather:4-5, o_poi:6-14, d_poi:15-23, o_num:24-123, d_num: 124-223
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
        mined_file_path = os.path.join(current_dir, 'dataset',
                                       'upload_od_processed-{}.txt'.format(
                                           token)
                                       )
        roads_file_path = os.path.join(current_dir, 'dataset',
                                       'upload_od_processed_roads-{}.csv'.format(
                                           token)
                                       )
        df.to_csv(mined_file_path, sep=' ', columns=[
                  'time', 'day_of_week', 'weather', 'o_num', 'd_num', 'o_poi', 'd_poi'],
                  header=False, index=False)
        roads_df = df[['o_num', 'd_num', 'road_id']]
        roads_df = roads_df.groupby(['o_num', 'd_num']).first()
        # roads_str = df.groupby('o_num', 'd_num').apply(lambda group: '{'.join(group['road_id'])).values
        # roads_str = list(roads)
        # roads_list = []
        # for road_str in roads_str:
        #     temp_road_list = []
        #     road_str = road_str.replace('{', ',')
        #     road_str = road_str.replace('}', ',')
        #     road_list = road_str.split(',')
        #     for item in road_list:
        #         if item != '':
        #             item = int(item)
        #             # if item not in temp_road_list:
        #             #     temp_road_list[item] = 1
        #             # else:
        #             #     temp_road_list[item] += 1
        #             temp_road_list.append(item)
        # roads_list.append(temp_road_list)
        roads_df.to_csv(roads_file_path)
        data_range = {
            'time': str(list(df['time'].unique() - 2)),
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
        file_path = os.path.join(
            current_dir, 'try_process_upload_od', 'try_{}.csv'.format(current_date))
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
        file_path = os.path.join(
            current_dir, 'except_process_upload_od', 'except_{}.csv'.format(current_date))
        with open(file_path, 'a') as f:
            new_row.to_csv(f, header=False, index=False)
        data_range = {}
        point_pairs = {}
        return 1, data_range, point_pairs


# print(process_original_od(10, 10))
