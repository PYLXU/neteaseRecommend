const recommendPage = ExtensionFunctions.insertNavigationItem({
    pageId: "recommendPage",
    icon: "F129",
    text: "推荐",
    appendBefore: "searchPage",
});

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
    padding: 50px 27.5px 100px 27.5px;
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
    `);
recommendPage.pageDiv.innerHTML = `
<div class="header">
    <i></i>发现音乐
    <div class="tabLinkContainer">
        <button id="homeTab" class="tablink active">主页</button>
        <button id="rankTab" class="tablink">排行榜</button>
        <button id="listRecommendTab" class="tablink">歌单推荐</button>
        <button id="listSearchTab" class="tablink">歌单搜索</button>
        <button id="mvSearchTab" class="tablink">MV</button>
    </div>
</div><br>
<div id="ncm_recommendPageMain">
    <div id="Home" class="tabcontent" style="display:block">
        <h2><button id="ncm_fastPlay_recommendSong" class="ncm_miniPlayBtn"><i></i></button>每日推荐</h2>
        <div id="ncm_recommendSong">加载中...</div>
        <h2><button id="ncm_fastPlay_newSong" class="ncm_miniPlayBtn"><i></i></button>新歌速递</h2>
        <div id="ncm_newSong">加载中...</div>
    </div>
    <div id="ncm_Rank" class="tabcontent">
        <h2>排行榜</h2>
        <div id="ncm_rankList">加载中...</div>
    </div>
    <div id="ncm_List" class="tabcontent">
        <h2>歌单推荐</h2>
        <div id="ncm_songListRecommend">加载中...</div>
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


recommendPage.navbarDiv.addEventListener("click", (event) => {
    openTab(event, 'Home');
    ncm_getNewSong();
    ncm_getRecommendSong();
});


document.getElementById('homeTab').onclick = function (event) {
    openTab(event, 'Home');
    ncm_getNewSong();
    ncm_getRecommendSong();
};

document.getElementById('rankTab').onclick = function (event) {
    openTab(event, 'ncm_Rank');
    ncm_getRankList();
};

document.getElementById('listRecommendTab').onclick = function (event) {
    openTab(event, 'ncm_List');
    ncm_getsongListRecommend();
};

document.getElementById('listSearchTab').onclick = function (event) {
    openTab(event, 'ncm_ListSearch');
};

document.getElementById('mvSearchTab').onclick = function (event) {
    openTab(event, 'ncm_MVSearch');
};


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

function ncm_loadMusicList(id) {
    let musicList = [];
    let musicListName = null;
    fetch(config.getItem("ext.ncm.apiEndpoint") + `/playlist/detail?id=${encodeURIComponent(id)}`)
        .then(response => response.json())
        .then(data => {
            musicListName = data.playlist.name;
            if (data.playlist && data.playlist.tracks.length > 0) {
                data.playlist.tracks.forEach(song => {
                    musicList.push('ncm:' + song.id);
                });

                renderMusicList(musicList, {
                    uniqueId: "ncm-templist-" + id,
                    errorText: "获取歌单信息失败",
                    menuItems: [DownloadController.getMenuItems()],
                    musicListInfo: { name: musicListName }
                }, false);
            } else {
                alert('获取歌单信息失败');
            }
        });
}

function ncm_loadLikeList() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) == "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/likelist?cookie=` + cookieValue;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            data.ids = data.ids.map(id => 'ncm:' + id);
            renderMusicList(data.ids, {
                uniqueId: "ncm-templist-favorites",
                errorText: "获取歌单信息失败",
                menuItems: [DownloadController.getMenuItems()],
                musicListInfo: { name: '我喜欢的' }
            }, false);
        });
}

function ncm_loadMovie(id, title = '无标题') {
    fetch(config.getItem("ext.ncm.apiEndpoint") + `/mv/url?id=${id}`, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            // openTab(null, 'ncm_vedioPlay');
            webview('https://api.3r60.top/v2/player/?url=' + encodeURIComponent(data.data.url) + '&title=' + encodeURIComponent(title), { width: 1366, height: 768 });
            // document.getElementById('ncm_videoPlayer').setAttribute('src', data.data.url);
            // document.getElementById('ncm_videoTitle').innerHTML = title;
        });
}


