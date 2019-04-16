import psycopg2
import pandas as pd
import timeit
from tqdm import tqdm


def default_database_connection():
    return psycopg2.connect(user="postgres",
                            password="StephenHao@3023",
                            host="127.0.0.1",
                            port="5432",
                            database="urban_cross_domain_data"
                            )


def read_poi_types_csv():
    return pd.read_csv(
        "E:\\acer\\VSProjects\\mysite\\rhythm\\algorithm\\poi_class_id.csv", encoding="gb2312")["类型"]


def index_in_poi_types(type_, types):
    for i in range(len(types)):
        if types[i] == type_:
            return i
    return -1


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
            print("time_sql_of_select_poi_in_radius: ", end_sql_of_select_poi_in_radius - start_sql_of_select_poi_in_radius)       
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
            print("time_sql_of_insert_poi_vector: ", end_sql_of_insert_poi_vector - start_sql_of_insert_poi_vector)
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
count_poi_numbers_vector()
