// 插入侧栏与页面
const userPage = ExtensionFunctions.insertNavigationItem({
    pageId: "userPage",
    icon: "EE08",
    text: "我的",
    appendBefore: "searchPage",
});

ExtensionFunctions.insertStyle(`
    #userPage #qrcodeContainer {
    min-width: 40%;
    }

    #userPage #userPageInfo {
    display: none;
    }

    #userPage .userPageMain {
    display: grid;
    place-items: center;
    height: 100vh;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    width: calc(100% - 40px);
    max-width: 520px;
    }   
    #userPage .userPageMod {
    display:flex;
    border-radius: 5px;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, .6);
    backdrop-filter: blur(30px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
    max-height: calc(100vh - 25px);
    overflow: auto;
    height: auto;
    width: 100%;
    padding: 30px;
    } 
    `)
userPage.pageDiv.classList.add("page");
userPage.pageDiv.innerHTML = `
    <div class="userPageMain">
        <div class="userPageMod">
            <div id="loginForm" style="margin-right: 20px;">
                <h2>登录云音乐</h2>
                <input type="email" id="email" placeholder="邮箱">
                <input type="password" id="password" placeholder="密码">
                <button id="loginButton" style="margin-top: 15px;">登录</button>
            </div>
            <div id="qrcodeContainer">
                <div id="qrcode" style="width: 100%;"></div>
                <p style="
                    margin: 0;
                    padding-left: 20px;
                ">
                手机扫描二维码登录
                </p>
            </div>
            <div id="userInfo" style="text-align: center;">
                <h2><i></i>&nbsp;网易云音乐</h2>
                <img id="avatar" src="" alt="用户头像" width="30%" style="border-radius: 10em;">
                <p><span style="font-size: 24px;font-weight: bold;" id="username"></span></p>
                <button id="myPlaylistsButton" class="sub" style="margin-top: 15px;">我的歌单</button>
                <button id="myMusicsButton" class="sub" style="margin-top: 15px;">我的收藏</button>
                <button id="logoutButton" class="sub" style="margin-top: 15px;">退出登录</button>
            </div>
        </div>
    </div>
`
userPage.navbarDiv.addEventListener("click", (event) => {
    ncm_loadUserPage();
});
// 页面代码

function ncm_getHeaders() {
    let headers = {};
    const headersConf = config.getItem("ext.ncm.apiHeaders");
    if (headersConf) {
        headersConf.split('&').forEach(pair => {
            const [key, value] = pair.split('=');
            key && value && (headers[decodeURIComponent(key)] = decodeURIComponent(value));
        });
    }
    return headers;
}

async function ncm_loadUserPage() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(decodeURI(it[0])) == "cookie") {
            cookieValue = decodeURIComponent(decodeURI(it[1]));
        }
    });
    if (cookieValue) {
        const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + `/login/status?cookie=` + cookieValue, { headers: ncm_getHeaders() });
        const data = await response.json();
        if (data.data.profile) {
            ncm_handleLoginSuccess(data.data);
        } else {
            ncm_generateQRCode();
        }
    } else {
        ncm_generateQRCode();
    }
}
async function ncm_generateQRCode() {
    try {
        const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + '/login/qr/key?timestamp=${Date.now()}', { headers: ncm_getHeaders() });
        const data = await response.json();
        const key = data.data.unikey;

        const qrResponse = await fetch(config.getItem("ext.ncm.apiEndpoint") + `/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`, { headers: ncm_getHeaders() });
        const qrData = await qrResponse.json();

        const qrcodeElement = document.getElementById('qrcode');
        qrcodeElement.innerHTML = `<img style="width: 100%;" src="${qrData.data.qrimg}" alt="二维码">`;

        ncm_checkQRCodeStatus(key);

        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('qrcodeContainer').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
    } catch (error) {
        console.error('生成二维码失败:', error);
    }
}

async function ncm_checkQRCodeStatus(key) {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + `/login/qr/check?key=${key}&timestamp=${Date.now()}`, { headers: ncm_getHeaders() });
            const data = await response.json();

            if (data.code === 803) {
                clearInterval(interval);
                ncm_handleLoginSuccess(data);
            } else if (data.code === 801 || data.code === 802) {
                // 继续轮询
            } else if (data.code === 800) {
                clearInterval(interval);
            }
        } catch (error) {
            console.error('检查二维码状态失败:', error);
            clearInterval(interval);
        }
    }, 2000);
}

async function ncm_loginWithEmail() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + '/login?email=' + email + '&password=' + password, { headers: ncm_getHeaders() })

        const data = await response.json();
        if (data.code === 200) {
            ncm_handleLoginSuccess(data);
        } else {
            alert('登录失败，请检查您的用户名和密码！');
        }
    } catch (error) {
        console.error('登录失败:', error);
    }
}

function ncm_logOut() {
    var cookieValue = "";
    config.getItem("ext.ncm.apiHeaders").split("&").map((it) => it.split("=")).forEach((it) => {
        if (decodeURIComponent(it[0]) == "cookie") {
            cookieValue = decodeURIComponent(it[1]);
            fetch(config.getItem("ext.ncm.apiEndpoint") + `/logout?cookie=` + cookieValue, { headers: ncm_getHeaders() });
            config.setItem('ext.ncm.apiHeaders', config.getItem("ext.ncm.apiHeaders").replace('cookie=' + it[1], ''));
        }
    });
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('qrcodeContainer').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
}

function ncm_handleLoginSuccess(data) {
    if (data.cookie) {
        const MUSIC_U_REGEX = /MUSIC_U=(.*?)(?:;|$)/;
        const match = MUSIC_U_REGEX.exec(data.cookie);
        if (match) {
            var currentConfig = config.getItem('ext.ncm.apiHeaders');
            var targetConfig = encodeURI(encodeURIComponent('cookie')) + '=' + encodeURI(encodeURIComponent('MUSIC_U=' + match[1]));
            if (currentConfig && currentConfig !== "" && currentConfig !== null) {
                currentConfig = currentConfig + '&' + targetConfig
            } else {
                currentConfig = targetConfig
            }
            config.setItem('ext.ncm.apiHeaders', currentConfig);
        }
    }
    if (data.profile) {
        document.getElementById('username').innerText = data.profile.nickname;
        document.getElementById('avatar').src = data.profile.avatarUrl;
    } else if (data.account && data.account.userName) {
        document.getElementById('username').innerText = data.account.userName;
        document.getElementById('avatar').src = 'https://s1.music.126.net/style/favicon.ico';
    } else {
        console.error('数据格式不正确');
    }

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('qrcodeContainer').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
}

function ncm_openMyPlaylists() {
    switchRightPage('recommendPage');
    document.getElementById('listSearchTab').click();
    document.getElementById('ncm_search_input').value = `${document.getElementById('username').innerText}`;
    document.getElementById('ncm_search_btn').click();
}

function ncm_openMyMusics() {
    ncm_loadLikeList();
}

// 链接事件
document.getElementById('loginButton').onclick = ncm_loginWithEmail;
document.getElementById('qrcode').onclick = ncm_generateQRCode;
document.getElementById('logoutButton').onclick = ncm_logOut;
document.getElementById('myPlaylistsButton').onclick = ncm_openMyPlaylists;
document.getElementById('myMusicsButton').onclick = ncm_openMyMusics;