import psycopg2
import pandas as pd
import timeit
import pyproj
from tqdm import tqdm
from shapely.geometry import Point
from shapely.strtree import STRtree


def read_poi_types_csv():
    return pd.read_csv(
        "E:\\acer\\VSProjects\\mysite\\rhythm\\algorithm\\poi_class_id.csv", encoding="gb2312")["类型"]


def index_in_poi_types(type_, types):
    for i in range(len(types)):
        if types[i] == type_:
            return i
    return -1


def construct_poi_info_dic():
    sql_of_select_poi = "SELECT mercator_x,\
                                        mercator_y,\
                                        level_1_category,\
                                        level_2_category,\
                                        level_3_category\
                                    FROM _poi_part_info"
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        # start_timer =
        cursor.execute(sql_of_select_poi)
        # track_records = cursor.fetchall()
        poi_dic = dict()
        for record_ in cursor:
            key_name_ = "{}_{}".format(record_[0], record_[1])
            poi_dic[key_name_] = (record_[2], record_[3], record_[4])
        return poi_dic
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()


def construct_rtree():
    sql_of_select_poi_info = "SELECT auto_id, mercator_x, mercator_y from _poi_part_info"
    sql_of_update_poi_info = "UPDATE _poi_part_info SET mercator_x = {}, mercator_y = {} WHERE auto_id = {};"
    wgs84_ = pyproj.Proj(init="epsg:4326")
    mercator_ = pyproj.Proj(init="epsg:3857")
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        # start_timer =
        cursor.execute(sql_of_select_poi_info)
        poi_records = cursor.fetchall()
        points = []
        for poi_ in poi_records:
            # mercator_coordinates = pyproj.transform(
            #     wgs84_, mercator_, poi_[2], poi_[1])
            # print(mercator_coordinates)
            mercator_coordinates = (poi_[1], poi_[2])
            points.append(Point(mercator_coordinates))
            # sql_of_temp_update_poi_info = sql_of_update_poi_info.format(
            #     mercator_coordinates[0], mercator_coordinates[1], poi_[0])
            # cursor.execute(sql_of_temp_update_poi_info)
            # connection.commit()
        rtree = STRtree(points)
        return rtree
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            connection.commit()
            cursor.close()
            connection.close()


def count_poi_numbers_vector_using_rtree():
    poi_types = read_poi_types_csv()
    wgs84_ = pyproj.Proj(init="epsg:4326")
    mercator_ = pyproj.Proj(init="epsg:3857")
    sql_of_select_track_destination = "SELECT track_id,\
                                              destination_latitude,\
                                              destination_longitude\
                                       FROM _20140803_taxi_track"
    # sql_of_select_specified_poi = "SELECT \
    #                                     level_1_category,\
    #                                     level_2_category,\
    #                                     level_3_category\
    #                                 FROM _poi_part_info\
    #                                 WHERE mercator_x = {} and mercator_y = {}"
    sql_of_insert_poi_vector = "UPDATE _20140803_taxi_track SET poi_numbers_vector = ARRAY{} WHERE track_id = {}"
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        # start_timer =
        cursor.execute(sql_of_select_track_destination)
        track_records = cursor.fetchall()
        rtree = construct_rtree()
        all_poi_info = construct_poi_info_dic()
        for _, track_record in enumerate(tqdm(track_records)):
            destination_point = Point(
                pyproj.transform(
                    wgs84_, mercator_, track_record[2], track_record[1]))
            # start_loop = timeit.default_timer()
            points_in_radius = rtree.query(destination_point.buffer(50))
            # end_loop = timeit.default_timer()
            # print("time_point_in_radius: ", end_loop - start_loop)
            # print(len(points_in_radius))
            # break
            poi_vector = [0] * 216
            # start_loop = timeit.default_timer()
            for point_in_radius in points_in_radius:
                # point_wgs84 =
                # sql_of_temp_select_specified_poi = sql_of_select_specified_poi.format(
                #     point_in_radius.x, point_in_radius.y)
                # # print(point_in_radius.x, point_in_radius.y)
                # cursor.execute(sql_of_temp_select_specified_poi)
                # print(sql_of_temp_select_specified_poi)
                key_name_ = "{}_{}".format(
                    point_in_radius.x, point_in_radius.y)
                poi_record = all_poi_info[key_name_]
                # print(poi_record)
                # start_index = timeit.default_timer()
                index_of_level_1 = index_in_poi_types(poi_record[0], poi_types)
                index_of_level_2 = index_in_poi_types(poi_record[1], poi_types)
                index_of_level_3 = index_in_poi_types(poi_record[2], poi_types)
                # end_index = timeit.default_timer()
                # print("time_index: ", end_index - start_index)
                if index_of_level_3 > 0:
                    poi_vector[index_of_level_3] += 1
                else:
                    if index_of_level_2 > 0:
                        poi_vector[index_of_level_2] += 1
                    else:
                        if index_of_level_1 > 0:
                            poi_vector[index_of_level_1] += 1
            # end_loop = timeit.default_timer()
            # print("time_loop: ", end_loop - start_loop)
            sql_of_insert_poi_vector = sql_of_insert_poi_vector.format(
                poi_vector, track_record[0])
            # print(poi_vector)
            cursor.execute(sql_of_insert_poi_vector)
            connection.commit()
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()


