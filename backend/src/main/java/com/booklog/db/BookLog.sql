SELECT * FROM USER;

SELECT * FROM BOOK;

SELECT * FROM READING_LOG WHERE USER_ID = 'user01' AND STATUS = 'FINISHED';

SELECT * FROM COMMENT WHERE USER_ID = 'user01' AND LOG_IDX = 39;

SELECT * FROM READING_LOG;

SELECT * FROM QUOTE;

SELECT * FROM COMMENT;

SELECT * FROM TAG;

SELECT * FROM READING_LOG_TAG;

SELECT * FROM READING_LOG_LIKE;

SELECT * FROM FOLLOW;

SELECT * FROM MESSAGE;

SHOW CREATE TABLE FOLLOW;

SHOW CREATE TABLE READING_LOG;

ALTER TABLE READING_LOG
DROP COLUMN LIKE_COUNT;

DELETE FROM QUOTE
WHERE QUOTE_IDX = 26;

DELETE FROM USER
WHERE USER_ID = 'user05' OR USER_ID = 'user04';

ALTER TABLE READING_LOG DROP CHECK CK_RATING;

-- CK_RATING 제약조건 추후 수정 필요 
ALTER TABLE READING_LOG
ADD CONSTRAINT CK_RATING CHECK (
    RATING IS NULL OR (RATING >= 0 AND RATING <= 5.0)
);

SHOW COLUMNS FROM READING_LOG LIKE 'RATING';

SHOW CREATE TABLE QUOTE;

-- USER 테이블에 NAME 컬럼 추가
ALTER TABLE USER
ADD COLUMN NAME VARCHAR(50) NOT NULL AFTER USER_ID;

-- 1. QUOTE 테이블 비우기
TRUNCATE TABLE QUOTE;

-- 2. READING_LOG_TAG 테이블 비우기
TRUNCATE TABLE READING_LOG_TAG;

-- 3. READING_LOG 테이블 비우기
TRUNCATE TABLE READING_LOG;

-- 4. BOOK 테이블 비우기
TRUNCATE TABLE BOOK;

TRUNCATE TABLE TAG;

TRUNCATE TABLE COMMENT;

TRUNCATE TABLE FOLLOW;

SELECT Q.CONTENT
FROM QUOTE Q
JOIN (
    SELECT BOOK_IDX
    FROM QUOTE
    WHERE USER_ID = 'user01'
    ORDER BY QUOTE_IDX DESC
    LIMIT 1
) AS LATEST_BOOK ON Q.BOOK_IDX = LATEST_BOOK.BOOK_IDX
WHERE Q.USER_ID = 'user01'
ORDER BY Q.QUOTE_IDX DESC;

-- 유니크 제약 조건 추가
ADD CONSTRAINT `UNIQUE_CONTENT` UNIQUE (`USER_ID`, `BOOK_IDX`, `CONTENT`);

ALTER TABLE `QUOTE`
ADD CONSTRAINT `UNIQUE_CONTENT` UNIQUE (`CONTENT`);


INSERT INTO `QUOTE` (`USER_ID`, `BOOK_IDX`, `CONTENT`) VALUES
('1', 2, 'You become responsible, forever, for what you have tamed.'),
('1', 2, 'All grown-ups were once children... but only a few of them remember it.'),
('1', 2, 'The most beautiful things in the world cannot be seen or touched, they are felt with the heart.'),

ALTER TABLE `QUOTE`
MODIFY `CONTENT` TEXT NOT NULL;

INSERT INTO `USER` (USER_ID, NAME, USER_PW, NICKNAME, EMAIL)
VALUES
('user05', '윤봉길', 'pw5', '봉길이', 'user05@test.com'),
('user06', '박지성', 'pw6', '지성이', 'user06@test.com'),
('user07', '김연아', 'pw7', '연아', 'user07@test.com'),
('user08', '손흥민', 'pw8', '흥민이', 'user08@test.com'),
('user09', '이동국', 'pw9', '국이', 'user09@test.com');

INSERT INTO `BOOK` (ISBN, TITLE, AUTHOR, GENRE)
VALUES
('isbn008', '문학의이해', '작가1', '문학'),
('isbn009', '철학입문', '작가2', '철학'),
('isbn010', '감정의기술', '작가3', '심리'),
('isbn011', '세계사', '작가4', '역사'),
('isbn012', '현대소설', '작가5', '문학'),
('isbn013', '고대철학', '작가6', '철학'),
('isbn014', '감성에대하여', '작가7', '심리'),
('isbn015', '전쟁사', '작가8', '역사'),
('isbn016', '미래사회', '작가9', '사회');

-- user05: 최근에 '역사', 가장 많이 읽은 장르는 '문학'
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, CREATED_AT)
VALUES
('user05', 17, 'FINISHED', '2025-01-10'),  -- 역사
('user05', 21, 'FINISHED', '2025-02-01'),  -- 문학
('user05', 23, 'FINISHED', '2025-03-15'),  -- 심리
('user05', 24, 'FINISHED', '2025-03-16');  -- 역사 ← 최신

-- user06: 철학 많이 읽음
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, CREATED_AT)
VALUES
('user06', 18, 'FINISHED', '2025-01-01'),  -- 철학
('user06', 22, 'FINISHED', '2025-03-01'),  -- 철학
('user06', 25, 'FINISHED', '2025-03-20');  -- 사회

-- user07: 심리 장르 주력
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, CREATED_AT)
VALUES
('user07', 19, 'FINISHED', '2025-02-10'),  -- 심리
('user07', 23, 'FINISHED', '2025-03-01'),  -- 심리
('user07', 21, 'FINISHED', '2025-04-01');  -- 문학

-- user08: 문학 다수
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, CREATED_AT)
VALUES
('user08', 17, 'FINISHED', '2025-01-05'),  -- 문학
('user08', 21, 'FINISHED', '2025-02-15'),  -- 문학
('user08', 23, 'FINISHED', '2025-04-01');  -- 심리

-- user09: 역사 위주
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, CREATED_AT)
VALUES
('user09', 20, 'FINISHED', '2025-01-25'),  -- 역사
('user09', 24, 'FINISHED', '2025-02-10');  -- 역사

INSERT INTO FOLLOW (FOLLOWER_ID, FOLLOWING_ID)
VALUES
('user05', 'user06'),
('user05', 'user07'),
('user05', 'user08');


SELECT * FROM BOOK;
		
SELECT
RL.USER_ID AS userId,
U.NICKNAME AS nickname,
B.GENRE AS genre,
COUNT(*) AS genreCount,
U.PROFILE_IMG AS profileImg
FROM READING_LOG RL
JOIN BOOK B ON RL.BOOK_IDX = B.BOOK_IDX
JOIN USER U ON RL.USER_ID = U.USER_ID
WHERE B.GENRE = '역사'
AND RL.USER_ID != 'user05'
AND RL.USER_ID NOT IN (
SELECT FOLLOWING_ID FROM FOLLOW WHERE FOLLOWER_ID = 'user05'
)
GROUP BY RL.USER_ID
ORDER BY genreCount DESC
LIMIT 5;
