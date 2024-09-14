var ncm_userPageButton = document.createElement("i");

ncm_userPageButton.setAttribute("id", "miniBtn");
ncm_userPageButton.setAttribute("style", "transform: none;");
ncm_userPageButton.setAttribute("title", "网易云账号");
ncm_userPageButton.setAttribute("onclick", "switchRightPage('ncm_userPage');loadUserPage()");

ncm_userPageButton.innerHTML = '';

var header = document.getElementsByTagName("header")[0];
var hidePlayerBtn = document.getElementById("miniBtn");
header.insertBefore(ncm_userPageButton, hidePlayerBtn);


var ncm_userPage = document.createElement("div");

ncm_userPage.setAttribute("id", "ncm_userPage");
ncm_userPage.setAttribute("hidden", "");
ncm_userPage.classList.add("page");

ncm_userPage.innerHTML = `
<div class="userPageMain">
    <div class="userPageMod">
        <div id="loginForm" style="margin-right: 20px;">
            <h2>登录云音乐</h2>
            <input type="email" id="email" placeholder="邮箱">
            <input type="password" id="password" placeholder="密码">
            <button onclick="ncm_loginWithEmail()" style="margin-top: 15px;">登录</button>
        </div>
        <div id="qrcodeContainer">
            <div onclick="ncm_generateQRCode()" id="qrcode" style="width: 100%;"></div>
            <p style="
                margin: 0;
                padding-left: 20px;
            ">
            手机扫描二维码登录
            </p>
        </div>
        <div id="userInfo" style="text-align: center;">
            <h2>云音乐账户</h2>
            <img id="avatar" src="" alt="用户头像" width="30%" style="border-radius: 10em;">
            <p><span style="font-size: 24px;font-weight: bold;" id="username"></span></p>
            <button class="sub" onclick="ncm_logOut()" style="margin-top: 15px;">退出登录</button>
        </div>
    </div>
</div>
`;
var Right = document.getElementsByClassName("right")[0];
Right.appendChild(ncm_userPage);