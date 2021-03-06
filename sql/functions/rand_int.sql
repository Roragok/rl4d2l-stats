DROP FUNCTION IF EXISTS rand_int;

DELIMITER //

CREATE FUNCTION rand_int(a INT, b INT) RETURNS INT DETERMINISTIC
BEGIN
    RETURN FLOOR(RAND()*(b-a+1))+a;
END //

DELIMITER ;