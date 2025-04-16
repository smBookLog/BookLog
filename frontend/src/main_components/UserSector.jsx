import React from 'react';
import '../main_style/UserSector.css';

function UserSector({ users }) {
    if (!users || users.length === 0) {
        return (
            <div className="user-sector empty-sector">
                <h3>추천 유저</h3>
                <p className="empty-message">추천 유저가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="user-sector">
            <h3>관심 장르가 비슷한 유저</h3>
            <div className="user-grid">
                {users.map((user, index) => (
                    <div className="user-card" key={`user-${index}`}>
                        <div className="user-avatar">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt={`${user.userName} 프로필`} />
                            ) : (
                                <div className="default-avatar">{user.userName ? user.userName.charAt(0).toUpperCase() : '?'}</div>
                            )}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user.userName || '익명'}</div>
                            {user.genres && user.genres.length > 0 && (
                                <div className="user-genres">
                                    {user.genres.slice(0, 2).map((genre, genreIndex) => (
                                        <span key={`genre-${index}-${genreIndex}`} className="genre-tag">
                                            {genre}
                                        </span>
                                    ))}
                                    {user.genres.length > 2 && <span className="more-genres">+{user.genres.length - 2}</span>}
                                </div>
                            )}
                            <div className="user-stats">
                                <span className="stat-item">독서 {user.bookCount || 0}권</span>
                                <span className="stat-divider">·</span>
                                <span className="stat-item">리뷰 {user.reviewCount || 0}개</span>
                            </div>
                        </div>
                        <button className="follow-button">팔로우</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserSector;