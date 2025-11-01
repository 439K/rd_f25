// ===== script.js の新しい全内容 =====

// --- 楽曲データベース ---
const allMusicData = [
    // 439K
    { title: 'OrKstra No.3 "Link"', file: 'src/audio/Link.mp3', artist: '439K', category: 'A', volume: 1.0, jacket: 'src/images/jacket/Link.png' },
    { title: 'Throw Three', file: 'src/audio/Throw Three.mp3', artist: '439K', category: 'B', volume: 1.0, jacket: 'src/images/jacket/ThrowThree.png' },
    { title: 'Darts Night', file: 'src/audio/Darts Night.mp3', artist: '439K', category: 'B', volume: 1.0, jacket: 'src/images/jacket/DartsNight.png' },
    // 昊
    { title: 'LittleAngel', file: 'src/audio/LittleAngel.mp3', artist: '昊', category: 'B', volume: 1.0, jacket: 'src/images/jacket/LittleAngel.png' },
    { title: 'みな底の光都', file: 'src/audio/みな底の光都.mp3', artist: '昊', category: 'B', volume: 1.0, jacket: 'src/images/jacket/みな底の光都.png' },
    { title: 'Oasis', file: 'src/audio/Oasis.mp3', artist: '昊', category: 'B', volume: 1.0, jacket: 'src/images/jacket/Oasis.png' },
    // あっしー
    { title: 'Packaged Remix', file: 'src/audio/Packaged Remix.wav', artist: 'あっしー', category: 'B', volume: 0.5, jacket: 'src/images/jacket/Packaged Remix.png' },
    // しゅうへい
    { title: '霧', file: 'src/audio/霧.mp3', artist: 'しゅうへい', category: 'A', volume: 0.7, jacket: 'src/images/jacket/霧.png' },
    { title: 'まったりティータイム', file: 'src/audio/まったりティータイム.mp3', artist: 'しゅうへい', category: 'B', volume: 0.7, jacket: 'src/images/jacket/まったりティータイム.png' },
    // 灘
    { title: 'nanika', file: 'src/audio/nanika.wav', artist: '灘', category: 'B', volume: 1.0, jacket: 'src/images/jacket/rd.png' },
    // よつや
    { title: '（準備中）', file: 'src/audio/.mp3', artist: 'よつや', category: 'B', volume: 1.0, jacket: 'src/images/jacket/rd.png' },
    // SynaPse
    { title: 'Ready Go!', file: 'src/audio/Ready Go!.wav', artist: 'SynaPse', category: 'B', volume: 0.5, jacket: 'src/images/jacket/rd.png' },
    // 界潜
    { title: '細雪', file: 'src/audio/細雪.wav', artist: '界潜', category: 'B', volume: 0.4, jacket: 'src/images/jacket/細雪.png' }
];

// --- ★★★ 新規追加：プロフィールデータベース ★★★ ---
const allProfileData = [
    {
        name: '439K',
        img: 'src/images/439K.jpg',
        desc: 'オーケストラやサウンドトラックが好きです',
        sns: [
            { type: 'youtube', url: 'https://www.youtube.com/@439_K', width: 60 },
            { type: 'soundcloud', url: 'https://soundcloud.com/439k', width: 55 }
        ]
    },
    {
        name: '昊',
        img: 'src/images/昊.png',
        desc: 'ゲーム制作のためにいろいろものを作っています<br>IGC²でゲームの展示、INIAD Artworksで絵の展示をしています<br>学部2年',
        sns: [
            { type: 'youtube', url: 'https://www.youtube.com/@miz_oasis', width: 60 },
            { type: 'x', url: 'https://x.com/miz_oasis', width: 35 }
        ]
    },
    {
        name: 'あっしー',
        img: 'src/images/あっしー.png',
        desc: 'midoroって名前で曲を投稿しています',
        sns: [
            { type: 'niconico', url: 'https://www.nicovideo.jp/user/83059937/video?redirected=1', width: 75 }
        ]
    },
    {
        name: 'しゅうへい',
        img: 'src/images/しゅうへい.jpeg',
        desc: 'INIAD9期生(1年生)<br>ボカロだけでなくインスト曲もよく作ります！',
        sns: []
    },
    {
        name: '灘',
        img: 'src/images/Raison_icon.png',
        desc: '',
        sns: []
    },
    {
        name: 'よつや',
        img: 'src/images/Raison_icon.png', // デフォルトアイコン
        desc: '',
        sns: []
    },
    {
        name: 'SynaPse',
        img: 'src/images/Raison_icon.png',
        desc: '',
        sns: []
    },
    {
        name: '界潜',
        img: 'src/images/界潜.png',
        desc: '曲を作っています。',
        sns: []
    }
];
// SNSアイコンのパス定義
const snsIconPaths = {
    youtube: 'src/logo/youtube.png',
    soundcloud: 'src/logo/soundcloud.png',
    instagram: 'src/logo/instagram.png',
    web: 'src/logo/web.png',
    x: 'src/logo/x.png',
    niconico: 'src/logo/niconico.png'
};

