import os.path
from csv import reader, writer
from itertools import permutations
from json import dump
from pandas import read_csv
import random
#-----------------------------#
# from eclat import eclat
from .eclat import eclat
#-----------------------#


def read_data(token):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # no headers in upload_preprocessed.txt
    # data_path = current_dir + \
    #     '\\dataset\\upload_od_processed-{}.txt'.format(token)
    data_path = os.path.join(current_dir, 'dataset',
                             'upload_od_processed-{}.txt'.format(token)
                             )
    data = []
    with open(data_path, 'r') as f:
        file = reader(f, delimiter=' ', quotechar='\r')
        for row in file:
            data.append(row)
    return data


def write_result(result, token):
    """ abondon
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    # result_path = current_dir + '\\dataset\\upload_mined.txt'
    result_path = os.path.join(
        current_dir, 'dataset', 'upload_mined_{}.txt'.format(token))
    with open(result_path, 'w') as file:
        # file_data = writer(file, delimiter=',', quotechar='\r')
        file_data = writer(file)
        for rule in result:
            # for itemset in itemset_K:
                # output_string = ''
                # for item in itemset:
                #     output_string += str(item)+' '
                # output_string += '(' + str(result[1][itemset]) + ')'
            output_string = str(rule)
            file_data.writerow([output_string])


def frequent_itemset_mining(min_support, token):
    data = read_data(token)
    result = eclat(data, min_support=min_support, iterative=False,
                   use_CUDA=False, block=16, thread=16)
    itemsets = result
    if len(itemsets[0]) == 0:
        # 'Found 0 frequent itemset, please try again with a lower minimum support value!'
        return 1, itemsets
    # write_result(result)
    return 0, itemsets


def roads_of_od(o_num, d_num, token):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    roads_file_path = os.path.join(
        current_dir, 'dataset', 'upload_od_processed_roads-{}.csv'.format(token))
    df = read_csv(roads_file_path)
    road_str = df.loc[(df['o_num'] == o_num) & (
        df['d_num'] == d_num), 'road_id'].values[0]
    road_str = road_str.replace('{', ',')
    road_str = road_str.replace('}', ',')
    road_list = road_str.split(',')
    temp_sequence = []
    for i in range(1, len(road_list)-1):
        temp_sequence.append(int(road_list[i]))
        # if length of road is greater than 3, loop ends
        # we need 3 roads at most.
        if (i == 3):
            break
    return temp_sequence


def fr_rules(FreqItems, token):
    Rules = []
    cnt = 0
    for items, support in FreqItems.items():
        items_len = len(items)
        if (items_len > 1):
            cnt += 1
            temp_rule = {}
            temp_rule['itemset'] = items
            temp_rule['support'] = support
            o_num = -1
            d_num = -1
            for item in items:
                int_item = int(item)
                # print(int_item)
                if (int_item > 23) & (int_item < 124):
                    o_num = int_item
                    # print("o_num:{}".format(o_num))
                if (int_item > 123) & (int_item < 224):
                    d_num = int_item
                    # print("d_num:{}".format(d_num))
            # print("***")
            if (o_num != -1) & (d_num != -1):
                # print(o_num, d_num)
                temp_rule['roads'] = roads_of_od(o_num, d_num, token)
            else:
                temp_rule['roads'] = []
            Rules.append(temp_rule)
    return cnt, Rules


def associ_rules(FreqItems, confidence):
    Rules = []
    cnt = 0
    for items, support in FreqItems.items():
        items_len = len(items)
        if (items_len > 1):
            all_perms = list(permutations(items, items_len))
            for lst in all_perms:
                for conseq_len in range(1, items_len):
                    antecedent = lst[:items_len - conseq_len]
                    consequent = lst[-conseq_len:]
                    if antecedent in FreqItems and consequent in FreqItems:
                        conf = FreqItems[items] / FreqItems[antecedent]
                        if conf >= confidence:
                            cnt += 1
                            Rules.append(
                                (antecedent, consequent, support, conf))
    return cnt, Rules


# rtn, items = frequent_itemset_mining(0.02) // without token txt file
# rtn, items = frequent_itemset_mining(0.02, '375c8c801ee9083a87baf58e88dd5989')

# print(rtn, items)
# print(rules(items[1], 0.5)[0])
# write_result(rules(items[1], 0.5)[1], '375c8c801ee9083a87baf58e88dd5989')
# write_result(rules(items[1], 0.5)[1], '9ddfdeb821c2bbb1f5a770a212c0af15')
# print(type(items[1]))
# print(len(items))


rtn, items = frequent_itemset_mining(0.001, '9ddfdeb821c2bbb1f5a770a212c0af15')
cnt, rules = fr_rules(items[1], '9ddfdeb821c2bbb1f5a770a212c0af15')
# print(cnt)
# print(rules[-1])
random.shuffle(rules)
with open('fr_rules.json', 'w+', encoding='utf-8') as f:
    dump(rules, f, ensure_ascii=False)
