# DO NOT CHANGE DATASET PATH
Because there is a reference in `re_gui21.py` to this directory as follows:
```python
def figure_to_img(dataset_, method_, args):
    ...
    dirname_ = pwd.dirname(__file__)
    dataset_path = dirname_ + "\\dataset\\" + dataset_
    ...