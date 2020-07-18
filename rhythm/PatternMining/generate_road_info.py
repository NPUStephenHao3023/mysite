import os
from tqdm import tqdm
import pandas as pd
import numpy as np
# from MapMatch import MyTool, mapmatch
from .MapMatch import MyTool, mapmatch
from pyproj import Proj, transform
from json import dump, loads


def road_info(result):
    G_copy, _, _ = MyTool.get_GandRtree()
    rules = {}
    p1_proj = Proj(init="epsg:4326")  # WGS84 coordinates system
    p2_proj = Proj(init="epsg:32648")  # projection coordinates system
    networks_edges = {data['road_id']: data for _,
                      _, data in G_copy.edges(data=True)}
    result = [id for l in result for id in l]
    result = list(set(result))
    print("*"*10)
    for road_id in tqdm(result):
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
    with open('new_road_rules.json', 'w+', encoding='utf-8') as f:
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


def read_new_road_rules():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(cur_dir, 'new_road_rules.json')
    road_dic = loads(file_path)
    for _, road_info in road_dic:
        roads = road_info['road_name']
        print(roads)


# roads_in_csv()
# read_new_road_rules()
