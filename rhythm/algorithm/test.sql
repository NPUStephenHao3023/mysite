CREATE TABLE taxi_gps._20140805 ( taxi_id integer, latitude double precision, longitude double precision, passenger boolean, date_time timestamp without time zone ) PARTITION BY RANGE (date_time); CREATE TABLE taxi_gps._20140805_h0 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 0:00:00') TO ('2014-08-05 1:00:00'); CREATE TABLE taxi_gps._20140805_h1 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 1:00:00') TO ('2014-08-05 2:00:00'); CREATE TABLE taxi_gps._20140805_h2 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 2:00:00') TO ('2014-08-05 3:00:00'); CREATE TABLE taxi_gps._20140805_h3 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 3:00:00') TO ('2014-08-05 4:00:00'); CREATE TABLE taxi_gps._20140805_h4 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 4:00:00') TO ('2014-08-05 5:00:00'); CREATE TABLE taxi_gps._20140805_h5 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 5:00:00') TO ('2014-08-05 6:00:00'); CREATE TABLE taxi_gps._20140805_h6 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 6:00:00') TO ('2014-08-05 7:00:00'); CREATE TABLE taxi_gps._20140805_h7 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 7:00:00') TO ('2014-08-05 8:00:00'); CREATE TABLE taxi_gps._20140805_h8 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 8:00:00') TO ('2014-08-05 9:00:00'); CREATE TABLE taxi_gps._20140805_h9 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 9:00:00') TO ('2014-08-05 10:00:00'); CREATE TABLE taxi_gps._20140805_h10 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 10:00:00') TO ('2014-08-05 11:00:00'); CREATE TABLE taxi_gps._20140805_h11 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 11:00:00') TO ('2014-08-05 12:00:00'); CREATE TABLE taxi_gps._20140805_h12 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 12:00:00') TO ('2014-08-05 13:00:00'); CREATE TABLE taxi_gps._20140805_h13 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 13:00:00') TO ('2014-08-05 14:00:00'); CREATE TABLE taxi_gps._20140805_h14 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 14:00:00') TO ('2014-08-05 15:00:00'); CREATE TABLE taxi_gps._20140805_h15 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 15:00:00') TO ('2014-08-05 16:00:00'); CREATE TABLE taxi_gps._20140805_h16 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 16:00:00') TO ('2014-08-05 17:00:00'); CREATE TABLE taxi_gps._20140805_h17 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 17:00:00') TO ('2014-08-05 18:00:00'); CREATE TABLE taxi_gps._20140805_h18 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 18:00:00') TO ('2014-08-05 19:00:00'); CREATE TABLE taxi_gps._20140805_h19 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 19:00:00') TO ('2014-08-05 20:00:00'); CREATE TABLE taxi_gps._20140805_h20 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 20:00:00') TO ('2014-08-05 21:00:00'); CREATE TABLE taxi_gps._20140805_h21 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 21:00:00') TO ('2014-08-05 22:00:00'); CREATE TABLE taxi_gps._20140805_h22 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 22:00:00') TO ('2014-08-05 23:00:00'); CREATE TABLE taxi_gps._20140805_h23 PARTITION OF taxi_gps._20140805 FOR VALUES
FROM ('2014-08-05 23:00:00') TO ('2014-08-05 24:00:00'); CREATE INDEX
    ON taxi_gps._20140805_h0 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h1 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h2 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h3 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h4 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h5 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h6 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h7 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h8 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h9 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h10 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h11 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h12 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h13 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h14 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h15 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h16 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h17 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h18 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h19 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h20 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h21 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h22 (taxi_id); CREATE INDEX
    ON taxi_gps._20140805_h23 (taxi_id); COPY taxi_gps._20140805
FROM 'E:\acer\VSProjects\mysite\rhythm\algorithm\dataset\20140805_train.txt'
WITH DELIMITER ','; 


SELECT origin_latitude, origin_longitude, destination_latitude, destination_longitude
FROM (
	SELECT 
		taxi_id,
		latitude AS origin_latitude, longitude AS origin_longitude, 
		LEAD(latitude, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination_latitude, 
		LEAD(longitude, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination_longitude, 
		origin, LEAD(origin, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination,
		date_time
	FROM (
		SELECT taxi_id, latitude, longitude, (passenger = TRUE) AS origin, date_time
		FROM (
			SELECT *
			FROM (
				SELECT taxi_id, latitude, longitude, passenger, LAG(passenger, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS last_passenger, date_time
					FROM (
					    SELECT *
					    FROM taxi_gps.test_train
					    WHERE date_time >= timestamp '2014-08-03 7:00:00' AND date_time < timestamp '2014-08-03 8:00:00'
					) AS temp
			) AS temp
			WHERE passenger != last_passenger
		) AS temp
	) AS temp
) AS temp
WHERE origin = TRUE AND destination = FALSE;

SELECT origin_latitude, origin_longitude, destination_latitude, destination_longitude                                
FROM (                                 
    SELECT
        taxi_id,                                    
        latitude AS origin_latitude, 
        longitude AS origin_longitude,                                     
        LEAD(latitude, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination_latitude,                                     
        LEAD(longitude, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination_longitude,                                     
        origin, LEAD(origin, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS destination,
        date_time                                
    FROM (                                    
        SELECT taxi_id, latitude, longitude, (passenger = TRUE) AS origin, date_time                                    
        FROM (                                        
            SELECT *                                        
            FROM (             
                SELECT taxi_id, latitude, longitude, passenger, 
                LAG(passenger, 1) OVER (PARTITION BY taxi_id ORDER BY date_time) AS last_passenger, date_time
                FROM  (                                                
                    SELECT *                                                
                    FROM _20140824                                               
                    WHERE date_time >= timestamp '2014-08-24 6:00:00' AND date_time < timestamp '2014-08-24 7:00:00'
                ) AS temp                                        
            ) AS temp                                        
            WHERE passenger != last_passenger
        ) AS temp                                
    ) AS temp                            
) AS temp                            
WHERE origin = TRUE AND destination = FALSE;