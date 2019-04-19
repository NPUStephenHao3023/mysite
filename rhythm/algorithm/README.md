# re_gui21.py: 生成图片的说明

> regui21.py 位于 'mysite\rhythm\algorithm'目录下

```python
def figure_to_img(dataset_, method_, args):
    """dataset_ is the full name of dataset in csv format file,
        method_ is the full name of selected method,
        args is an list of arguments.
        PS:
            The format of dataset_ is like "dataset1.csv",
            and of method_ is one of the following: "2d_equal_grid",
            "2d_kdtree", "3d_equal_grid", "3d_kdtree", "3d_slice_merge",
            "time_space", "space_time", and of args is like [5] or [4, 10]
        Return image full name and extra information.
        PS:
            image full name is a string like "dataset_name-method-argument.png",
            extra information is a string list contains information as following order:
                information entropy,
                variance,
                standard deviation,
                arithmetic mean,
                minimum,
                maximum,
                skew,
                kurtosis,
                number.
    """

```

## 参数dataset_

字符串类型

数据源为csv存储格式(首行没有header, 分隔符是 ',')

每行数据的格式为(unix_timestamp, wgs84_longitude, wgs84_latitude)

将转换好的数据放在'mysite\rhythm\algorithm\dateset'目录下

例如'mysite\rhythm\algorithm\dateset\dateset1.csv'，则dataset_='dataset1.csv'

## 参数method_

字符串类型

method_的取值为【2d_equal_grid】【2d_kdtree】【3d_equal_grid】【3d_kdtree】【3d_slice_merge】【time_space】【space_time】中的一个

## 参数args

列表类型

### 1 一个参数

【2d_equal_grid】

【2d_kdtree】

【3d_equal_grid】

【3d_kdtree】

【3d_slice_merge】

### 2 两个参数

【time_space】

【space_time】

