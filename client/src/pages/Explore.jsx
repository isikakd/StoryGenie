import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Explore.css';

function CommunityStoryCard({ story, onRate, onLike, onFavorite, isFavorited, lang }) {
  const [liked, setLiked]         = useState(story.isLikedByMe || false);
  const [likeCount, setLikeCount] = useState(story.likeCount || story.communityRatings?.length || 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited || false);

  const chars       = story.options?.characters || [];
  const location    = story.options?.location;
  const locationFile = location?.imagePath?.split('/').pop() || '';

  const cleanMd = (text = '') =>
    text
      .replace(/^#{1,6}\s*/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
      .trim();

  const date = new Date(story.createdAt).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  const getBadge = () => {
    const days = Math.floor((Date.now() - new Date(story.createdAt).getTime()) / 86400000);
    if (days <= 3)                           return { label: lang === 'tr' ? '⭐ Yeni' : '⭐ New', cls: 'badge--new' };
    if (story.viewCount > 200)               return { label: lang === 'tr' ? '📖 Çok Okunan' : '📖 Popular', cls: 'badge--read' };
    if (story.communityAverageRating >= 4)   return null;
    if (likeCount > 30)                      return { label: lang === 'tr' ? '🔥 Popüler' : '🔥 Trending', cls: 'badge--popular' };
    return null;
  };
  const badge = getBadge();

  const handleLike = async () => {
    if (story.isAnonymized || likeLoading) return;
    const prev = liked;
    const next = !liked;
    setLikeLoading(true);
    setLiked(next);
    setLikeCount(c => next ? c + 1 : c - 1);
    const result = await onLike(story._id);
    setLikeLoading(false);
    if (result?.likeCount !== undefined) {
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    } else {
      setLiked(prev);
      setLikeCount(c => next ? c - 1 : c + 1);
    }
  };

  const handleFavorite = async (e) => {
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next);
    await onFavorite(story._id, next);
  };

  const durationLabel = (d) => {
    if (d === 'short') return lang === 'tr' ? 'Kısa' : 'Short';
    if (d === 'long')  return lang === 'tr' ? 'Uzun' : 'Long';
    return lang === 'tr' ? 'Orta' : 'Medium';
  };

  return (
    <div className="ec-card animate-fadeIn">
      <div className="ec-cover">
        {locationFile && (
          <div className="ec-cover-bg"
            style={{ backgroundImage: `url('/assets/locations/${locationFile}')` }} />
        )}
        <div className="ec-cover-chars" style={{ '--char-count': chars.length || 1 }}>
          {chars.map((c, i) => {
            const file = c.imagePath?.split('/').pop() || '';
            return (
              <div key={i} className="ec-cover-char">
                <img src={`/assets/characters/${file}`} alt={c.name || ''}
                  onError={e => { e.target.style.display = 'none'; }}
                  style={{ height: `calc(120px + (4 - ${chars.length || 1}) * 10px)`, maxHeight: '90%' }} />
              </div>
            );
          })}
        </div>
        {badge && <span className={`ec-badge ${badge.cls}`}>{badge.label}</span>}
      </div>

      <div className="ec-body">
        <div className="ec-date">📅 {date}</div>

        <div className="ec-author-row">
          <div className="ec-avatar" style={{ background: story.isAnonymized ? '#9b9b9b' : (story.author?.avatarBg || 'rgb(10,15,60)') }}>
            {story.isAnonymized
              ? <span style={{fontSize:'1.1rem',lineHeight:1}}>👤</span>
              : story.author?.avatar && story.author.avatar.length > 0
                ? story.author.avatar.startsWith('/')
                  ? <img src={story.author.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                  : <span style={{fontSize:'1rem',lineHeight:1}}>{story.author.avatar}</span>
                : <span>{story.author?.username?.[0]?.toUpperCase() || '?'}</span>}
          </div>
          <span className="ec-username">{story.isAnonymized ? 'Anonim' : story.author?.username}</span>
        </div>

        <h3 className="ec-title">{cleanMd(story.title)}</h3>

        {/* Karakter chip'leri */}
        {chars.length > 0 && (
          <div className="ec-chip-row">
            {chars.map((c, i) => {
              const file = c.imagePath?.split('/').pop() || '';
              return (
                <div key={i} className="ec-chip">
                  <img src={`/assets/characters/${file}`} alt={c.name || ''}
                    onError={e => { e.target.style.display = 'none'; }} />
                  <span>{c.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Mekan chip'i */}
        {location?.name && (
          <div className="ec-chip-row">
            <div className="ec-chip ec-chip--loc">
              <span>📍</span>
              <span>{location.name}</span>
            </div>
          </div>
        )}

        {/* Spacer — meta + footer her zaman altta */}
        <div className="ec-spacer" />

        <div className="ec-meta-row">
          {story.options?.childAge && (
            <span className="ec-meta">{story.options.childAge <= 4 ? '🍼' : story.options.childAge <= 7 ? '🧒' : '👦'} {lang === 'tr' ? story.options.childAge + ' yaş' : 'Age ' + story.options.childAge}</span>
          )}
          {story.options?.duration && (
            <span className="ec-meta">⏳ {durationLabel(story.options.duration)}</span>
          )}
          {story.viewCount > 0 && (
            <span className="ec-meta">👁 {story.viewCount}</span>
          )}
        </div>

        <div className="ec-footer">
          <button className="ec-heart-btn" onClick={handleLike}
            disabled={story.isAnonymized || likeLoading}
            title={story.isAnonymized ? 'Anonim masallar beğenilemez' : undefined}>
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likeCount}</span>
          </button>
          {onFavorite && (
            <button className={`ec-fav-btn${favorited ? ' ec-fav-btn--active' : ''}`}
              onClick={handleFavorite}
              title={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}>
              {favorited ? '⭐' : '☆'}
            </button>
          )}
          <button className="ec-read-btn" onClick={() => onRate(story._id, 0, true)}>
            📖 {lang === 'tr' ? 'Oku' : 'Read'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Explore() {
  const { t, lang } = useLang();
  const { user }    = useAuth();
  const navigate    = useNavigate();

  const [stories, setStories]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favoriteIds, setFavoriteIds]       = useState(new Set());
  const [showFavorites, setShowFavorites]   = useState(false);
  const [favoriteStories, setFavoriteStories] = useState([]);
  const [favLoading, setFavLoading]         = useState(false);

  // Sıralama + Filtreler
  const [sortBy, setSortBy]         = useState('new');      // new | liked | mostRead
  const [filterAge, setFilterAge]   = useState('');
  const [filterLang, setFilterLang] = useState('');
  const [showFilters, setShowFilters]     = useState(false);
  const [showSort, setShowSort]           = useState(false);
  const [filterDuration, setFilterDuration] = useState('');
  const sortRef   = useRef(null);
  const filterRef = useRef(null);

  // Dropdown dışına tıklanınca kapat
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current   && !sortRef.current.contains(e.target))   setShowSort(false);
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilters(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchStories = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      let url = `/stories/explore?page=${p}&limit=12`;
      if (sortBy)        url += `&sort=${sortBy}`;
      if (filterAge)     url += `&ageGroup=${filterAge}`;
      if (filterLang)    url += `&language=${filterLang}`;
      if (filterDuration) url += `&duration=${filterDuration}`;
      const res = await api.get(url);
      let data = res.data.stories;

      setStories(data);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [sortBy, filterAge, filterLang, filterDuration]);

  useEffect(() => { fetchStories(page); }, [page, fetchStories]);

  useEffect(() => {
    if (!user) return;
    api.get('/favorites?limit=50').then(res => {
      const ids = new Set(res.data.stories.map(s => s._id));
      setFavoriteIds(ids);
    }).catch(err => { console.error('[Explore] Favoriler yüklenemedi:', err.message); });
  }, [user]);

  const handleFavorite = async (id, add) => {
    try {
      if (add) {
        await api.post(`/favorites/${id}`);
        setFavoriteIds(prev => new Set([...prev, id]));
      } else {
        await api.delete(`/favorites/${id}`);
        setFavoriteIds(prev => { const next = new Set(prev); next.delete(id); return next; });
      }
    } catch (e) { console.error('[Explore] Favori güncelleme hatası:', e.message); }
  };

  const handleToggleFavorites = async () => {
    if (showFavorites) {
      setShowFavorites(false);
      return;
    }
    setShowFavorites(true);
    setFavLoading(true);
    try {
      const res = await api.get('/favorites?limit=50');
      setFavoriteStories(res.data.stories);
      // favoriteIds'i de güncelle
      setFavoriteIds(new Set(res.data.stories.map(s => s._id)));
    } catch (e) {
      setFavoriteStories([]);
    } finally {
      setFavLoading(false);
    }
  };

  const handleRate = async (id, rating, read = false) => {
    if (read) { navigate(`/story/${id}`); return; }
    if (!user) { navigate('/login'); return; }
    try { await api.post(`/stories/${id}/community-rating`, { rating }); } catch (e) { console.error('[Explore] Puanlama hatası:', e.message); }
  };

  const handleLike = async (id) => {
    if (!user) { navigate('/login'); return; }
    try {
      const res = await api.post(`/stories/${id}/like`);
      return res.data;
    } catch (e) { console.error('[Explore] Beğeni hatası:', e.message); return null; }
  };

  // sortBy 'all' iken sıralama yok
  const sortOptions = [
    { key: 'new',      label: lang === 'tr' ? 'En Yeni' : 'Newest' },
    { key: 'liked',    label: lang === 'tr' ? 'En Beğenilen' : 'Most Liked' },
    { key: 'mostRead', label: lang === 'tr' ? 'En Çok Okunan' : 'Most Read' },
  ];

  return (
    <div className="explore-page">
      <div className="container">

        <div className="exp-header animate-fadeIn">
          <p className="exp-subtitle">{t.explore?.subtitle || 'Topluluktan masallar'}</p>
        </div>

        {/* Toolbar */}
        <div className="exp-toolbar animate-fadeIn">
          <div className="exp-toolbar-left">
            {/* Tümü */}
            <button className={`exp-tab ${!showFavorites ? 'active' : ''}`}
              onClick={() => { setSortBy('new'); setFilterAge(''); setFilterLang(''); setFilterDuration(''); setPage(1); setShowFavorites(false); }}>
              {lang === 'tr' ? 'Tümü' : 'All'}
              <span className="exp-tab-count">{stories.length}</span>
            </button>

            {/* Favoriler filtre butonu — sadece giriş yapmış kullanıcılara */}
            {user && (
              <button
                className={`exp-tab exp-tab--fav${showFavorites ? ' active' : ''}`}
                onClick={handleToggleFavorites}>
                ⭐ {lang === 'tr' ? 'Favoriler' : 'Favorites'}
                {favoriteIds.size > 0 && <span className="exp-tab-count">{favoriteIds.size}</span>}
              </button>
            )}

            {/* Sırala */}
            <div className="exp-dropdown-wrap" ref={sortRef}>
              <button className={`exp-tab ${sortBy !== 'new' ? 'active' : ''}`}
                onClick={() => { setShowSort(s => !s); setShowFilters(false); }}>
                ↕ {lang === 'tr' ? 'Sırala' : 'Sort'}
                <span className="exp-active-label"> · {sortOptions.find(o => o.key === sortBy)?.label}</span>
              </button>
              {showSort && (
                <div className="exp-dropdown exp-dropdown--right">
                  {sortOptions.map(opt => (
                    <button key={opt.key}
                      className={`exp-dropdown-item ${sortBy === opt.key ? 'active' : ''}`}
                      onClick={() => { setSortBy(opt.key); setShowSort(false); setPage(1); }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filtrele */}
            <div className="exp-dropdown-wrap" ref={filterRef}>
              <button className={`exp-tab ${filterAge || filterLang || filterDuration ? 'active' : ''}`}
                onClick={() => { setShowFilters(s => !s); setShowSort(false); }}>
                 {lang === 'tr' ? 'Filtrele' : 'Filter'}
                {(filterAge || filterLang || filterDuration) && <span className="exp-filter-dot" />}
              </button>
              {showFilters && (
                <div className="exp-dropdown exp-dropdown--filter exp-dropdown--right">
                  {/* Yaş */}
                  <div className="exp-dropdown-group">
                    <span className="exp-dropdown-label">{lang === 'tr' ? 'Yaş' : 'Age'}</span>
                    <div className="exp-dropdown-row">
                      {['2-3','4-5','6-7','8-9','10+'].map((l,i) => {
                        const vals = ['3','5','7','9','11'];
                        return (
                          <button key={l} className={`exp-filter-btn ${filterAge===vals[i]?'active':''}`}
                            onClick={()=>{setFilterAge(filterAge===vals[i]?'':vals[i]);setPage(1);}}>
                            {l}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Süre */}
                  <div className="exp-dropdown-group">
                    <span className="exp-dropdown-label">{lang === 'tr' ? 'Süre' : 'Duration'}</span>
                    <div className="exp-dropdown-row">
                      {[
                        {v:'short', l:lang==='tr'?'Kısa':'Short'},
                        {v:'medium',l:lang==='tr'?'Orta':'Medium'},
                        {v:'long',  l:lang==='tr'?'Uzun':'Long'},
                      ].map(({v,l})=>(
                        <button key={v} className={`exp-filter-btn ${filterDuration===v?'active':''}`}
                          onClick={()=>{setFilterDuration(filterDuration===v?'':v);setPage(1);}}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Dil */}
                  <div className="exp-dropdown-group">
                    <span className="exp-dropdown-label">{lang === 'tr' ? 'Dil' : 'Language'}</span>
                    <div className="exp-dropdown-row">
                      <button className={`exp-filter-btn ${filterLang==='tr'?'active':''}`}
                        onClick={()=>{setFilterLang(filterLang==='tr'?'':'tr');setPage(1);}}>🇹🇷 TR</button>
                      <button className={`exp-filter-btn ${filterLang==='en'?'active':''}`}
                        onClick={()=>{setFilterLang(filterLang==='en'?'':'en');setPage(1);}}>🇬🇧 EN</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Hikaye Paylaş — sağda */}
          {user && (
            <button className="exp-share-btn" onClick={() => navigate('/')}>
              + {lang === 'tr' ? 'Masal Paylaş' : 'Share Story'}
            </button>
          )}
        </div>

        {/* Normal yüklenme / hata */}
        {(loading || favLoading) && <div className="exp-loading"><div className="spinner" /></div>}
        {error && !loading && !showFavorites && <div className="exp-error">{error}</div>}

        {/* Favori modu — boş durum */}
        {showFavorites && !favLoading && favoriteStories.length === 0 && (
          <div className="exp-empty animate-fadeIn">
            <div className="exp-empty-icon">☆</div>
            <h3>{lang === 'tr' ? 'Henüz favori yok' : 'No favorites yet'}</h3>
            <p>{lang === 'tr'
              ? 'Henüz başka yazarlardan favoriye eklediğin bir masal yok. Masal kartlarındaki yıldız ikonuna basarak favorilere ekleyebilirsin.'
              : "You haven't saved any stories yet. Tap the star icon on a story card to add it to favorites."}</p>
          </div>
        )}

        {/* Favori modu — liste */}
        {showFavorites && !favLoading && favoriteStories.length > 0 && (
          <div className="exp-grid">
            {favoriteStories.map(story => (
              <CommunityStoryCard
                key={story._id} story={story}
                onRate={handleRate}
                onLike={handleLike}
                onFavorite={handleFavorite}
                isFavorited={true}
                lang={lang}
              />
            ))}
          </div>
        )}

        {/* Normal mod — boş durum */}
        {!showFavorites && !loading && stories.length === 0 && (
          <div className="exp-empty animate-fadeIn">
            <div className="exp-empty-icon">🌟</div>
            <h3>{t.explore?.empty || 'Henüz masal yok'}</h3>
            <p>{lang === 'tr' ? 'Henüz paylaşılan masal yok. İlk paylaşan sen ol!' : 'No shared stories yet. Be the first!'}</p>
            {user && (
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                ✨ {lang === 'tr' ? 'Masal Oluştur' : 'Create Story'}
              </button>
            )}
          </div>
        )}

        {/* Normal mod — liste */}
        {!showFavorites && !loading && stories.length > 0 && (
          <div className="exp-grid">
            {stories.map(story => (
              <CommunityStoryCard
                key={story._id} story={story}
                onRate={handleRate}
                onLike={handleLike}
                onFavorite={user ? handleFavorite : null}
                isFavorited={favoriteIds.has(story._id)}
                lang={lang}
              />
            ))}
          </div>
        )}

        {/* Sayfalama — favori modunda gizli */}
        {!showFavorites && totalPages > 1 && (
          <div className="exp-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p}
                className={`page-btn ${p === page ? 'active' : ''}`}
                onClick={() => setPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}