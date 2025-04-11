SELECT * FROM USER;

SELECT * FROM BOOK;

SELECT * FROM READING_LOG WHERE USER_ID = 'user01' AND STATUS = 'FINISHED';

SELECT * FROM COMMENT WHERE USER_ID = 'user01' AND LOG_IDX = 39;

SELECT * FROM READING_LOG;

SELECT * FROM QUOTE;

-- 1. QUOTE 테이블 비우기
TRUNCATE TABLE QUOTE;

-- 2. READING_LOG_TAG 테이블 비우기
TRUNCATE TABLE READING_LOG_TAG;

-- 3. READING_LOG 테이블 비우기
TRUNCATE TABLE READING_LOG;

-- 4. BOOK 테이블 비우기
TRUNCATE TABLE BOOK;

INSERT INTO USER (USER_ID, USER_PW, NICKNAME, EMAIL)
VALUES 
('user03', 'pw1234', '책덕후', 'user03@example.com');

INSERT INTO BOOK (BOOK_IDX, TITLE, AUTHOR, GENRE, DESCRIPTION, BOOK_IMG, ISBN)
VALUES
(1, '자바의 정석', '남궁성', '프로그래밍', '자바 입문자를 위한 최고의 책', 'img1.jpg', '9788994492032'),
(2, '어린 왕자', '생텍쥐페리', '소설', '감성적인 이야기', 'img2.jpg', '9780156012195'),
(3, '1984', '조지 오웰', '디스토피아', '전체주의 사회의 경고', 'img3.jpg', '9780451524935'),
(4, '클린 코드', '로버트 C. 마틴', '프로그래밍', '좋은 코드를 위한 원칙들', 'img4.jpg', '9780132350884'),
(5, '미드나잇 라이브러리', '매트 헤이그', '소설', '인생의 다양한 가능성', 'img5.jpg', '9780525559474'),
(6, '데미안', '헤르만 헤세', '고전', '자아를 찾아가는 이야기', 'img6.jpg', '9780142437186'),
(7, '죽음에 관하여', '어슐러 르 귄', '에세이', '삶과 죽음을 성찰하는 책', 'img7.jpg', '9780525505600');

INSERT INTO READING_LOG (USER_ID, BOOK_IDX, STATUS, ST_DT, ED_DT, RATING, CONTENT, LIKE_COUNT)
VALUES 
-- FINISHED 책들
('user01', 1, 'FINISHED', '2024-06-01', '2024-06-10', 4.5, '자바 입문에 정말 도움됐어요!', 10),
('user01', 2, 'FINISHED', '2024-05-10', '2024-05-20', 5.0, '감동적인 이야기였어요.', 8),
('user01', 3, 'FINISHED', '2024-03-15', '2024-03-25', 3.5, '중간은 갔어요.', 5),

-- READING 중인 책들
('user01', 4, 'READING', '2024-07-01', NULL, NULL, '지금 읽는 중입니다.', 2),
('user01', 5, 'READING', '2024-07-05', NULL, NULL, '내용이 꽤 흥미로워요.', 4),

-- WISH 리스트
('user01', 6, 'NOT_STARTED', NULL, NULL, NULL, '이 책 꼭 읽어보고 싶어요!', 6),
('user01', 7, 'NOT_STARTED', NULL, NULL, NULL, '리뷰가 좋아서 찜했어요.', 3);


TRUNCATE TABLE READING_LOG;

TRUNCATE TABLE READING_LOG_TAG;
TRUNCATE TABLE TAG;
TRUNCATE TABLE QUOTE;

INSERT INTO TAG (TAG_NAME) VALUES
('감동'),         -- 1
('프로그래밍'),   -- 2
('철학'),         -- 3
('SF'),           -- 4
('고전'),         -- 5
('베스트셀러'),   -- 6
('심리'),         -- 7
('명언'),         -- 8
('개발자추천');   -- 9

INSERT INTO QUOTE (USER_ID, BOOK_IDX, CONTENT) VALUES
('user01', 1, '프로그래밍은 사람과 사람 사이의 커뮤니케이션이다.'),
('user01', 2, '가장 중요한 것은 눈에 보이지 않아.'),
('user01', 3, '자유란 무엇인가에 대해 다시 생각하게 됐다.'),
('user01', 4, '나쁜 코드는 지옥으로 가는 지름길이다.'),
('user01', 5, '한 선택이 모든 것을 바꾼다.'),
('user01', 6, '새는 알을 깨고 나온다. 알은 세계다.'),
('user01', 7, '죽음을 두려워하지 말고 삶을 마주하라.');