// --- 初期設定 (変更) ---
let audio = new Audio();
let isRepeating = false;
let currentPlaylist = []; // ★ ランダム再生用のプレイリスト
let currentTrackIndex = 0;
let isThemeShufflePlaying = false; // ★ ランダム再生中フラグ

const playButton = document.getElementById('play-button');
const repeatButton = document.getElementById('repeat-button');
const seekBar = document.getElementById('seek-bar');
const currentTimeElement = document.querySelector('.current-time');
const totalTimeElement = document.querySelector('.total-time');
const footerSongTitleElement = document.querySelector('.footer-song-title');
const songArtistElement = document.querySelector('.song-artist');

// 初期状態のフッター
footerSongTitleElement.textContent = '未選択';
songArtistElement.textContent = '楽曲を選択してください';

// --- シャッフル関数 (Fisher-Yates) ---
function shuffleArray(array) {
    let newArray = [...array]; // 元の配列をコピー
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// --- ★ 楽曲アイテムのHTML(DOM)を生成する関数 (変更) ---
function createMusicItem(music) {
    const jacketStyle = music.jacket
        ? `style="background-image: url('${music.jacket.replace(/'/g, "\\'")
        .replace(/"/g, '\\"')}');"`
        : ''; 

    const placeholderHTML = !music.jacket
        ? '<span class="jacket-placeholder"></span>'
        : '';

    const itemHTML = `
        <div class="music-item" data-artist="${music.artist}" data-category="${music.category}">
            <div class="jacket-container" ${jacketStyle}>
                ${placeholderHTML}
            </div>
            <p class="song-title">${music.title}</p>
            <p class="song-artist-credit">by ${music.artist}</p>
            <button class="music-button">再生</button>
            <audio controls hidden="true" data-volume="${music.volume || 1.0}">
                <source src="${music.file}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        </div>
    `;
    const template = document.createElement('template');
    template.innerHTML = itemHTML.trim();
    return template.content.firstChild;
}

// --- ★★★ 新規追加：プロフィールアイテムのHTML(DOM)を生成する関数 ★★★ ---
function createProfileItem(profile) {
    const snsLinks = profile.sns.map(link => `
        <a href="${link.url}" target="_new" rel="noopener noreferrer">
            <img src="${snsIconPaths[link.type]}" alt="${link.type}" width="${link.width}">
        </a>
    `).join('');

    const itemHTML = `
        <div class="profile-item-new">
            <div class="profile-new">
                <img src="${profile.img}" alt="${profile.name} Profile Image">
                <div class="profile-details-new">
                    <h1>${profile.name}</h1>
                    <p>${profile.desc}</p>
                </div>
            </div>
            <div class="sns-new">
                ${snsLinks}
            </div>
        </div>
    `;
    const template = document.createElement('template');
    template.innerHTML = itemHTML.trim();
    return template.content.firstChild;
}


// --- ページ読み込み時の処理 (変更) ---
document.addEventListener('DOMContentLoaded', () => {
    // === 1. 楽曲リストの生成 ===
    const musicContainer = document.querySelector('#music-segment .music-list-theme');
    // 楽曲リストはシャッフルして表示
    const shuffledMusic = shuffleArray(allMusicData);
    shuffledMusic.forEach(music => {
        musicContainer.appendChild(createMusicItem(music));
    });

    // === 2. プロフィールリストの生成 ===
    const profileContainer = document.querySelector('#profile-segment .profile-list-new');
    // プロフィールリストもシャッフルして表示
    const shuffledProfiles = shuffleArray(allProfileData);
    shuffledProfiles.forEach(profile => {
        profileContainer.appendChild(createProfileItem(profile));
    });

    // === 3. イベントリスナーの設定 ===
    initializeMusicButtons(); // 個別再生ボタン
    initializeRandomPlayButtons(); // ★ ランダム再生ボタン
    initializeHeaders(); // ★ 開閉ヘッダー

    // モバイル表示 (900px未満) の場合、セグメントを最初から最小化しておく
    if (window.innerWidth < 900) {
        document.querySelectorAll('.theme-segment').forEach(segment => {
            segment.classList.add('minimized');
        });
    }
});

// --- ★ 再生ロジックを共通関数化 (修正) ---
function activateSong(songData, isRandom = false) {
    // 他のボタンの状態をリセット
    document.querySelectorAll('.music-button').forEach(btn => {
        btn.textContent = btn.classList.contains('random-play-button') ? 'ランダム再生' : '再生';
        btn.classList.remove('playing');
        btn.style.background = ''; // CSSのスタイルに戻す
    });

    let targetItemButton = null; // ★ プログレスバーを表示する対象のボタン

    // 1. 実際に再生する曲のボタンを探す
    document.querySelectorAll('#music-segment .music-item').forEach(item => {
        const title = item.querySelector('.song-title').textContent;
        const artist = item.dataset.artist;
        if (title === songData.title && artist === songData.artist) {
            targetItemButton = item.querySelector('.music-button');
        }
    });

    if (isRandom) {
        // ★ ランダム再生の場合
        // 1. ランダム再生ボタンの見た目を「再生中」にする
        const randomPlayButton = document.getElementById('main-random-play');
        if (randomPlayButton) {
            randomPlayButton.textContent = '再生中（他の楽曲を再生）';
            randomPlayButton.classList.add('playing'); 
        }
    }

    if (targetItemButton) {
        // ★ 対象の曲のボタン（個別ボタン）の見た目を更新
        targetItemButton.textContent = '再生中';
        targetItemButton.classList.add('playing'); 
        targetItemButton.style.background = '#4a69bd';
    }
    
    // オーディオファイルを新しいものに変更
    audio.src = songData.file;
    audio.load();

    // フッターの曲タイトルとアーティストを更新
    footerSongTitleElement.textContent = songData.title;
    songArtistElement.textContent = songData.artist;

    // 曲の音量を設定
    audio.addEventListener('loadeddata', () => {
        const songVolume = parseFloat(songData.volume) || 1.0;
        audio.volume = songVolume;
        audio.play();
    }, { once: true });

    // 再生時間やシークバーの初期化
    audio.addEventListener('loadedmetadata', () => {
        totalTimeElement.textContent = formatTime(audio.duration);
        seekBar.max = Math.floor(audio.duration);
    }, { once: true });

    playButton.querySelector('img').src = 'src/bar/pause.png';
}


// --- 再生ボタンのイベントリスナーを設定する関数 (修正) ---
function initializeMusicButtons() {
    document.querySelectorAll('#music-segment .music-item').forEach(item => {
        const button = item.querySelector('.music-button');
        
        button.addEventListener('click', function () {
            // 再生中の曲を押した場合の処理
            if (button.classList.contains('playing')) {
                if (!audio.paused) {
                    audio.pause();
                    button.textContent = '一時停止中';
                    playButton.querySelector('img').src = 'src/bar/play.png';
                    
                    // ★ ランダム再生ボタンが再生中だった場合、それも連動
                    const randomPlayButton = document.getElementById('main-random-play');
                    if (randomPlayButton && randomPlayButton.classList.contains('playing')) {
                        randomPlayButton.textContent = '一時停止中（他の楽曲を再生）';
                    }
                } else {
                    audio.play();
                    button.textContent = '再生中';
                    playButton.querySelector('img').src = 'src/bar/pause.png';
                    
                    // ★ ランダム再生ボタンが再生中だった場合、それも連動
                    const randomPlayButton = document.getElementById('main-random-play');
                    if (randomPlayButton && randomPlayButton.classList.contains('playing')) {
                        randomPlayButton.textContent = '再生中';
                    }
                }
                return;
            }

            // ★ ランダム再生中だった場合は解除
            isThemeShufflePlaying = false;
            currentPlaylist = [];
            // ★ ランダム再生ボタンの .playing も解除
            const randomPlayButton = document.getElementById('main-random-play');
            if (randomPlayButton) {
                randomPlayButton.classList.remove('playing');
                randomPlayButton.textContent = 'ランダム再生';
            }

            // 曲データを取得して再生
            const songTitle = item.querySelector('.song-title').textContent;
            const songData = allMusicData.find(m => 
                m.title === songTitle && 
                m.artist === item.dataset.artist
            );
            
            if (songData) {
                activateSong(songData, false); // isRandom = false
            }
        });
    });
}

// --- ★ ランダム再生ボタンのロジック (修正) ---
function initializeRandomPlayButtons() {
    const randomPlayButton = document.getElementById('main-random-play');
    if (!randomPlayButton) return;

    randomPlayButton.addEventListener('click', function() {
        startThemePlay(allMusicData, this);
    });
}

// ★ ランダム再生の開始・制御 (修正)
// ★★★ 修正点 ★★★
// ボタンを押すたびに曲が切り替わる（スキップする）ように変更
function startThemePlay(musicList, buttonElement) {
    
    if (isThemeShufflePlaying) {
        // ★ 既にランダム再生モードの場合 (再生中/一時停止中問わず)
        // ★ ボタンを押すたびに次の曲へ (スキップ機能)
        currentTrackIndex++;
        if (currentTrackIndex >= currentPlaylist.length) {
            currentTrackIndex = 0; // リストの最後に達したら最初に戻る
        }
    } else {
        // ★ 新規のランダム再生
        isThemeShufflePlaying = true;
        currentPlaylist = shuffleArray(musicList); // リストをシャッフル
        currentTrackIndex = 0;
    }
    
    // ★ 選択された曲を再生
    const songData = currentPlaylist[currentTrackIndex];
    activateSong(songData, true); // isRandom = true
}

// --- ★ 開閉ヘッダーのロジック (変更) ---
function initializeHeaders() {
    document.querySelectorAll('.theme-header').forEach(header => {
        header.addEventListener('click', () => {
            // 900px未満（モバイル）の時のみ動作
            if (window.innerWidth < 900) {
                header.closest('.theme-segment').classList.toggle('minimized');
            }
        });
    });

    // リサイズ時にPC表示になったら強制的に開く
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 900) {
            document.querySelectorAll('.theme-segment.minimized').forEach(segment => {
                segment.classList.remove('minimized');
            });
        }
    });
}


