const recommendPage = ExtensionFunctions.insertNavigationItem({
    pageId: "recommendPage",
    icon: "F129",
    text: "发现",
    appendBefore: "searchPage",
});

// 插入样式
ExtensionFunctions.insertStyle(`
    
#recommendPage .tabLinkContainer {
    background: transparent;
    margin-left: 15px;
}

#recommendPage .tablink {
    margin: 0 2px;
    cursor: pointer;
    background: none;
    color: black;
}

#recommendPage .tablink:hover {
    color: #1391efb5;
}

#recommendPage .tablink.active {
    color: #0092ff;
}

#recommendPage .tabcontent {
    display: none;
}


#recommendPage #ncm_search_form, #ncm_search_mv_form {
    margin-top: 10px;
    display: flex;
    white-space: nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

#recommendPage #ncm_recommendPageMain {
    position: absolute;
    z-index: 1;
    padding: 50px 27.5px 115px 27.5px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}

#recommendPage .ncm_miniPlayBtn {
    padding: 0 10px;
    font-size: 22px;
    margin-right: 10px;
    height: 33px
}

#recommendPage .ncm_table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

#recommendPage .ncm_table th {
    font-weight: normal;
    text-align: left;
    opacity: .5;
    font-size: .9em;
    padding: 5px 0;
    transition: opacity .2s;
}

#recommendPage .ncm_table tr {
    height: 45px;
}

#recommendPage .ncm_table tr:hover {
    background-color: rgba(0,0,0,.05);
}

#recommendPage #ncm_search_btn, #ncm_search_mv_btn {
    height: 37px;
    font-size: 1.05em;
    margin-left:5px;
}

/* 添加卡片容器样式 */
.ncm-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    justify-content: space-between;
}

.ncm-card-container .card {
    display: flex;
    flex-direction: column;
    padding: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 5px;
    overflow: hidden;
}

.ncm-card-container .card img {
    width: 100%;
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.ncm-card-container .card span {
    width: 100%;
    height: 45px;
    display: block;
    overflow: hidden;
    padding: 5px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
}
    `);