SELECT * FROM TAG ORDER BY TAG_IDX;

-- LOG_IDX 38: 자바의 정석
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(38, 33, 'user01'), -- 프로그래밍
(38, 40, 'user01'); -- 개발자추천

-- LOG_IDX 39: 어린 왕자
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(39, 32, 'user01'), -- 감동
(39, 39, 'user01'); -- 명언

-- LOG_IDX 40: 1984
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(40, 35, 'user01'), -- SF
(40, 34, 'user01'); -- 철학

-- LOG_IDX 41: 클린 코드
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(41, 33, 'user01'), -- 프로그래밍
(41, 40, 'user01'); -- 개발자추천

-- LOG_IDX 42: 미드나잇 라이브러리
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(42, 37, 'user01'), -- 베스트셀러
(42, 38, 'user01'); -- 심리

-- LOG_IDX 43: 데미안
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(43, 36, 'user01'), -- 고전
(43, 34, 'user01'); -- 철학

-- LOG_IDX 44: 죽음에 관하여
INSERT INTO READING_LOG_TAG (LOG_IDX, TAG_IDX, USER_ID) VALUES
(44, 34, 'user01'), -- 철학
(44, 39, 'user01'); -- 명언

SELECT Q.CONTENT
FROM QUOTE Q
JOIN READING_LOG RL ON Q.BOOK_IDX = RL.BOOK_IDX
WHERE RL.LOG_IDX = 38
AND Q.USER_ID = RL.USER_ID

SELECT * FROM QUOTE;

SELECT T.TAG_NAME
FROM READING_LOG_TAG RLT
JOIN TAG T ON RLT.TAG_IDX = T.TAG_IDX
WHERE RLT.LOG_IDX = 38

INSERT INTO QUOTE (USER_ID, BOOK_IDX, CONTENT)
VALUES
('user01', 2, '가장 중요한 것은 눈에 보이지 않아.'),
('user01', 2, '길들인다는 건, 관계를 맺는 거야.'),
('user01', 2, '나는 네가 오후 네 시에 온다면 세 시부터 행복해지기 시작할 거야.'),
('user01', 2, '너 자신을 판단하라. 그것이 가장 어려운 일이란다.'),
('user01', 2, '어른들은 숫자를 좋아해.'),
('user01', 2, '장미는 많지만, 너의 장미는 하나뿐이야.'),
('user01', 2, '사막이 아름다운 건 어딘가에 우물이 숨어 있기 때문이야.'),
('user01', 2, '시간을 들여야만 진정으로 알 수 있어.'),
('user01', 2, '네 장미가 그토록 소중한 건 네가 그 장미를 위해 시간을 들였기 때문이야.');

-- 부모 댓글들
INSERT INTO COMMENT (LOG_IDX, USER_ID, CONTENT, PARENT_IDX)
VALUES 
(39, 'user02', '이 책 정말 감명 깊었어요. 추천합니다!', NULL),
(39, 'user03', '저는 조금 지루하게 느꼈어요 😅', NULL),
(39, 'user01', '중간에 나오는 인용구 진짜 인상 깊었어요.', NULL);

-- 대댓글들 (PARENT_IDX = 상위 댓글의 COMMENT_IDX)
-- 먼저 상위 댓글의 COMMENT_IDX 값을 확인하거나, 아래는 예시로 COMMENT_IDX가 1~3이라 가정
INSERT INTO COMMENT (LOG_IDX, USER_ID, CONTENT, PARENT_IDX)
VALUES
(39, 'user01', '맞아요! 저도 감동 받았어요.', 1),
(39, 'user02', 'ㅋㅋ 저도 중간은 좀 지루했어요', 2),
(39, 'user03', '그 인용구 저도 메모해뒀어요.', 3),
(39, 'user02', '혹시 다른 추천책 있으세요?', 3);

TRUNCATE TABLE COMMENT;

SELECT * FROM READING_LOG ORDER BY LOG_IDX DESC;