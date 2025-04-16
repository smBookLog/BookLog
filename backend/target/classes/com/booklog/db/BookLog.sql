SELECT * FROM USER;

SELECT * FROM BOOK;

SELECT * FROM READING_LOG WHERE USER_ID = 'user01' AND STATUS = 'FINISHED';

SELECT * FROM COMMENT WHERE USER_ID = 'user01' AND LOG_IDX = 39;

SELECT * FROM READING_LOG;

DELETE FROM `READING_LOG`
WHERE (`CONTENT` IS NULL OR `CONTENT` = '')
  AND `USER_ID` != 'user05';


SELECT * FROM QUOTE; WHERE USER_ID = 'user05';

DELETE FROM QUOTE
WHERE QUOTE_IDX = 2627;

SELECT * FROM COMMENT;

SELECT * FROM TAG;

SELECT * FROM READING_LOG_TAG;

SELECT * FROM READING_LOG_LIKE;

SELECT * FROM FOLLOW;

SELECT * FROM MESSAGE;

SHOW CREATE TABLE FOLLOW;

SHOW CREATE TABLE READING_LOG;

SHOW CREATE TABLE USER;

SHOW CREATE TABLE QUOTE;

ALTER TABLE READING_LOG
DROP COLUMN LIKE_COUNT;

DELETE FROM QUOTE
WHERE QUOTE_IDX = 26;

DELETE FROM USER
WHERE USER_ID = '';

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
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, RATING, CONTENT, ST_DT, ED_DT, CREATED_AT)
VALUES
('user05', 17, 'FINISHED', 4.5, '역사에 대한 깊이 있는 책. 매우 흥미로웠다.', '2025-01-01', '2025-01-10', '2025-01-10'),  -- 역사
('user05', 21, 'FINISHED', 4.0, '문학적인 요소가 잘 녹아들어 있었다.', '2025-02-01', '2025-02-01', '2025-02-01'),  -- 문학
('user05', 23, 'FINISHED', 4.0, '심리학에 대한 다양한 관점을 배웠다.', '2025-03-01', '2025-03-15', '2025-03-15'),  -- 심리
('user05', 24, 'FINISHED', 5.0, '역사의 흐름을 잘 설명한 책.', '2025-03-01', '2025-03-16', '2025-03-16');  -- 역사 ← 최신

-- user06: 철학 많이 읽음
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, RATING, CONTENT, ST_DT, ED_DT, CREATED_AT)
VALUES
('user06', 18, 'FINISHED', 4.5, '철학적인 질문에 대해 깊이 고민할 수 있는 책이었다.', '2025-01-01', '2025-01-01', '2025-01-01'),  -- 철학
('user06', 22, 'FINISHED', 4.0, '사유의 폭을 확장할 수 있었다.', '2025-02-01', '2025-03-01', '2025-03-01'),  -- 철학
('user06', 25, 'FINISHED', 4.0, '사회에 대한 고찰이 담겨 있는 책.', '2025-03-10', '2025-03-20', '2025-03-20');  -- 사회

-- user07: 심리 장르 주력
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, RATING, CONTENT, ST_DT, ED_DT, CREATED_AT)
VALUES
('user07', 19, 'FINISHED', 4.5, '심리학에 대한 실용적인 팁이 많았다.', '2025-02-01', '2025-02-10', '2025-02-10'),  -- 심리
('user07', 23, 'FINISHED', 4.0, '심리학적인 요소가 매우 잘 드러난 책이었다.', '2025-03-01', '2025-03-01', '2025-03-01'),  -- 심리
('user07', 21, 'FINISHED', 4.0, '문학적인 측면도 뛰어나지만, 심리적 요소가 더 좋았다.', '2025-03-20', '2025-04-01', '2025-04-01');  -- 문학

-- user08: 문학 다수
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, RATING, CONTENT, ST_DT, ED_DT, CREATED_AT)
VALUES
('user08', 17, 'FINISHED', 4.5, '문학적인 아름다움이 돋보이는 책.', '2025-01-01', '2025-01-05', '2025-01-05'),  -- 문학
('user08', 21, 'FINISHED', 4.0, '매우 감동적이고 심오한 내용이었다.', '2025-02-01', '2025-02-15', '2025-02-15'),  -- 문학
('user08', 23, 'FINISHED', 4.0, '심리적 요소가 강하게 느껴졌던 책.', '2025-03-20', '2025-04-01', '2025-04-01');  -- 심리

-- user09: 역사 위주
INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, RATING, CONTENT, ST_DT, ED_DT, CREATED_AT)
VALUES
('user09', 20, 'FINISHED', 4.0, '역사의 흐름을 잘 엮어낸 책이었다.', '2025-01-10', '2025-01-25', '2025-01-25'),  -- 역사
('user09', 24, 'FINISHED', 4.0, '역사적인 배경과 깊이가 매우 좋았다.', '2025-02-05', '2025-02-10', '2025-02-10');  -- 역사


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