// 初始化页面内容
recommendPage.pageDiv.innerHTML = `
<div class="header">
    <i></i>发现音乐
    <div class="tabLinkContainer">
        <button id="homeTab" class="tablink active">主页</button>
<!--        <button id="specialTab" class="tablink">专属定制</button>-->
        <button id="rankTab" class="tablink">排行榜</button>
        <button id="listSearchTab" class="tablink">歌单搜索</button>
        <button id="mvSearchTab" class="tablink">MV</button>
    </div>
</div><br>
<div id="ncm_recommendPageMain">
    <div id="Home" class="tabcontent" style="display: block;max-width: 1200px;margin-left: auto;margin-right: auto;margin-top: 30px;">
        <h2 id="ncm_welcomeWords" style="margin-bottom: 0"></h2>
        <p id="ncm_welcomeWordsSub">美好的一天从音乐开始</p>
        <div style="display:flex; gap: 20px;">
            <div style="width: 50%;">
                <button id="ncm_dailyRecommendation" class="sub" style="
                    height: auto;
                    border-radius: 5px;
                    padding: 10px;
                    width: 100%;
                    text-align: left;
                ">
                    <div style="display: flex; align-items: center;">
                        <img id="ncm_dailyCover" src="" alt="每日推荐封面" style="
                            width: 80px;
                            height: 80px;
                            border-radius: 5px;
                            margin-right: 15px;
                            object-fit: cover;
                        ">
                        <div>
                            <h3 style="margin: 0;">每日歌曲推荐</h3>
                            <span>今日限定好歌推荐</span>
                        </div>
                    </div>
                </button>
            </div>
                        <div style="width: 50%;">
                <button id="ncm_personalRadar" class="sub" style="
                    height: auto;
                    border-radius: 5px;
                    padding: 10px;
                    width: 100%;
                    text-align: left;
                ">
                    <div style="display: flex; align-items: center;">
                        <img id="ncm_personalRadarCover" src="" alt="私人雷达封面" style="
                            width: 80px;
                            height: 80px;
                            border-radius: 5px;
                            margin-right: 15px;
                            object-fit: cover;
                        ">
                        <div>
                            <h3 style="margin: 0;">我的私人雷达</h3>
                            <span>根据听歌记录为你打造</span>
                        </div>
                    </div>
                </button>
            </div>
            <div style="width: 50%;">
                <button id="ncm_favoriteSongs" class="sub" style="
                    height: auto;
                    border-radius: 5px;
                    padding: 10px;
                    width: 100%;
                    text-align: left;
                ">
                    <div style="display: flex; align-items: center;">
                        <img id="ncm_favoriteCover" src="" alt="喜欢的音乐封面" style="
                            width: 80px;
                            height: 80px;
                            border-radius: 5px;
                            margin-right: 15px;
                            object-fit: cover;
                        ">
                        <div>
                            <h3 style="margin: 0;">我喜欢的音乐</h3>
                            <span>发现你独特的音乐口味</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
<!--        <h2><button id="ncm_fastPlay_recommendSong" class="ncm_miniPlayBtn"><i></i></button>每日推荐</h2>-->
<!--        <div id="ncm_recommendSong">加载中...</div>-->
        <h2>歌单推荐</h2>
        <div id="ncm_songListRecommend">加载中...</div>
        <h2><button id="ncm_fastPlay_newSong" class="ncm_miniPlayBtn"><i></i></button>新歌速递</h2>
        <div id="ncm_newSong">加载中...</div>
    </div>
    <div id="ncm_Rank" class="tabcontent">
        <h2>排行榜</h2>
        <div id="ncm_rankList">加载中...</div>
    </div>
    <div id="ncm_ListSearch" class="tabcontent">
        <form class="inputGroup" id="ncm_search_form">
            歌单：
            <input id="ncm_search_input" placeholder="输入歌单名称，回车搜索" spellcheck="false">
            <button id="ncm_search_btn"><i></i> 搜索</button>
        </form>
        <div id="ncm_searchResults_list"></div>
    </div>
    <div id="ncm_MVSearch" class="tabcontent">
        <form class="inputGroup" id="ncm_search_mv_form">
            MV：
            <input id="ncm_search_mv_input" placeholder="输入MV名称，回车搜索" spellcheck="false">
            <button id="ncm_search_mv_btn"><i></i> 搜索</button>
        </form>
        <div id="ncm_searchResults_mv_list"></div>
    </div>
    <div id="ncm_vedioPlay" class="tabcontent">
        <h2 id="ncm_videoTitle"></h2>
        <video src="" controls style="display: block;height: 60vh;" id="ncm_videoPlayer"></video>
    </div>
</div>
`
recommendPage.pageDiv.classList.add("page");

////////////////////////////////////////////////////////////////////////////////
// 标签页切换相关功能
////////////////////////////////////////////////////////////////////////////////

// 标签页切换函数
async function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.classList.add("active");
    }
}

// 主页标签点击事件
document.getElementById('homeTab').onclick = function (event) {
    openTab(event, 'Home').then();
    ncm_getNewSong().then();
    ncm_getRecommendCover().then();
    ncm_getFavoriteCover().then(); // 获取喜欢音乐封面
    ncm_getsongListRecommend();
    ncm_loadMusicListCover('3136952023', 'ncm_personalRadarCover')

    // 根据时间设置问候语
    const hour = new Date().getHours();
    // let greeting = "";
    // let greetingSub = "";
    if (hour >= 5 && hour < 9) {
        greeting = "早上好";
        greetingSub = "美好的一天从音乐开始";
    } else if (hour >= 9 && hour < 12) {
        greeting = "上午好";
        greetingSub = "让音乐为上午增添活力";
    } else if (hour >= 12 && hour < 14) {
        greeting = "中午好";
        greetingSub = "午休时光，让音乐伴你放松";
    } else if (hour >= 14 && hour < 18) {
        greeting = "下午好";
        greetingSub = "下午茶时间，音乐与你更配哦";
    } else if (hour >= 18 && hour < 22) {
        greeting = "晚上好";
        greetingSub = "夜幕降临，让音乐温暖你的心";
    } else {
        greeting = "夜深了";
        greetingSub = "夜深人静，让音乐伴你入眠";
    }
    document.getElementById('ncm_welcomeWords').innerHTML = greeting;
    document.getElementById('ncm_welcomeWordsSub').innerHTML = greetingSub;
};

// 排行榜标签点击事件
document.getElementById('rankTab').onclick = function (event) {
    openTab(event, 'ncm_Rank');
    ncm_getRankList();
};

