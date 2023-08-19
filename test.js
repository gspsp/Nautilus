const { artcleId } = require("./rules")

$('.questionLi').each(function() {
	$(this).find('h3').text(parseInt($(this).find('h3').text()))
	if ($(this).find('.mark_answer>.mark_key>span')[0] !== undefined) {
		$(this).find('.mark_answer>.mark_key>span')[0].remove()
	}
	// mark_fill
	if ($(this).find('.mark_answer>div>.mark_fill')[0] !== undefined) {
		$(this).find('.mark_answer>div>.mark_fill')[0].remove()
	}
	//mark_letter
	if ($(this).find('ul') !== undefined) {
		$(this).find('ul').remove()
	}
	//mark_score
	if ($(this).find('.mark_answer>.mark_score')[0] !== undefined) {
		$(this).find('.mark_answer>.mark_score')[0].remove()
	}
	//analysisDiv
	if ($(this).find('.mark_answer>.analysisDiv')[0] !== undefined) {
		$(this).find('.mark_answer>.analysisDiv')[0].remove()
	}
})


$('.questionLi').each(function() {
	$(this).find('h3')
	if ($(this).find('.mark_answer>.mark_key>span')[0] !== undefined) {
		$(this).find('.mark_answer>.mark_key>span')[0].remove()
	}
	// mark_fill
	if ($(this).find('.mark_answer>div>.mark_fill')[0] !== undefined) {
		$(this).find('.mark_answer>div>.mark_fill')[0].remove()
	}
	//mark_letter
	if ($(this).find('ul') !== undefined) {
		$(this).find('ul').remove()
	}
	//mark_score
	if ($(this).find('.mark_answer>.mark_score')[0] !== undefined) {
		$(this).find('.mark_answer>.mark_score')[0].remove()
	}
})

=====================================
2021-12-30 09:58:17 0x7fcebc66c700 INNODB MONITOR OUTPUT
=====================================
Per second averages calculated from the last 43 seconds
-----------------
BACKGROUND THREAD
-----------------
srv_master_thread loops: 101 srv_active, 0 srv_shutdown, 1585 srv_idle
srv_master_thread log flush and writes: 1686
----------
SEMAPHORES
----------
OS WAIT ARRAY INFO: reservation count 1570
OS WAIT ARRAY INFO: signal count 934
RW-shared spins 0, rounds 1842, OS waits 694
RW-excl spins 0, rounds 528, OS waits 6
RW-sx spins 11, rounds 11, OS waits 0
Spin rounds per wait: 1842.00 RW-shared, 528.00 RW-excl, 1.00 RW-sx
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2021-12-30 09:57:18 0x7fcebc732700 Error in foreign key constraint of table galasp/#sql-1_ea:
 FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE:
Cannot find an index in the referenced table where the
referenced columns appear as the first columns, or column types
in the table and the referenced table do not match for constraint.
Note that the internal storage type of ENUM and SET changed in
tables created with >= InnoDB-4.1.12, and such columns in old tables
cannot be referenced by such columns in new tables.
Please refer to http://dev.mysql.com/doc/refman/5.7/en/innodb-foreign-key-constraints.html for correct foreign key definition.
------------
TRANSACTIONS
------------
Trx id counter 42824
Purge done for trx's n:o < 42824 undo n:o < 0 state: running but idle
History list length 14
LIST OF TRANSACTIONS FOR EACH SESSION:
---TRANSACTION 422001350166368, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
---TRANSACTION 422001350170968, not started
0 lock struct(s), heap size 1136, 0 row lock(s)
--------
FILE I/O
--------
I/O thread 0 state: waiting for completed aio requests (insert buffer thread)
I/O thread 1 state: waiting for completed aio requests (log thread)
I/O thread 2 state: waiting for completed aio requests (read thread)
I/O thread 3 state: waiting for completed aio requests (read thread)
I/O thread 4 state: waiting for completed aio requests (read thread)
I/O thread 5 state: waiting for completed aio requests (read thread)
I/O thread 6 state: waiting for completed aio requests (write thread)
I/O thread 7 state: waiting for completed aio requests (write thread)
I/O thread 8 state: waiting for completed aio requests (write thread)
I/O thread 9 state: waiting for completed aio requests (write thread)
Pending normal aio reads: [0, 0, 0, 0] , aio writes: [0, 0, 0, 0] ,
 ibuf aio reads:, log i/o's:, sync i/o's:
Pending flushes (fsync) log: 0; buffer pool: 0
499 OS file reads, 5185 OS file writes, 1817 OS fsyncs
0.00 reads/s, 0 avg bytes/read, 0.07 writes/s, 0.00 fsyncs/s
-------------------------------------
INSERT BUFFER AND ADAPTIVE HASH INDEX
-------------------------------------
Ibuf: size 1, free list len 0, seg size 2, 0 merges
merged operations:
 insert 0, delete mark 0, delete 0
discarded operations:
 insert 0, delete mark 0, delete 0
Hash table size 34679, node heap has 1 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
Hash table size 34679, node heap has 0 buffer(s)
0.00 hash searches/s, 0.00 non-hash searches/s
---
LOG
---
Log sequence number 18525104
Log flushed up to   18525104
Pages flushed up to 18525104
Last checkpoint at  18525095
0 pending log flushes, 0 pending chkp writes
1200 log i/o's done, 0.00 log i/o's/second
----------------------
BUFFER POOL AND MEMORY
----------------------
Total large memory allocated 137428992
Dictionary memory allocated 203059
Buffer pool size   8192
Free buffers       7304
Database pages     887
Old database pages 307
Modified db pages  0
Pending reads      0
Pending writes: LRU 0, flush list 0, single page 0
Pages made young 0, not young 0
0.00 youngs/s, 0.00 non-youngs/s
Pages read 458, created 429, written 3608
0.00 reads/s, 0.00 creates/s, 0.00 writes/s
Buffer pool hit rate 1000 / 1000, young-making rate 0 / 1000 not 0 / 1000
Pages read ahead 0.00/s, evicted without access 0.00/s, Random read ahead 0.00/s
LRU len: 887, unzip_LRU len: 0
I/O sum[0]:cur[0], unzip sum[0]:cur[0]
--------------
ROW OPERATIONS
--------------
0 queries inside InnoDB, 0 queries in queue
0 read views open inside InnoDB
Process ID=1, Main thread ID=140525936035584, state: sleeping
Number of rows inserted 3753, updated 0, deleted 0, read 3965
0.00 inserts/s, 0.00 updates/s, 0.00 deletes/s, 0.00 reads/s
----------------------------
END OF INNODB MONITOR OUTPUT
============================



for(var i=0;i<15000;i++){
	fetch(`http://localhost:8881/artcles/push?title=1&cover=http://1.com&summary=1`)
}
