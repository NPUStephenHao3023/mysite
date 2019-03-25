import psycopg2
import glob
import ntpath
import timeit


def import_taxi_gps_data_to_database():
    """
    input the original data which is of txt format to database.
    """
    sql_of_create_tables = ""
    sql_of_create_partitions = ""
    sql_of_create_indices = ""
    sql_of_copies = ""
    sql_of_create_single_table = "CREATE TABLE taxi_gps._{0}\
                                    (\
                                      taxi_id integer,\
                                      latitude double precision,\
                                      longitude double precision,\
                                      passenger boolean,\
                                      date_time timestamp without time zone\
                                    ) PARTITION BY RANGE (date_time);"
    sql_of_create_single_partition = "CREATE TABLE taxi_gps._{0} PARTITION OF taxi_gps._{1}\
                                        FOR VALUES FROM (\'{2}\') TO (\'{3}\');"
    sql_of_create_single_index = "CREATE INDEX ON taxi_gps._{0} (taxi_id);"
    sql_of_single_copy = "COPY taxi_gps._{0}\
                                  FROM \'{1}\'\
                                  WITH DELIMITER ',';"
    file_paths = glob.glob(
        r"E:\acer\VSProjects\mysite\rhythm\algorithm\dataset\*.txt")
    for single_file_path in file_paths:
        single_file_name = ntpath.basename(single_file_path)
        file_name_list = single_file_name.split('_')
        if file_name_list[-1] == "train.txt":
            # year = file_name_list[0][0:4]
            # month = file_name_list[0][4:6]
            # day = file_name_list[0][6:8]
            sql_of_create_tables += sql_of_create_single_table.format(
                file_name_list[0])
            # hour_list = ["00", "01", "02", "03", "04", "05", "06", "07",
            #              "08", "09", "10", "11", "12", "13", "14", "15",
            #              "16", "17", "18", "19", "20", "21", "22", "23"]
            for i in range(24):
                # partition_name = file_name_list[0] + \
                #     "_h{0}".format(hour_list[i])
                partition_name = file_name_list[0] + \
                    "_h{0}".format(i)
                start_time = "{}-{}-{} {}:00:00".format(year, month, day, i)
                end_time = "{}-{}-{} {}:00:00".format(year, month, day, i + 1)
                sql_of_create_partitions += sql_of_create_single_partition.format(
                    partition_name, file_name_list[0], start_time, end_time)
                sql_of_create_indices += sql_of_create_single_index.format(
                    partition_name)
            sql_of_copies += sql_of_single_copy.format(
                file_name_list[0], single_file_path)
            break
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        start_sql = timeit.default_timer()
        # print(sql_of_create_tables)
        cursor.execute(sql_of_create_tables)
        middle1 = timeit.default_timer()
        cursor.execute(sql_of_create_partitions)
        middle2 = timeit.default_timer()
        cursor.execute(sql_of_create_indices)
        middle3 = timeit.default_timer()
        cursor.execute(sql_of_copies)
        middle4 = timeit.default_timer()
        # print(sql_of_create_tables + sql_of_create_partitions +
        #                sql_of_create_indices + sql_of_copies)
        end_sql = timeit.default_timer()
        print('single_create_table_time: ', middle1 - start_sql)
        print('single_create_partitions_time: ', middle2 - middle1)
        print('single_create_indices_time: ', middle3 - middle2)
        print('single_copies_time: ', middle4 - middle3)
        print('single_total_time: ', end_sql - start_sql)
#         # Print PostgreSQL Connection properties
#         print(connection.get_dsn_parameters(), "\n")
#         # Print PostgreSQL version
#         cursor.execute("SELECT version();")
#         record = cursor.fetchone()
#         print("You are connected to - ", record, "\n")
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        # closing database connection.
        if (connection):
            connection.commit()
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


def import_taxi_gps_data_to_database_v1():
    sql_of_create_tables = ""
    sql_of_copies = ""
    sql_of_create_single_table = "CREATE TABLE public._{0}\
                                    (\
                                      taxi_id integer,\
                                      latitude double precision,\
                                      longitude double precision,\
                                      passenger boolean,\
                                      date_time timestamp without time zone\
                                    );"
    sql_of_single_copy = "COPY public._{0}\
                                  FROM \'{1}\'\
                                  WITH DELIMITER ',';"

    file_paths = glob.glob(
        r"E:\acer\VSProjects\mysite\rhythm\algorithm\dataset\*.txt")
    for single_file_path in file_paths:
        single_file_name = ntpath.basename(single_file_path)
        file_name_list = single_file_name.split('_')
        # year = file_name_list[0][0:4]
        # month = file_name_list[0][4:6]
        # day = file_name_list[0][6:8]
        if file_name_list[-1] == "train.txt":
            sql_of_create_tables += sql_of_create_single_table.format(
                file_name_list[0])
            # hour_list = ["00", "01", "02", "03", "04", "05", "06", "07",
            #              "08", "09", "10", "11", "12", "13", "14", "15",
            #              "16", "17", "18", "19", "20", "21", "22", "23"]
            # for i in range(24):
            #     # partition_name = file_name_list[0] + \
            #     #     "_h{0}".format(hour_list[i])
            #     partition_name = file_name_list[0] + \
            #         "_h{0}".format(i)
            #     start_time = "{}-{}-{} {}:00:00".format(year, month, day, i)
            #     end_time = "{}-{}-{} {}:00:00".format(year, month, day, i + 1)
            #     sql_of_create_partitions += sql_of_create_single_partition.format(
            #         partition_name, file_name_list[0], start_time, end_time)
            #     sql_of_create_indices += sql_of_create_single_index.format(
            #         partition_name)
            sql_of_copies += sql_of_single_copy.format(
                file_name_list[0], single_file_path)
            # break
    try:
        connection = psycopg2.connect(user="postgres",
                                      password="StephenHao@3023",
                                      host="127.0.0.1",
                                      port="5432",
                                      database="urban_cross_domain_data"
                                      )
        cursor = connection.cursor()
        start_sql = timeit.default_timer()
        print(sql_of_create_tables)
        cursor.execute(sql_of_create_tables)
        middle1 = timeit.default_timer()
        # cursor.execute(sql_of_create_partitions)
        # middle2 = timeit.default_timer()
        # cursor.execute(sql_of_create_indices)
        # middle3 = timeit.default_timer()
        print('single_create_table_time: ', middle1 - start_sql)
        print(sql_of_copies)
        cursor.execute(sql_of_copies)
        # middle4 = timeit.default_timer()
        # print(sql_of_create_tables + sql_of_create_partitions +
        #                sql_of_create_indices + sql_of_copies)
        end_sql = timeit.default_timer()
        # print('single_create_partitions_time: ', middle2 - middle1)
        # print('single_create_indices_time: ', middle3 - middle2)
        print('single_copies_time: ', end_sql - middle1)
        print('single_total_time: ', end_sql - start_sql)
#         # Print PostgreSQL Connection properties
#         print(connection.get_dsn_parameters(), "\n")
#         # Print PostgreSQL version
#         cursor.execute("SELECT version();")
#         record = cursor.fetchone()
#         print("You are connected to - ", record, "\n")
    except (Exception, psycopg2.Error) as error:
        print("Error while connecting to PostgreSQL: ", error)
    finally:
        # closing database connection.
        if (connection):
            connection.commit()
            cursor.close()
            connection.close()
            print("PostgreSQL connection is closed")


# import_data_to_database_v1() # single_total_time:  9401.715082086059