// 歌单推荐标签点击事件
// document.getElementById('listRecommendTab').onclick = function (event) {
//     openTab(event, 'ncm_List');
//
// };

// 歌单搜索标签点击事件
document.getElementById('listSearchTab').onclick = function (event) {
    openTab(event, 'ncm_ListSearch');
};

// MV搜索标签点击事件
document.getElementById('mvSearchTab').onclick = function (event) {
    openTab(event, 'ncm_MVSearch');
};

// 推荐页面导航栏点击事件
recommendPage.navbarDiv.addEventListener("click", () => {
    document.getElementById('homeTab').onclick(undefined);
});

// 每日推荐按钮点击事件 - 直接打开每日推荐歌单
document.getElementById('ncm_dailyRecommendation').addEventListener('click', function () {
    // 通过调用获取每日推荐函数来加载每日推荐歌单
    ncm_loadRecommendList();
});

document.getElementById("ncm_personalRadar").addEventListener("click", function () {
    ncm_loadMusicList('3136952023')
})

// 我喜欢的音乐按钮点击事件 - 直接打开喜欢的音乐歌单
document.getElementById('ncm_favoriteSongs').addEventListener('click', function () {
    // 通过调用加载喜欢列表函数来加载我喜欢的音乐歌单
    ncm_loadLikeList();
});

////////////////////////////////////////////////////////////////////////////////
// 音乐播放相关功能
////////////////////////////////////////////////////////////////////////////////

// 请求切换音乐
function ncm_requestMusicChange(ids, cleanList = false) {
    var musicIds = ids.toString().split(',').map(id => id.trim());
    var targetMusic = musicIds.map(id => 'ncm:' + id);

    function updateCallback() {
        var playList = cleanList ? [] : config.getItem("playList") || [];
        if (!Array.isArray(playList)) {
            playList = [];
        }
        targetMusic.forEach(song => {
            if (playList.indexOf(song) === -1) {
                playList.push(song);
            }
        });
        PlayerController.switchMusicWithList(targetMusic[0], playList);
    }

    updateMusicIndex(targetMusic, updateCallback);
}

////////////////////////////////////////////////////////////////////////////////
// 歌单相关功能
////////////////////////////////////////////////////////////////////////////////

// 加载歌单详情
function ncm_loadMusicListCover(id, targetElementId) {
    fetch(config.getItem("ext.ncm.apiEndpoint") + `/playlist/detail?id=${encodeURIComponent(id)}`)
        .then(response => response.json())
        .then(data => {
            if (data.playlist && data.playlist.coverImgUrl) {
                let coverImgUrl = data.playlist.coverImgUrl;
                document.getElementById(targetElementId).src = `${coverImgUrl}`;
            }
        })
}

function ncm_loadMusicList(id) {
    let cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    let musicList = [];
    let musicListName = null;
    fetch(config.getItem("ext.ncm.apiEndpoint") + `/playlist/detail?id=${encodeURIComponent(id)}&cookie=${cookieValue}`)
        .then(response => response.json())
        .then(data => {
            musicListName = data.playlist.name;
            if (data.playlist && data.playlist.tracks.length > 0) {
                data.playlist.tracks.forEach(song => {
                    musicList.push('ncm:' + song.id);
                });
                ncm_renderMusicList(id, musicList, musicListName)

            } else {
                alert('获取歌单信息失败');
            }
        });
}

function ncm_renderMusicList(id, musicList, musicListName) {
    renderMusicList(musicList, {
        uniqueId: "ncm-templist-" + id,
        errorText: "获取歌单信息失败",
        menuItems: [DownloadController.getMenuItems()],
        musicListInfo: {name: musicListName}
    }, false);
}

// 加载喜欢的歌曲列表
function ncm_loadLikeList() {
    let cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/likelist?cookie=` + cookieValue;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            data.ids = data.ids.map(id => 'ncm:' + id);
            ncm_renderMusicList('favorites', data.ids, '我喜欢的音乐')
        });
}

function ncm_loadRecommendList() {
    let cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/recommend/songs?cookie=` + cookieValue;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            let playList = [];
            data.data.dailySongs.forEach(song => {
                playList.push('ncm:' + song.id);
            });
            // data.ids = data.data.dailySongs.ids.map(id => 'ncm:' + id);
            ncm_renderMusicList('dailyRecommend', playList, '每日推荐')
        });
}