def count_poi_numbers_vector():
    poi_types = read_poi_types_csv()
    sql_of_select_track_destination = "SELECT track_id,\
                                              destination_latitude,\
                                              destination_longitude\
                                       FROM _20140803_taxi_track"
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        # start_timer =
        cursor.execute(sql_of_select_track_destination)
        track_records = cursor.fetchall()
        for _, track_record in enumerate(tqdm(track_records)):
            sql_of_select_poi_in_radius = "SELECT latitude,\
                                                    longitude,\
                                                    level_1_category,\
                                                    level_2_category,\
                                                    level_3_category\
                                            FROM _poi_part_info\
                                            WHERE is_in_circle(500, {}, {}, latitude, longitude) = true"
            sql_of_insert_poi_vector = "UPDATE _20140803_taxi_track SET poi_numbers_vector = ARRAY{} WHERE track_id = {}"
            sql_of_select_poi_in_radius = sql_of_select_poi_in_radius.format(
                track_record[1], track_record[2])
            start_sql_of_select_poi_in_radius = timeit.default_timer()
            cursor.execute(
                sql_of_select_poi_in_radius)
            end_sql_of_select_poi_in_radius = timeit.default_timer()
            print("time_sql_of_select_poi_in_radius: ",
                  end_sql_of_select_poi_in_radius - start_sql_of_select_poi_in_radius)
            poi_in_radius_records = cursor.fetchall()
            poi_vector = [0] * 216
            start_loop = timeit.default_timer()
            for poi_record in poi_in_radius_records:
                index_of_level_1 = index_in_poi_types(poi_record[2], poi_types)
                index_of_level_2 = index_in_poi_types(poi_record[3], poi_types)
                index_of_level_3 = index_in_poi_types(poi_record[4], poi_types)
                if index_of_level_3 > 0:
                    poi_vector[index_of_level_3] += 1
                else:
                    if index_of_level_2 > 0:
                        poi_vector[index_of_level_2] += 1
                    else:
                        if index_of_level_1 > 0:
                            poi_vector[index_of_level_1] += 1
            end_loop = timeit.default_timer()
            print("time_loop: ", end_loop - start_loop)
            sql_of_insert_poi_vector = sql_of_insert_poi_vector.format(
                poi_vector, track_record[0])
            start_sql_of_insert_poi_vector = timeit.default_timer()
            cursor.execute(sql_of_insert_poi_vector)
            end_sql_of_insert_poi_vector = timeit.default_timer()
            print("time_sql_of_insert_poi_vector: ",
                  end_sql_of_insert_poi_vector - start_sql_of_insert_poi_vector)
            start_commit = timeit.default_timer()
            connection.commit()
            end_commit = timeit.default_timer()
            print("time_commit: ", end_commit - start_commit)
            print(sql_of_insert_poi_vector)
            # break
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            cursor.close()
            connection.close()

# print(pd.read_csv(
#     "E:\\acer\\VSProjects\\mysite\\rhythm\\algorithm\\poi_class_id.csv", encoding="gb2312")["类型"])
# count_poi_numbers_vector()
# print(construct_rtree())


def test():
    import json
    import psycopg2.extras
    sql_of_select_poi_info = "SELECT auto_id, mercator_x, mercator_y from _poi_part_info WHERE auto_id = 2"
    # sql_of_update_poi_info = "UPDATE _poi_part_info SET mercator_x = {}, mercator_y = {} WHERE auto_id = {};"
    # wgs84_ = pyproj.Proj(init="epsg:4326")
    # mercator_ = pyproj.Proj(init="epsg:3857")
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        # cursor = connection.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # start_timer =
        cursor = connection.cursor()
        cursor.execute(sql_of_select_poi_info)
        for record in cursor:
            print(record)
        # poi_records = cursor.fetchall()
        # points = [dict(record) for record in cursor]
        # for row in poi_records:
        #     # print(type(row))
        #     # print(row)
        #     # print(row['auto_id'])
        #     points.append(dict(row))
        # print(points)
        # mercator_coordinates = pyproj.transform(
        #     wgs84_, mercator_, poi_[2], poi_[1])
        # print(mercator_coordinates)
        #     mercator_coordinates = (poi_[1], poi_[2])
        #     points.append(Point(mercator_coordinates))
        #     # sql_of_temp_update_poi_info = sql_of_update_poi_info.format(
        #     #     mercator_coordinates[0], mercator_coordinates[1], poi_[0])
        #     # cursor.execute(sql_of_temp_update_poi_info)
        #     # connection.commit()
        # rtree = STRtree(points)
        # return rtree
    except (psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        if (connection):
            connection.commit()
            cursor.close()
            connection.close()


count_poi_numbers_vector_using_rtree()
# test()
