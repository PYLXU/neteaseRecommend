async function checkNCMPluginInstalled() {
    const extData = await ExtensionRuntime.getExtData();
    if (extData.hasOwnProperty('ncm')) {
        return;
    }
    if (!confirm('NCM扩展 - 音乐推荐模块：您尚未安装NCM主支持扩展，点击确认以安装')) {
        return;
    }
    var url = `https://proxies.3r60.top/https://api.github.com/repos/Simsv-Software/SimMusic-NCM-Ext/releases/latest`;
    const response = await fetch(url);
    const release = response.json();
    var url = 'https://mirror.ghproxy.com/https://github.com/Simsv-Software/SimMusic-NCM-Ext/releases/download/${release.tag_name}/extension.zip';
    const tempDir = require('os').tmpdir();
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const filePath = path.join(tempDir, filename);

    const xhr = new XMLHttpRequest();

    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            console.log(`下载进度: \${percentComplete.toFixed(2)}%`);
        }
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const fileReader = new FileReader();

            fileReader.onloadend = function () {
                const buffer = Buffer.from(fileReader.result);
                fs.writeFile(filePath, buffer, async function (err) {
                    if (err) {
                        console.error(`写入文件失败: ${err}`);
                    } else {
                        console.log(`文件已保存至: ${filePath}`);
                        const zipFileBuffer = await fs.promises.readFile(filePath);
                        const file = new File([zipFileBuffer], path.basename(filePath), { type: 'application/zip' });
                        ExtensionRuntime.install(file);
                    }
                });
            };

            fileReader.readAsArrayBuffer(blob); // Ensure xhr.response is a Blob
        } else {
            console.error(`下载失败，状态码: \${xhr.status}`);
        }
    };
}

checkNCMPluginInstalled();


function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (parent.lastChild == targetElement) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function includeScriptElement(scripts) {
    var script = document.createElement("script");
    script.textContent = scripts;
    document.body.appendChild(script);
}
function includeStyleElement(styles) {
    var style = document.createElement("style");
    (document.getElementsByTagName("head")[0] || document.body).appendChild(style);
    if (style.styleSheet) {
        style.styleSheet.cssText = styles;
    } else {
        style.appendChild(document.createTextNode(styles));
    }
}