// 获取喜欢的音乐封面
async function ncm_getFavoriteCover() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/likelist?cookie=` + cookieValue;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            if (data.ids && data.ids.length > 0) {
                // 获取第一首歌曲的详细信息以获得封面
                const firstSongId = data.ids[0];
                fetch(config.getItem("ext.ncm.apiEndpoint") + `/song/detail?ids=${firstSongId}`, {headers: ncm_getHeaders()})
                    .then(response => response.json())
                    .then(songData => {
                        if (songData.songs && songData.songs.length > 0 && songData.songs[0].al && songData.songs[0].al.picUrl) {
                            document.getElementById('ncm_favoriteCover').src = songData.songs[0].al.picUrl + '?param=150y150';
                        }
                    });
            }
        });
}

async function ncm_getRecommendCover() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/recommend/songs?cookie=` + cookieValue;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            // const searchResults = document.getElementById('ncm_recommendSong');
            // if (data.data && data.data.dailySongs && data.data.dailySongs.length > 0) {
            // 设置每日推荐的封面 - 修复位置
            if (data.data.dailySongs.length > 0 && data.data.dailySongs[0].al && data.data.dailySongs[0].al.picUrl) {
                document.getElementById('ncm_dailyCover').src = data.data.dailySongs[0].al.picUrl + '?param=150y150';
                // return;
            }


            // let resultsHtml = "";
            // let playList = ""; // Initialize playList variable
            // resultsHtml += `<div class="hiddenOver" style="overflow-x: auto; overflow-y: hidden;">`;
            //
            // data.data.dailySongs.forEach(song => {
            //     playList += song.id + ","; // Add song ID to playList
            //     resultsHtml += `
            //     <a href="#" class="recommendSongLink" data-id="${song.id}">
            //         <button style="padding:0; width:150px; height:180px; margin-right:5px;margin-bottom:10px;" class="sub" type="submit">
            //             <img style="width:100%; height:auto; border-radius:5px" alt="封面" src="${song.al.picUrl}?param=150y150" height="35px"/>
            //             <br>
            //             <span style='height: 20px; display: block; overflow: hidden;'>${song.name}</span>
            //         </button>
            //     </a>`;
            // });
            //
            // resultsHtml += `</div>`;
            // searchResults.innerHTML = resultsHtml;
            //
            // if (playList.endsWith(',')) {
            //     playList = playList.slice(0, -1);
            // }
            //
            // document.getElementById('ncm_fastPlay_recommendSong').setAttribute('data-playlist', playList);
            //
            // document.querySelectorAll('.recommendSongLink').forEach(link => {
            //     link.addEventListener('click', function (event) {
            //         event.preventDefault();
            //         const songId = this.getAttribute('data-id');
            //         ncm_requestMusicChange(songId);
            //     });
            // });
            //
            // document.getElementById('ncm_fastPlay_recommendSong').addEventListener('click', function () {
            //     const playList = this.getAttribute('data-playlist');
            //     ncm_requestMusicChange(playList, true);
            // });
            // } else {
            //     searchResults.innerHTML = `获取失败：` + data.msg;
            // }
        })
        .catch(error => console.error('Error:', error));
}

async function ncm_getRecommendSong() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) === "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/recommend/songs?cookie=` + cookieValue;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_recommendSong');
            if (data.data && data.data.dailySongs && data.data.dailySongs.length > 0) {
                // 设置每日推荐的封面 - 修复位置
                if (data.data.dailySongs.length > 0 && data.data.dailySongs[0].al && data.data.dailySongs[0].al.picUrl) {
                    document.getElementById('ncm_dailyCover').src = data.data.dailySongs[0].al.picUrl + '?param=150y150';
                }

                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += `<div class="ncm-card-container">`;

                data.data.dailySongs.forEach(song => {
                    playList += song.id + ","; // Add song ID to playList
                    resultsHtml += `
                    <a href="#" class="recommendSongLink" data-id="${song.id}">
                        <button class="card sub" type="submit">
                            <img alt="封面" src="${song.al.picUrl}?param=150y150"/>
                            <span>${song.name}</span>
                        </button>
                    </a>`;
                });

                resultsHtml += `</div>`;
                searchResults.innerHTML = resultsHtml;

                if (playList.endsWith(',')) {
                    playList = playList.slice(0, -1);
                }

                document.getElementById('ncm_fastPlay_recommendSong').setAttribute('data-playlist', playList);

                document.querySelectorAll('.recommendSongLink').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const songId = this.getAttribute('data-id');
                        ncm_requestMusicChange(songId);
                    });
                });

                document.getElementById('ncm_fastPlay_recommendSong').addEventListener('click', function () {
                    const playList = this.getAttribute('data-playlist');
                    ncm_requestMusicChange(playList, true);
                });
            } else {
                searchResults.innerHTML = `获取失败：` + data.msg;
            }
        })
        .catch(error => console.error('Error:', error));
}


