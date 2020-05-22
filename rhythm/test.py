import os.path


current_dir = os.path.dirname(os.path.abspath(__file__))
file_path = '{}\\PatternMining\\dataset\\upload_od_original-{}.csv'.format(
    current_dir, 'hi')

path1 = os.path.join(current_dir, 'PatternMining', 'dataset',
                     'upload_od_original-{}.csv'.format('hi'))

print(file_path)
print(path1)
