PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS otgdata(bookid var(50), pageid var(50), text text, updatetime text default current_timestamp, primary key(bookid, pageid));
INSERT INTO otgdata(bookid, pageid, text) VALUES('测试1','287测试10','ddyyy好dd');
INSERT INTO otgdata(bookid, pageid, text) VALUES('测试2','287测试22','dcccc看wwd');
INSERT INTO otgdata(bookid, pageid, text) VALUES('测试3','ass测试1322','dc223cccwwd');
COMMIT;