function ncm_getRankList() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/toplist/detail`;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_rankList');
            if (data && data.list.length > 0) {
                let resultsHtml = "";
                resultsHtml += `<div class="ncm-card-container">`;
                data.list.forEach(songList => {
                    resultsHtml += `
                    <a href="#" class="RankList" data-id="${songList.id}">
                        <button class="card sub" type="submit">
                            <img alt="封面" src="${songList.coverImgUrl}"/>
                            <span>${songList.name}</span>
                        </button>
                    </a>`;
                });
                resultsHtml += `</div>`;
                searchResults.innerHTML = resultsHtml;

                document.querySelectorAll('.RankList').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const songListId = this.getAttribute('data-id');
                        ncm_loadMusicList(songListId);
                    });
                    link.addEventListener('contextmenu', function (event) {
                        event.preventDefault();
                        const playlistId = this.getAttribute('data-id');
                        navigator.clipboard.writeText(playlistId).then(() => {
                            alert(`歌单ID ${playlistId} 已复制到剪贴板`);
                        });
                    });
                });
            } else {
                searchResults.innerHTML = `获取失败`;
            }
        });
}

function ncm_getsongListRecommend() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/personalized?limit=7`;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_songListRecommend');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                resultsHtml += `<div class="ncm-card-container">`;
                data.result.forEach(songList => {
                    resultsHtml += `
                    <a href="#" class="songListRecommend" data-file="${'ncm:' + songList.id}" data-id="${songList.id}">
                        <button class="card sub" type="submit">
                            <img alt="封面" src="${songList.picUrl}"/>
                            <span>${songList.name}</span>
                        </button>
                    </a>`;
                });
                resultsHtml += `</div>`;
                searchResults.innerHTML = resultsHtml;

                document.querySelectorAll('.songListRecommend').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const songListId = this.getAttribute('data-id');
                        ncm_loadMusicList(songListId);
                    });
                    link.addEventListener('contextmenu', function (event) {
                        event.preventDefault();
                        const playlistId = this.getAttribute('data-id');
                        navigator.clipboard.writeText(playlistId).then(() => {
                            alert(`歌单ID ${playlistId} 已复制到剪贴板`);
                        });
                    });
                });
            } else {
                searchResults.innerHTML = `获取失败`;
            }
        });
}

////////////////////////////////////////////////////////////////////////////////
// 歌曲推荐相关功能
////////////////////////////////////////////////////////////////////////////////