-- USER_ID가 'user01'인 독서 기록에 책을 추가하는 쿼리
INSERT INTO `READING_LOG` (`USER_ID`, `BOOK_IDX`, `STATUS`)
VALUES
  ('user01', 58, 'NOT_STARTED'),  -- 책 58번, 상태: 시작하지 않음
  ('user01', 59, 'READING'),      -- 책 59번, 상태: 읽고 있음
  ('user01', 60, 'FINISHED'),     -- 책 60번, 상태: 완료됨
  ('user01', 61, 'NOT_STARTED'),  -- 책 61번, 상태: 시작하지 않음
  ('user01', 62, 'READING'),      -- 책 62번, 상태: 읽고 있음
  ('user01', 63, 'FINISHED'),     -- 책 63번, 상태: 완료됨
  ('user01', 64, 'NOT_STARTED');  -- 책 64번, 상태: 시작하지 않음

INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, ST_DT, ED_DT, RATING, CONTENT)
VALUES 
('user05', 63, 'FINISHED', '2024-01-10', '2024-01-15', 4.5, '책의 구조와 주제 모두 인상 깊었다. 다시 읽고 싶은 책이다.'),
('user05', 64, 'FINISHED', '2024-02-01', '2024-02-10', 4.0, '등장인물들의 감정선이 섬세하게 그려져 있었다.'),
('user05', 65, 'READING', '2024-02-15', '2024-02-25', 3.5, '초반은 지루했지만, 후반부가 몰입감 있었다.'),
('user05', 66, 'FINISHED', '2024-03-01', '2024-03-08', 5.0, '개인적으로 인생 책이다. 감동적이고 통찰이 넘쳤다.'),
('user05', 67, 'READING', '2024-03-15', '2024-03-20', 4.2, '생각할 거리를 많이 던져주는 책이었다.'),
('user05', 68, 'NOT_STARTED', '2024-04-01', '2024-04-07', 4.7, '짧지만 임팩트 있는 문장들이 가득했다.');

SELECT Q.CONTENT
FROM QUOTE Q
JOIN (
SELECT BOOK_IDX
FROM QUOTE
WHERE USER_ID = 'user05'
ORDER BY QUOTE_IDX DESC
LIMIT 1
) AS LATEST_BOOK ON Q.BOOK_IDX = LATEST_BOOK.BOOK_IDX
WHERE Q.USER_ID = 'user05'
ORDER BY Q.QUOTE_IDX DESC;



  SELECT Q.CONTENT
  FROM QUOTE Q
  WHERE Q.USER_ID = 'user01'
AND Q.BOOK_IDX = (
  SELECT BOOK_IDX
  FROM QUOTE
  WHERE USER_ID = 'user01'
      ORDER BY QUOTE_IDX DESC
      LIMIT 1
    )
  ORDER BY Q.QUOTE_IDX DESC

INSERT INTO QUOTE (USER_ID, BOOK_IDX, CONTENT, LOG_IDX)
VALUES
-- BOOK 63, LOG 126
('user05', 63, '무언가를 진심으로 원할 때, 온 우주는 그것을 이루기 위해 도와준다.', 126),
('user05', 63, '삶의 모든 순간에는 이유가 있다.', 126),

-- BOOK 64, LOG 127
('user05', 64, '사랑은 항상 옳은 방향으로 이끈다.', 127),

-- BOOK 65, LOG 128 (READING)
('user05', 65, '천천히 읽을수록 더 깊이 이해하게 된다.', 128),

-- BOOK 66, LOG 129
('user05', 66, '행복은 순간순간을 알아차리는 능력이다.', 129),
('user05', 66, '자신을 잃지 않는 것이 인생 최고의 기술이다.', 129),

-- BOOK 67, LOG 130 (READING) — 다량 추가
('user05', 67, '생각하는 힘이 그 사람의 삶을 바꾼다.', 130),
('user05', 67, '질문이 많을수록 배움도 깊어진다.', 130),
('user05', 67, '매일 조금씩 쌓인 생각이 결국 사람을 만든다.', 130),
('user05', 67, '자기 자신에게 솔직해지는 순간, 삶은 달라진다.', 130),
('user05', 67, '말보다 행동이 진심을 증명한다.', 130);

INSERT INTO QUOTE (USER_ID, BOOK_IDX, CONTENT, LOG_IDX)
VALUES
('user05', 65, '교통사고는 순간이지만, 법적 책임은 평생을 따라온다.', 128),
('user05', 65, '사고가 나기 전, 법을 아는 것이 진짜 대비다.', 128),
('user05', 65, '보험은 선택이 아니라 필수다. 준비된 자만이 보호받는다.', 128),
('user05', 65, '합의는 감정이 아니라 기준으로 판단해야 한다.', 128),
('user05', 65, '무지로 인한 손해는 결국 스스로 감당해야 한다.', 128),
('user05', 65, '운전대만 잡는다고 도로 위의 주인이 되는 것은 아니다.', 128),
('user05', 65, '피해자든 가해자든, 법은 증거를 따른다.', 128);
