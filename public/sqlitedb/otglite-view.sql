BEGIN TRANSACTION;
.schema
.header on
.mode column
.width 30,30,50,30
select * from otgdata;
COMMIT;