// 获取新歌速递
async function ncm_getNewSong() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/personalized/newsong`;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_newSong');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += `<div class="ncm-card-container">`;

                data.result.forEach(song => {
                    playList += song.id + ",";
                    resultsHtml += `
                    <a href="#" class="newSongLink" data-file="${'ncm:' + playList.id}" data-id="${song.id}">
                        <button class="card sub" type="submit">
                            <img alt="封面" src="${song.picUrl}?param=150y150"/>
                            <span>${song.name}</span>
                        </button>
                    </a>`;
                });

                resultsHtml += `</div>`;
                searchResults.innerHTML = resultsHtml;

                if (playList.endsWith(',')) {
                    playList = playList.slice(0, -1);
                }

                document.getElementById('ncm_fastPlay_newSong').setAttribute('data-playlist', playList);

                document.querySelectorAll('.newSongLink').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const songId = this.getAttribute('data-id');
                        ncm_requestMusicChange(songId);
                    });
                });

                document.getElementById('ncm_fastPlay_newSong').addEventListener('click', function () {
                    const playList = this.getAttribute('data-playlist');
                    ncm_requestMusicChange(playList, true);
                });
            } else {
                searchResults.innerHTML = `获取失败` + data.msg;
            }
        })
        .catch(error => console.error('Error:', error));
}

////////////////////////////////////////////////////////////////////////////////
// 搜索相关功能
////////////////////////////////////////////////////////////////////////////////

// 歌单搜索
function ncm_searchList(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/search?keywords=${encodeURIComponent(keyword)}&type=1000`;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_searchResults_list');
            if (data.result && data.result.playlists.length > 0) {
                let resultsHtml = ``;
                resultsHtml += `<div class="ncm-card-container">`;
                data.result.playlists.forEach(playlist => {
                    resultsHtml += `
                    <a href="#" class="playlist-row" data-id="${playlist.id}">
                        <button class="card sub" type="submit">
                            <img alt="封面" src="${playlist.coverImgUrl || playlist.picUrl}"/>
                            <span>${playlist.name}</span>
                        </button>
                    </a>`;
                });
                resultsHtml += `</div>`;
                searchResults.innerHTML = resultsHtml;

                document.querySelectorAll('.playlist-row').forEach(link => {
                    link.addEventListener('click', function (event) {
                        event.preventDefault();
                        const playlistId = this.getAttribute('data-id');
                        // 使用与搜索结果中相同的加载歌单方式
                        ncm_loadMusicList(playlistId);
                    });

                    link.addEventListener('contextmenu', function (event) {
                        event.preventDefault();
                        const playlistId = this.getAttribute('data-id');
                        navigator.clipboard.writeText(playlistId).then(() => {
                            alert(`歌单ID ${playlistId} 已复制到剪贴板`);
                        });
                    });
                });
            } else {
                searchResults.innerHTML = `<p>未找到与 "${keyword}" 相关的结果。</p>`;
            }
        });
}

// 歌单搜索表单提交事件
document.getElementById('ncm_search_form').onsubmit = function (event) {
    event.preventDefault();
    const keyword = document.getElementById('ncm_search_input').value;
    ncm_searchList(keyword);
};

////////////////////////////////////////////////////////////////////////////////
// MV相关功能
////////////////////////////////////////////////////////////////////////////////

// 加载MV
function ncm_loadMovie(id, title = '无标题') {
    fetch(config.getItem("ext.ncm.apiEndpoint") + `/mv/url?id=${id}`, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            // openTab(null, 'ncm_vedioPlay');
            webview('https://api.3r60.top/v2/player/?url=' + encodeURIComponent(data.data.url) + '&title=' + encodeURIComponent(title), {
                width: 1366,
                height: 768
            });
            // document.getElementById('ncm_videoPlayer').setAttribute('src', data.data.url);
            // document.getElementById('ncm_videoTitle').innerHTML = title;
        });
}

// 搜索MV
function ncm_searchMovie(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/search?type=1004&keywords=${encodeURIComponent(keyword)}`;
    fetch(apiUrl, {headers: ncm_getHeaders()})
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_searchResults_mv_list');
            let resultsHtml = "";
            if (data.result && data.result.mvs.length > 0) {
                resultsHtml += `<table class='ncm_table'><tr style="height:auto"><th>视频名称</th><th>艺术家</th><th>播放量</th></tr>`;
                data.result.mvs.forEach(mv => {
                    resultsHtml += `<tr class="mv-row" data-id="${mv.id}" data-name="${mv.name}">`;
                    resultsHtml += `<td>${mv.name}</td>`;
                    resultsHtml += `<td>${mv.artistName}</td>`;
                    resultsHtml += `<td>${mv.playCount}</td>`;
                    resultsHtml += `</tr>`;
                });
                resultsHtml += `</table>`;
                searchResults.innerHTML = resultsHtml;

                document.querySelectorAll('.mv-row').forEach(row => {
                    row.addEventListener('click', function () {
                        const mvId = this.getAttribute('data-id');
                        const mvName = this.getAttribute('data-name');
                        ncm_loadMovie(mvId, mvName);
                    });
                });
            } else {
                searchResults.innerHTML = `<p>未找到与 "${keyword}" 相关的结果。</p>`;
            }
        });
}

// MV搜索表单提交事件
document.getElementById('ncm_search_mv_form').onsubmit = function (event) {
    event.preventDefault();
    const keyword = document.getElementById('ncm_search_mv_input').value;
    ncm_searchMovie(keyword);
};