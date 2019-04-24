import os
from tqdm import tqdm


def execute_pg_dump_command_for_hour_data():
	# taxi_track_command_str = "pg_dump\
	# 			   -h localhost\
	# 			   -U postgres\
	# 			   -d urban_cross_domain_data\
	# 			   -t _20140803_taxi_track_{}_{} |\
	# 			   psql -h 10.27.169.227\
	# 			   -U postgres\
	# 			   -d urban_cross_domain_data"
	way_point_command_str = "pg_dump\
				   -h localhost\
				   -U postgres\
				   -d urban_cross_domain_data\
				   -t _20140803_{}_{} |\
				   psql -h 10.27.169.227\
				   -U postgres\
				   -d urban_cross_domain_data"
	for hour in tqdm(range(6, 24)):
		temp_command = way_point_command_str.format(hour, hour + 1)
		os.system(temp_command)
		# break


def execute_pg_dump_command_for_day_data():
	way_point_command_str = "pg_dump\
							   -h localhost\
							   -U postgres\
							   -d urban_cross_domain_data\
							   -t _201408{} |\
							 psql -h 10.27.169.227\
							   -U postgres\
							   -d urban_cross_domain_data"
	day_list = [
				'03', '04', '05', '06',\
				'08', '09', '10', '11',\
				'14', '15', '16', '18',\
				'19', '20', '21', '22',\
				'23', '24', '25', '26',\
				'27', '28', '29', '30'\
    			]
	for day in tqdm(day_list[2:]):
		temp_command = way_point_command_str.format(day)
		# print(temp_command)
		# break
		os.system(temp_command)
		# break


def execute_pg_dump_command_for_poi_data():
	poi_all_info_str = "pg_dump\
								-h localhost\
							   -U postgres\
							   -d urban_cross_domain_data\
							   -t _poi_all_info |\
							 psql -h 10.27.169.227\
							   -U postgres\
							   -d urban_cross_domain_data"
	poi_part_info_str = "pg_dump\
								-h localhost\
							   -U postgres\
							   -d urban_cross_domain_data\
							   -t _poi_part_info |\
							 psql -h 10.27.169.227\
							   -U postgres\
							   -d urban_cross_domain_data"
	os.system(poi_all_info_str)						   						   
	os.system(poi_part_info_str)						   						   

# execute_pg_dump_command_for_hour_data()
# execute_pg_dump_command_for_day_data()
