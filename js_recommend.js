var scripts = `

function requestMusicChange(ids, cleanList = false) {
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
    var aux = document.createElement("input");
    aux.setAttribute("value", id);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    alert('歌单：' + id + ' 已经复制到剪辑版，请点击左侧“网易云”右侧的添加按钮并粘贴（Ctrl+V）以添加此歌单');
}

function ncm_loadMovie(id, title = '无标题') {
    fetch(config.getItem("ext.ncm.apiEndpoint") + \`/mv/url?id=\${id}\`)
        .then(response => response.json())
        .then(data => {
            openTab(null,'ncm_vedioPlay');
            document.getElementById('ncm_videoPlayer').setAttribute('src',data.data.url);
            document.getElementById('ncm_videoTitle').innerHTML = title;
        });
}


function ncm_searchMovie(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/search?type=1004&keywords=\${encodeURIComponent(keyword)}\`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_searchResults_mv_list');
            let resultsHtml = "";
            if (data.result && data.result.mvs.length > 0) {
                resultsHtml += \`<table class='ncm_table'><tr style="height:auto"><th>视频名称</th><th>艺术家</th><th>播放量</th></tr>\`;
                data.result.mvs.forEach(mv => {
                    resultsHtml += \`<tr onclick="ncm_loadMovie('\${mv.id}','\${mv.name}')">\`;
                    resultsHtml += \`<td>\${mv.name}</td>\`;
                    resultsHtml += \`<td>\${mv.artistName}</td>\`;
                    resultsHtml += \`<td>\${mv.playCount}</td>\`;
                    resultsHtml += \`</tr>\`;
                });
                resultsHtml += \`</table>\`;
                searchResults.innerHTML = resultsHtml;
            } else {
                searchResults.innerHTML = \`<p>未找到与 "\${keyword}" 相关的结果。</p>\`;
            }
        });
}

document.getElementById('ncm_search_mv_form').onsubmit = function (event) {
  event.preventDefault();
  const keyword = document.getElementById('ncm_search_mv_input').value;
  ncm_searchMovie(keyword);
};

function ncm_searchList(keyword) {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/search?keywords=\${encodeURIComponent(keyword)}&type=1000\`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_searchResults_list');
            if (data.result && data.result.playlists.length > 0) {
                let resultsHtml = \`\`;
                resultsHtml += \`<table class='ncm_table'><tr style="height:auto"><th>歌单名称</th><th>创建者</th><th>播放量</th></tr>\`;
                data.result.playlists.forEach(playlist => {
                    resultsHtml += \`<tr onclick="ncm_loadMusicList(\${playlist.id})">\`;
                    resultsHtml += \`<td>\${playlist.name}</td>\`;
                    resultsHtml += \`<td>\${playlist.creator.nickname}</td>\`;
                    resultsHtml += \`<td>\${playlist.playCount}</td>\`;
                    resultsHtml += \`</tr>\`;
                });
                resultsHtml += \`</table>\`;
                searchResults.innerHTML = resultsHtml;
            } else {
                searchResults.innerHTML = \`<p>未找到与 "\${keyword}" 相关的结果。</p>\`;
            }
        });
}

document.getElementById('ncm_search_form').onsubmit = function (event) {
  event.preventDefault();
  const keyword = document.getElementById('ncm_search_input').value;
  ncm_searchList(keyword);
};

function ncm_getsongListRecommend() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/personalized?limit=15\`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_songListRecommend');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                resultsHtml += \`<div class="hiddenOver" style="overflow-x: auto;overflow-y: hidden ;">\`;
                data.result.forEach(songList => {
                    resultsHtml += \`
                    <a href="javascript:ncm_loadMusicList(\${songList.id})" class="hostLink">
                        <button style="padding:0;width:150px;height:195px;margin-right:5px" class="sub" type="submit">
                            <img style="width:100%;height:auto;border-radius:5px" alt="封面" src="\${songList.picUrl}" height="35px"/>
                            <br>
                            <span style='height: 45px;display: block;overflow: hidden;'>\${songList.name}
                            </span>
                        </button>
                    </a>\`;
                });
                resultsHtml += \`</div>\`
                searchResults.innerHTML = resultsHtml;
            } else {
                searchResults.innerHTML = \`获取失败\`;
            }
        });
}

function ncm_getRankList() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/toplist/detail\`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_rankList');
            if (data && data.list.length > 0) {
                let resultsHtml = ""; // Initialize resultsHtml variable
                resultsHtml += \`<div class="hiddenOver" style="overflow-x: auto;overflow-y: hidden;">\`;
                data.list.forEach(songList => {
                    resultsHtml += \`
                    <a href="javascript:ncm_loadMusicList(\${songList.id})" class="hostLink">
                        <button style="padding:0;width:150px;height:180px;margin-right:5px" class="sub" type="submit">
                            <img style="width:100%;height:auto;border-radius:5px" alt="封面" src="\${songList.coverImgUrl}" height="35px"/>
                            <br>
                            <span style='height: 45px;display: block;overflow: hidden;'>\${songList.name}
                            </span>
                        </button>
                    </a>\`;
                });
                resultsHtml += \`</div>\`
                searchResults.innerHTML = resultsHtml;
            } else {
                searchResults.innerHTML = \`获取失败\`;
            }
        });
}

function ncm_getNewSong() {
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/personalized/newsong\`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_newSong');
            if (data && data.result.length > 0) {
                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += \`<div class="hiddenOver" style="overflow-x: auto; overflow-y: hidden;">\`;

                data.result.forEach(song => {
                    playList += song.id + ",";
                    resultsHtml += \`
                    <a href="javascript:requestMusicChange(\${song.id})">
                        <button style="padding:0; width:150px; height:180px; margin-right:5px;margin-bottom:10px;" class="sub" type="submit">
                            <img style="width:100%; height:auto; border-radius:5px" alt="封面" src="\${song.picUrl}?param=150y150" height="35px"/>
                            <br>
                            <span style='height: 20px; display: block; overflow: hidden;'>\${song.name}</span>
                        </button>
                    </a>\`;
                });

                resultsHtml += \`</div>\`;
                searchResults.innerHTML = resultsHtml;

                if (playList.endsWith(',')) {
                    playList = playList.slice(0, -1);
                }

                document.getElementById('ncm_fastPlay_newSong').setAttribute('onclick', \`requestMusicChange("\${playList}", true)\`);
            } else {
                searchResults.innerHTML = \`获取失败\` + data.msg;
            }
        })
        .catch(error => console.error('Error:', error));
}

function ncm_getRecommendSong() {
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
            if (decodeURIComponent(it[0]) == "cookie") {
                cookieValue = decodeURIComponent(it[1]);
            }
        });
    const apiUrl = config.getItem("ext.ncm.apiEndpoint") + \`/recommend/songs?cookie=\` + cookieValue;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const searchResults = document.getElementById('ncm_recommendSong');
            if (data.data && data.data.dailySongs && data.data.dailySongs.length > 0) {
                let resultsHtml = "";
                let playList = ""; // Initialize playList variable
                resultsHtml += \`<div class="hiddenOver" style="overflow-x: auto; overflow-y: hidden;">\`;

                data.data.dailySongs.forEach(song => {
                    playList += song.id + ","; // Add song ID to playList
                    resultsHtml += \`
                    <a href="javascript:requestMusicChange(\${song.id})">
                        <button style="padding:0; width:150px; height:180px; margin-right:5px;margin-bottom:10px;" class="sub" type="submit">
                            <img style="width:100%; height:auto; border-radius:5px" alt="封面" src="\${song.al.picUrl}?param=150y150" height="35px"/>
                            <br>
                            <span style='height: 20px; display: block; overflow: hidden;'>\${song.name}</span>
                        </button>
                    </a>\`;
                });

                resultsHtml += \`</div>\`;
                searchResults.innerHTML = resultsHtml;

                if (playList.endsWith(',')) {
                    playList = playList.slice(0, -1);
                }

                document.getElementById('ncm_fastPlay_recommendSong').setAttribute('onclick', \`requestMusicChange("\${playList}", true)\`);
            } else {
                searchResults.innerHTML = \`获取失败：\` + data.msg;
            }
        })
        .catch(error => console.error('Error:', error));
}
        
        
function openTab(evt, tabName) {
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

        `;

includeScriptElement(scripts);