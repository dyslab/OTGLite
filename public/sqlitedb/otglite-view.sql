BEGIN TRANSACTION;
.schema
.header on
.mode column
.change on
.width 15 15 25 30
select * from otgdata;
COMMIT;