// --- プレーヤーの制御 (変更) ---

// 再生バーの時間更新処理 (修正)
audio.addEventListener('timeupdate', () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentTimeElement.textContent = formatTime(audio.currentTime);

    // ★★★ 修正点 ★★★
    // .playing クラスを持つボタンのうち、個別アイテムのボタン（＝プログレスバー対象）を探す
    const playingItemButton = document.querySelector('.music-item .music-button.playing');

    if (playingItemButton) {
        // ★ 個別再生ボタン（ランダム再生で再生中の曲も含む）の時だけプログレスバーを表示
        const progress = (audio.currentTime / audio.duration) * 100;
        playingItemButton.style.background = `linear-gradient(to right, #4a69bd ${progress}%, #cccccc ${progress}%)`;
    }
});

// 曲が終了したときの処理 (修正)
audio.addEventListener('ended', () => {
    if (isRepeating) {
        // 1. リピートモード
        audio.currentTime = 0;
        audio.play();
    } else if (isThemeShufflePlaying) {
        // 2. ランダム再生中
        currentTrackIndex++;
        if (currentTrackIndex >= currentPlaylist.length) {
            currentTrackIndex = 0; // リストの最後に達したら最初に戻る
        }
        const nextSongData = currentPlaylist[currentTrackIndex];
        activateSong(nextSongData, true); // isRandom = true

    } else {
        // 3. 通常再生終了
        playButton.querySelector('img').src = 'src/bar/play.png';
        // ★ リセット対象を .playing クラスを持つ全てのボタンに変更
        document.querySelectorAll('.music-button.playing').forEach(playingButton => {
            if (playingButton) {
                playingButton.textContent = playingButton.classList.contains('random-play-button') ? 'ランダム再生' : '再生';
                playingButton.style.background = ''; // CSSのスタイルに戻す
                playingButton.classList.remove('playing');
            }
        });
    }
});

