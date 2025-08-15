async function ncm_downloadAndInstallExtension(url) {
  const tempDir = require("os").tmpdir();
  const filename = url.substring(url.lastIndexOf("/") + 1);
  const filePath = path.join(tempDir, filename);

  const xhr = new XMLHttpRequest();

  xhr.onprogress = function (event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      console.log(`下载进度: ${percentComplete.toFixed(2)}%`);
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
            const file = new File([zipFileBuffer], path.basename(filePath), {
              type: "application/zip",
            });
            ExtensionRuntime.install(file);
          }
        });
      };

      fileReader.readAsArrayBuffer(blob); // Ensure xhr.response is a Blob
    } else {
      console.error(`下载失败，状态码: ${xhr.status}`);
    }
  };

  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.send();
}

async function ncm_checkNCMPluginInstalled() {
  const extData = await ExtensionRuntime.getExtData();
  if (extData.hasOwnProperty("ncm")) {
    return;
  }
  var url = `https://proxies.3r60.top/https://api.github.com/repos/PYLXU/neteaseSupport/releases/latest`;
  const response = await fetch(url);
  var release = await response.json();
  confirm(
    "NCM扩展 - 音乐推荐模块：您尚未安装NCM主支持扩展，点击确认以安装",
    () => {
      url =
        `https://api.3r60.top/v2/ghproxy/?url=` +
        encodeURI(
          `https://github.com/PYLXU/neteaseSupport/releases/download/${release.tag_name}/extension.zip`
        );
      ncm_downloadAndInstallExtension(url);
    }
  );
}

async function ncm_checkUpdate() {
  const extData = await ExtensionRuntime.getExtData();
  var url = `https://proxies.3r60.top/https://api.github.com/repos/PYLXU/neteaseRecommend/releases/latest`;
  const response = await fetch(url);
  var release = await response.json();
  if (
    extData["neteaseRecommend"] &&
    extData["neteaseRecommend"].version === release.tag_name
  ) {
    return;
  }
  confirm(
    `NCM扩展 - 音乐推荐模块：扩展存在新的版本${release.tag_name}，是否立即更新？`,
    () => {
      url =
        `https://api.3r60.top/v2/ghproxy/?url=` +
        encodeURI(
          `https://github.com/PYLXU/neteaseRecommend/releases/download/${release.tag_name}/extension.zip`
        );
      ncm_downloadAndInstallExtension(url);
    }
  );
}
if(config.getItem("ext.ncm.apiEndpoint") === "") {
    alert("NCM扩展 - 音乐推荐模块：请设置NCM主支持扩展的API地址。")
}
ncm_checkNCMPluginInstalled();
ncm_checkUpdate();
