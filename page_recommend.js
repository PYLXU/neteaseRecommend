var ncm_recommendPageButton = document.createElement("div");

ncm_recommendPageButton.setAttribute("data-page-id", "ncm_recommendPage");
ncm_recommendPageButton.setAttribute("onclick", "switchRightPage('ncm_recommendPage');ncm_getNewSong();ncm_getRecommendSong();");

ncm_recommendPageButton.innerHTML = '<i></i> 发现';

var leftBar = document.getElementsByClassName("leftBar")[0];
var searchBtn = document.getElementById("searchBtn");
leftBar.insertBefore(ncm_recommendPageButton, searchBtn);


var ncm_recommendPage = document.createElement("div");

ncm_recommendPage.setAttribute("id", "ncm_recommendPage");
ncm_recommendPage.setAttribute("hidden", "");
ncm_recommendPage.classList.add("page");

ncm_recommendPage.innerHTML = `<div class="header">
    <i></i>发现音乐
    <div class="tabLinkContainer">
        <button class="tablink active" onclick="openTab(event, 'Home');ncm_getNewSong();ncm_getRecommendSong()">主页</button>
        <button class="tablink" onclick="openTab(event, 'ncm_Rank');ncm_getRankList()">排行榜</button>
        <button class="tablink" onclick="openTab(event, 'ncm_List');ncm_getsongListRecommend()">歌单推荐</button>
        <button class="tablink" onclick="openTab(event, 'ncm_ListSearch');">歌单搜索</button>
        <button class="tablink" onclick="openTab(event, 'ncm_MVSearch');">MV</button>
        <button class="tablink" onclick="switchRightPage('ncm_userPage');loadUserPage()">我的账户</button>
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
</div>`;

var Right = document.getElementsByClassName("right")[0];
Right.appendChild(ncm_recommendPage);