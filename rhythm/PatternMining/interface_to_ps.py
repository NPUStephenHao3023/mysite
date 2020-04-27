import os.path
from pandas import read_csv
from numpy import array
from prefixspan import PrefixSpan
from csv import reader


def sequence_mining(min_support, token):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = "{}\\dataset\\upload_sequence_processed-{}.txt".format(
        current_dir, token)
    db = []
    with open(data_path, 'r') as f:
        file = reader(f, delimiter=' ', quotechar='\r')
        i = 0
        for row in file:
            if i % 2 == 0:
                db.append([int(item) for item in row])
            i += 1
    row_count = len(db)
    # print(db)
    # print(row_count)
    ps = PrefixSpan(db)
    all_sequence = ps.frequent(row_count*min_support)
    # all_sequence = ps.frequent(1)
    all_sequence_num = len(all_sequence)
    # print("="*99)
    # print(all_sequence_num)
    return all_sequence_num, all_sequence


def rules(all_sequence, min_conf):
    Rules = []
    cnt = 0
    all_sequence_dict = {tuple(seq[1]): seq[0] for seq in all_sequence}
    for seq, sup in all_sequence_dict.items():
        seq_len = len(seq)
        if seq_len > 1:
            for conseq_len in range(1, seq_len):
                antecedent = seq[:seq_len - conseq_len]
                consequent = seq[-conseq_len:]
                if antecedent in all_sequence_dict and consequent in all_sequence_dict:
                    conf = all_sequence_dict[seq] / \
                        all_sequence_dict[antecedent]
                    if conf >= min_conf:
                        cnt += 1
                        Rules.append(
                            (antecedent, consequent, sup, conf))
    # print(cnt)
    return cnt, Rules


# length, all_seq = sequence_mining(0.1, '')
# print(length, all_seq)
# print(rules(all_seq, 0.1))
# sequence_mining(0.5, 'bcd61d371c171b653be83bcae869a2f8')
# length, all_seq = sequence_mining(0.1, 'bcd61d371c171b653be83bcae869a2f8')
# length, all_seq = sequence_mining(0.1, '')
# print(length, all_seq)
# print(rules(all_seq, 0.1))
