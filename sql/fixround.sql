DROP TEMPORARY TABLE IF EXISTS badMatchIds;
CREATE TEMPORARY TABLE badMatchIds
-- SELECT a.matchId, MIN(a.round), MAX(a.round), MAX(a.round) - MIN(a.round), COUNT(a.round), COUNT(DISTINCT b.campaign), MAX(b.campaign), MAX(b.round)
SELECT a.matchId
FROM round a JOIN maps b ON a.map = b.map
GROUP BY a.matchId
HAVING COUNT(DISTINCT b.campaign) = 1
AND MAX(a.round) - MIN(a.round) + 1 = MAX(b.round)
AND COUNT(a.round) = 2 * MAX(b.round)
AND MIN(a.round) <> 1;

-- tables to fix: round, infected, survivor, pvp_ff, pvp_infdmg

UPDATE round a
JOIN badMatchIds b ON a.matchId = b.matchId
JOIN maps c ON a.map = c.map
SET a.round = c.round;

UPDATE infected a
JOIN badMatchIds b ON a.matchId = b.matchId
JOIN maps c ON a.map = c.map
SET a.round = c.round;

UPDATE survivor a
JOIN badMatchIds b ON a.matchId = b.matchId
JOIN maps c ON a.map = c.map
SET a.round = c.round;

UPDATE pvp_ff a
JOIN badMatchIds b ON a.matchId = b.matchId
JOIN maps c ON a.map = c.map
SET a.round = c.round;

UPDATE pvp_infdmg a
JOIN badMatchIds b ON a.matchId = b.matchId
JOIN maps c ON a.map = c.map
SET a.round = c.round;

DROP TEMPORARY TABLE IF EXISTS badMatchIds;