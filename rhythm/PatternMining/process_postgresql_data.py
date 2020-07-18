import psycopg2
import os
import pandas as pd
import numpy as np
from tqdm import tqdm
# from MapMatch import MyTool, mapmatch
from .MapMatch import MyTool, mapmatch
from pyproj import Proj, transform
from json import dump


def generate_csv():
    sql_of_copy_to = "COPY (\
                          SELECT track_id,\
                              origin_latitude as o_latitude,\
                              origin_longitude as o_longitude,\
                              destination_latitude as d_latitude,\
                              destination_longitude as d_longitude,\
                              origin_date_time,\
                              road_id\
                          FROM _20140803_taxi_track_{0}_{1}\
                          WHERE track_id IS NOT NULL AND road_id IS NOT NULL\
					  )\
					  TO 'E:\\acer\\VSProjects\mysite\\rhythm\\PatternMining\\dataset\\20140803_{0}_{1}.csv'\
					  (FORMAT 'csv', DELIMITER ',', HEADER TRUE,  ENCODING 'UTF-8')"
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        for hour in tqdm(range(6, 24)):
            # sql_of_temp_update_track_id = sql_of_update_track_id.format(
            #     hour, hour + 1)
            sql_of_temp_copy_to = sql_of_copy_to.format(hour, hour + 1)
            cursor.execute(sql_of_temp_copy_to)
            connection.commit()
        print('ends.')
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            connection.commit()
            cursor.close()
            connection.close()


def merge_csv():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(cur_dir, 'dataset')
    df = pd.read_csv(os.path.join(
        file_path, '20140803_{}_{}.csv'.format(6, 7)))
    for hour in tqdm(range(7, 24)):
        temp_df = pd.read_csv(os.path.join(
            file_path, '20140803_{}_{}.csv'.format(hour, hour+1)))
        df = pd.concat([df, temp_df])
        df.reset_index(drop=True, inplace=True)
    df.to_csv(os.path.join(file_path, '20140803.csv'), index=False)


def generate_new_data():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(cur_dir, 'dataset')
    df = pd.read_csv(os.path.join(file_path, '20140803.csv'))
    df['origin_date_time'] = pd.to_datetime(df['origin_date_time'])
    # calculate time
    df['time'] = 1
    df.loc[df.origin_date_time.dt.hour > 16, 'time'] = 0
    # generate_day_of_week
    df['day_of_week'] = np.random.randint(0, 2, size=df.shape[0])
    # generate_weather
    df['weather'] = np.random.randint(0, 2, size=df.shape[0])
    # generate_o_poi
    df['o_poi'] = np.random.randint(0, 9, size=df.shape[0])
    # generate_d_poi
    df['d_poi'] = np.random.randint(0, 9, size=df.shape[0])
    df.to_csv(os.path.join(file_path, 'frequent_upload.csv'), columns=['o_latitude', 'o_longitude', 'd_latitude', 'd_longitude',
                                                                       'time', 'day_of_week', 'weather', 'o_poi', 'd_poi', 'road_id'], index=False)


def road_info(result):
    # about 3 mins to load nx data
    G_copy, _, _ = MyTool.get_GandRtree()
    rules = {}
    p1_proj = Proj(init="epsg:4326")  # WGS84 coordinates system
    p2_proj = Proj(init="epsg:32648")  # projection coordinates system
    networks_edges = {data['road_id']: data for _,
                      _, data in G_copy.edges(data=True)}
    result = [id for l in result for id in l]
    # 21576 [02:29<2:29:27,  2.34it/s]
    for road_id in result:
        road_line_string = networks_edges[road_id]['geometry']
        road_wgs84_coords = []
        for coord in list(road_line_string.coords):
            road_wgs84_coords.append(transform(
                p2_proj, p1_proj, coord[0], coord[1]))
        if 'name' in networks_edges[road_id]:
            rules["{}".format(road_id)] = {
                'road_name': networks_edges[road_id]['name'],
                'road_length': networks_edges[road_id]['length'],
                'road_coords': road_wgs84_coords,
            }
    with open('new_rules.json', 'w+', encoding='utf-8') as f:
        dump(rules, f, ensure_ascii=False)


def roads_in_csv():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(cur_dir, 'dataset')
    df = pd.read_csv(os.path.join(file_path, 'frequent_upload.csv'))
    temp_road_sequences = list(df.road_id)
    road_sequences = []
    for vector in temp_road_sequences:
        vector = vector.replace('{', ',')
        vector = vector.replace('}', ',')
        vector = vector.split(',')
        temp_sequence = []
        for i in range(1, len(vector)-1):
            temp_sequence.append(int(vector[i]))
        road_sequences.append(temp_sequence)
    road_info(road_sequences)

# generate_way_point_csv()
# merge_csv()
# generate_new_data()