// シークバーを操作したときの処理
seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
});

// 再生ボタンの制御 (修正)
playButton.addEventListener('click', () => {
    if (audio.src === "") return; // まだ曲が選択されていない場合は何もしない

    if (audio.paused) {
        audio.play();
        playButton.querySelector('img').src = 'src/bar/pause.png';
    } else {
        audio.pause();
        playButton.querySelector('img').src = 'src/bar/play.png';
    }

    // ★ 再生/一時停止に応じてボタンのテキストも変更 (両方のボタンを更新)
    const playingButtons = document.querySelectorAll('.music-button.playing'); // .playing を持つボタン全て
    playingButtons.forEach(playingButton => {
        if (playingButton) {
            if (playingButton.classList.contains('random-play-button')) {
                playingButton.textContent = audio.paused ? '一時停止中' : '再生中';
            } else {
                playingButton.textContent = audio.paused ? '一時停止中' : '再生中';
            }
        }
    });
});

// リピートボタンの制御
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatButton.querySelector('img').src = isRepeating ? 'src/bar/1repeat-on.png' : 'src/bar/1repeat.png';
});

// キーボードショートカット
document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault(); 
        playButton.click(); 
    }
    if (event.code === 'KeyR') {
        repeatButton.click();
    }
});

// 時間フォーマット関数
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}