function ncm_searchMovie(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/search?type=1004&keywords=${encodeURIComponent(keyword)}`;
    fetch(apiUrl, { headers: ncm_getHeaders() })
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

document.getElementById('ncm_search_mv_form').onsubmit = function (event) {
    event.preventDefault();
    const keyword = document.getElementById('ncm_search_mv_input').value;
    ncm_searchMovie(keyword);
};

function ncm_searchList(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/search?keywords=${encodeURIComponent(keyword)}&type=1000`;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_searchResults_list');
            if (data.result && data.result.playlists.length > 0) {
                let resultsHtml = ``;
                resultsHtml += `<table class='ncm_table'><tr style="height:auto"><th>歌单名称</th><th>创建者</th><th>播放量</th></tr>`;
                data.result.playlists.forEach(playlist => {
                    resultsHtml += `<tr class="playlist-row" data-id="${playlist.id}">`;
                    resultsHtml += `<td>${playlist.name}</td>`;
                    resultsHtml += `<td>${playlist.creator.nickname}</td>`;
                    resultsHtml += `<td>${playlist.playCount}</td>`;
                    resultsHtml += `</tr>`;
                });
                resultsHtml += `</table>`;
                searchResults.innerHTML = resultsHtml;

                document.querySelectorAll('.playlist-row').forEach(row => {
                    row.addEventListener('click', function () {
                        const playlistId = this.getAttribute('data-id');
                        ncm_loadMusicList(playlistId);
                    });

                    row.addEventListener('contextmenu', function (event) {
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

document.getElementById('ncm_search_form').onsubmit = function (event) {
    event.preventDefault();
    const keyword = document.getElementById('ncm_search_input').value;
    ncm_searchList(keyword);
};

function ncm_getsongListRecommend() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/personalized?limit=15`;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_songListRecommend');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                resultsHtml += `<div class="hiddenOver" style="overflow-x: auto;overflow-y: hidden;">`;
                data.result.forEach(songList => {
                    resultsHtml += `
                    <a href="#" class="songListRecommend" data-file="${'ncm:' + songList.id}" data-id="${songList.id}">
                        <button style="padding:0;width:150px;height:195px;margin-right:5px" class="sub" type="submit">
                            <img style="width:100%;height:auto;border-radius:5px" alt="封面" src="${songList.picUrl}" height="35px"/>
                            <br>
                            <span style='height: 45px;display: block;overflow: hidden;'>${songList.name}
                            </span>
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

function ncm_getRankList() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/toplist/detail`;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_rankList');
            if (data && data.list.length > 0) {
                let resultsHtml = "";
                resultsHtml += `<div class="hiddenOver" style="overflow-x: auto;overflow-y: hidden;">`;
                data.list.forEach(songList => {
                    resultsHtml += `
                    <a href="#" class="RankList" data-id="${songList.id}">
                        <button style="padding:0;width:150px;height:180px;margin-right:5px" class="sub" type="submit">
                            <img style="width:100%;height:auto;border-radius:5px" alt="封面" src="${songList.coverImgUrl}" height="35px"/>
                            <br>
                            <span style='height: 45px;display: block;overflow: hidden;'>${songList.name}
                            </span>
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

async function ncm_getNewSong() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/personalized/newsong`;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_newSong');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += `<div class="hiddenOver" style="overflow-x: auto; overflow-y: hidden;">`;

                data.result.forEach(song => {
                    playList += song.id + ",";
                    resultsHtml += `
                    <a href="#" class="newSongLink" data-file="${'ncm:' + playList.id}" data-id="${song.id}">
                        <button style="padding:0; width:150px; height:180px; margin-right:5px;margin-bottom:10px;" class="sub" type="submit">
                            <img style="width:100%; height:auto; border-radius:5px" alt="封面" src="${song.picUrl}?param=150y150" height="35px"/>
                            <br>
                            <span style='height: 20px; display: block; overflow: hidden;'>${song.name}</span>
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
                    // link.addEventListener('contextmenu', function (event) {
                    //     event.preventDefault();
                    //     handleMusicContextmenu(event, [DownloadController.getMenuItems()]);
                    // });
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

async function ncm_getRecommendSong() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) == "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + `/recommend/songs?cookie=` + cookieValue;
    fetch(apiUrl, { headers: ncm_getHeaders() })
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_recommendSong');
            if (data.data && data.data.dailySongs && data.data.dailySongs.length > 0) {
                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += `<div class="hiddenOver" style="overflow-x: auto; overflow-y: hidden;">`;

                data.data.dailySongs.forEach(song => {
                    playList += song.id + ","; // Add song ID to playList
                    resultsHtml += `
                    <a href="#" class="recommendSongLink" data-id="${song.id}">
                        <button style="padding:0; width:150px; height:180px; margin-right:5px;margin-bottom:10px;" class="sub" type="submit">
                            <img style="width:100%; height:auto; border-radius:5px" alt="封面" src="${song.al.picUrl}?param=150y150" height="35px"/>
                            <br>
                            <span style='height: 20px; display: block; overflow: hidden;'>${song.name}</span>
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
                    // link.addEventListener('contextmenu', function (event) {
                    //     event.preventDefault();
                    //     handleMusicContextmenu(event, [DownloadController.getMenuItems()]);
                    // });
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