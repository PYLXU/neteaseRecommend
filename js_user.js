var scripts = `
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
            const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + \`/login/status?cookie=\`+cookieValue , { headers: ncm_getHeaders() });
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
        const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + '/login/qr/key' , { headers: ncm_getHeaders() });
        const data = await response.json();
        const key = data.data.unikey;

        const qrResponse = await fetch(config.getItem("ext.ncm.apiEndpoint") + \`/login/qr/create?key=\${key}&qrimg=true\` , { headers: ncm_getHeaders() });
        const qrData = await qrResponse.json();

        const qrcodeElement = document.getElementById('qrcode');
        qrcodeElement.innerHTML = \`<img style="width: 100%;" src="\${qrData.data.qrimg}" alt="二维码">\`;

        ncm_checkQRCodeStatus(key);
    } catch (error) {
        console.error('生成二维码失败:', error);
    }
}

async function ncm_checkQRCodeStatus(key) {
    const interval = setInterval(async () => {
        try {
            const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + \`/login/qr/check?key=\${key}\` , { headers: ncm_getHeaders() });
            const data = await response.json();

            if (data.code === 803) {
                clearInterval(interval);
                handleLoginSuccess(data);
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
        const response = await fetch(config.getItem("ext.ncm.apiEndpoint") + '/login?email='+email+'&password='+password , { headers: ncm_getHeaders() })

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
                fetch(config.getItem("ext.ncm.apiEndpoint") + \`/logout?cookie=\`+cookieValue , { headers: ncm_getHeaders() });
                config.setItem('ext.ncm.apiHeaders',config.getItem("ext.ncm.apiHeaders").replace('cookie='+it[1],''));
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
            const currentConfig = config.getItem('ext.ncm.apiHeaders');
            const targetConfig = encodeURI(encodeURIComponent('cookie')) + '=' + encodeURI(encodeURIComponent('MUSIC_U='+match[1]));
            if (currentConfig && currentConfig !== "" && currentConfig !== null) {
                currentConfig = currentConfig + '&' + targetConfig
            } else {
                currentConfig = targetConfig
            }
            config.setItem('ext.ncm.apiHeaders',targetConfig);
        }
    }
    document.getElementById('username').innerText = data.profile.nickname;
    document.getElementById('avatar').src = data.profile.avatarUrl;

    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('qrcodeContainer').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
}`;

includeScriptElement(scripts);