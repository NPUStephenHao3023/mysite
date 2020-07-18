import os
import random
from json import dump, load


def new_fr_rules():
    cur_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(cur_dir, 'new_road_rules.json')
    road_names = []
    with open(file_path, "r", encoding='utf-8') as f:
        road_dic = load(f)
        for _, road_info in road_dic.items():
            # print(road_info)
            roads = road_info['road_name']
            if (type(roads) == list):
                roads = roads[0]
            # print(roads, type(roads))
            if (roads.isalpha()):
                road_names.append(roads)
    # print(len(road_names))
    road_names = list(set(road_names))
    # print(len(road_names))
    # print(road_names)
    with open(os.path.join(cur_dir, 'fr_rules.json'), "r", encoding='utf-8') as f:
        fr_rules = load(f)
        is_add = [False] * len(fr_rules)
        for i in range(len(fr_rules)):
            # print(rule['roads'])
            rule_roads = fr_rules[i]['roads']
            if (len(rule_roads) != 0):
                if (is_add[i] is False):
                    fr_rules[i]['roads'] = random.sample(road_names, 3)
                    is_add[i] = True
                    for j in range(i+1, len(fr_rules)):
                        if (fr_rules[j]['roads'] == rule_roads):
                            fr_rules[j]['roads'] = fr_rules[i]['roads']
                            is_add[j] = True
    with open(os.path.join(cur_dir, 'new_fr_rules.json'), 'w+', encoding='utf-8') as f:
        dump(fr_rules, f, ensure_ascii=False)

        # roads_in_csv()
# new_fr_rules()
