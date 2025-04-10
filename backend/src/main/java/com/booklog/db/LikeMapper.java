package com.booklog.db;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface LikeMapper {

    // 좋아요 추가
    int insertLike(@Param("logIdx") int logIdx, @Param("userId") String userId);

    // 좋아요 취소
    int deleteLike(@Param("logIdx") int logIdx, @Param("userId") String userId);

    // 좋아요 수 조회
    int countLikes(@Param("logIdx") int logIdx);

    // 유저가 이미 같은 독서기록에 좋아요 눌렀는지 확인 (중복 방지)
    int hasLiked(@Param("logIdx") int logIdx, @Param("userId") String userId);
}
