(function anonymous(
) {


    const { navbarDiv, pageDiv } = ExtensionFunctions.insertNavigationItem({
        pageId: "recognition",
        icon: "F298",
        text: "识曲",
        appendBefore: "downloadPage",
    });

    ExtensionFunctions.insertStyle(`


`);

    pageDiv.innerHTML = `
	<div id="recEntryPage">
		<div class="title">听歌识曲<small>识别您正在播放的歌曲</small></div>
		<button class="recognitionBtn">
			<div class="animationDots"><div></div><div></div><div></div><div></div><div></div></div>
			<div class="text">正在识别</div>
		</button>
		<div class="source">
			<div class="indicator"></div>
			<div><i>&#xEBCA;</i>系统音频</div>
			<div><i>&#xEF4E;</i>环境音频</div>
		</div>
	</div>
	<div id="recResultPage">
		<div class="title"><i>&#xEA58;</i> 识别结果</div>
		<img src="assets/placeholder.svg">
		<div>
			<div class="songInfo">
				<b class="musicTitle">未知曲目</b>
				<div>
					<i>&#xF264;</i> <span class="artist">未知艺术家</span>&nbsp;&nbsp;&nbsp;
					<i>&#xEA1F;</i> <span class="album">未知专辑</span>
				</div>
			</div>
		</div>
		<div class="buttonGroup">
			<button class="searchBtn"><i>&#xF0D1;</i> 在「<span class="searchSource"></span>」搜索</button>
			<button class="sub square searchOptionBtn"><i>&#xEA4D;</i></button>
		</div>
	</div>
`;




    let recSource = 0;
    let recRecording = false;
    let mediaRecorder, stream, audioChunks;
    function recSwitchSource(id) {
        recSource = id;
        const indicator = pageDiv.querySelector(".source>div.indicator");
        indicator.style.left = `${id * 130 + 5}px`;
        setTimeout(() => { indicator.innerHTML = pageDiv.querySelector(`.source>div:nth-child(${id + 2})`).innerHTML; }, 150);
    };
    recSwitchSource(0);
    pageDiv.querySelector(`.source>div:nth-child(2)`).onclick = () => { recSwitchSource(0); };
    pageDiv.querySelector(`.source>div:nth-child(3)`).onclick = () => { recSwitchSource(1); };
    function resetStatus() {
        pageDiv.classList.add("idle");
        pageDiv.classList.remove("recording");
        pageDiv.classList.remove("loading");
        pageDiv.classList.remove("result");
        recRecording = false;
        try {
            mediaRecorder.stop();
            stream.getTracks().forEach(track => track.stop());
        } catch { }
    }
    resetStatus();
    pageDiv.querySelector(".title>i").onclick = resetStatus;

    pageDiv.querySelector(".recognitionBtn").onclick = async () => {
        if (!recRecording) {
            pageDiv.classList.remove("idle");
            pageDiv.classList.add("recording");
            if (!document.getElementById("audio").paused) SimAPControls.togglePlay();
            recRecording = true;
            // 开始录音逻辑
            try {
                // 说明：getDisplayMedia无法设置只读音频源（video must be requested）  只能拉小视频码率
                stream = recSource ? await navigator.mediaDevices.getUserMedia({ audio: true, video: false }) : await navigator.mediaDevices.getDisplayMedia({ audio: true });
                audioChunks = [];
                mediaRecorder = new MediaRecorder(stream, { mimeType: "video/mp4", videoBitsPerSecond: 1 });
                mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
                mediaRecorder.start();
            } catch {
                alert("录音时出现错误，请检查相关权限配置。");
                resetStatus();
            }
        } else {
            pageDiv.classList.remove("recording");
            pageDiv.classList.add("loading");
            recRecording = false;
            // 停止录音逻辑
            try {
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunks, { type: "video/mp4" });
                    const audioFile = new File([audioBlob], "recording.mp4", { type: "video/mp4" });
                    const formData = new FormData();
                    formData.append("file", audioFile, "recording.mp4");
                    const res = await fetch("https://api.doreso.com/upload", { method: "POST", body: formData });
                    if (res.ok) {
                        const result = await res.json();
                        queryResult(result.data.id);
                    } else {
                        alert(`今日调用过于频繁 (${res.status})，请稍后再试。`);
                        resetStatus();
                    }
                };
                mediaRecorder.stop();
            } catch {
                alert("出现未知错误，请稍后再试。");
                resetStatus();
            } finally {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    async function queryResult(id) {
        const res = await fetch(`https://api.doreso.com/file/${id}`);
        const json = await res.json();
        if (!json?.data[0]?.results) {
            if (json?.data[0]?.state == 0) return setTimeout(() => { queryResult(id) }, 500);
            else {
                alert("暂未匹配到相似的曲目。");
                return resetStatus();
            }
        }
        const title = json.data[0].results?.music[0]?.result?.title;
        const artist = json.data[0].results?.music[0]?.result?.artists?.map(item => item.name).join(", ") ?? "未知艺术家";
        const album = json.data[0].results?.music[0]?.result?.album?.name ?? "未知专辑";
        if (!title) {
            alert("暂未匹配到相似的曲目。");
            return resetStatus();
        }
        pageDiv.querySelector(".musicTitle").innerText = title;
        pageDiv.querySelector(".artist").innerText = artist;
        pageDiv.querySelector(".album").innerText = album;
        pageDiv.querySelector("#recResultPage>img").src = "assets/placeholder.svg";
        pageDiv.classList.add("result");
        searchKeyword = `${title} - ${artist}`
        const data = {
            "artist": artist,
            "album": album,
            "country": "cn",
            "sources": ["kugou"],
        };
        fetch("https://covers.musichoarders.xyz/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json", },
            body: JSON.stringify(data),
        })
            .then(res => res.text())
            .then(text => {
                let imageFound;
                text.split("\n").forEach(line => {
                    if (imageFound) return;
                    try {
                        let json = JSON.parse(line);
                        if (json.type == "cover") {
                            pageDiv.querySelector("#recResultPage>img").src = json.bigCoverUrl;
                            imageFound = true;
                        }
                    } catch { }
                });
            });
    }



    let currentSource, searchKeyword;
    function loadSearchList() {
        ExtensionRuntime.getExtData().then(extData => {
            let sources = {};
            currentSource = config.getItem("recognition.searchSource");
            for (const name in ExtensionConfig) {
                if (ExtensionConfig[name].search) sources[name] = extData[name].uiName;
            }
            if (!sources[currentSource]) currentSource = Object.keys(sources)[0];
            pageDiv.querySelector(".searchSource").innerText = sources[currentSource];
            let menuItems = [];
            for (const name in sources) {
                menuItems.push({
                    label: sources[name],
                    icon: currentSource == name ? "EB7B" : " ",
                    click() { config.setItem("recognition.searchSource", name); loadSearchList(); },
                });
            }
            pageDiv.querySelector(".searchOptionBtn").onclick = e => {
                new ContextMenu(menuItems).popup([e.clientX, e.clientY]);
            };
        });
    }
    loadSearchList();
    pageDiv.querySelector(".searchBtn").onclick = async () => {
        await Search.switchSearch();
        document.getElementById("searchSource").value = currentSource;
        document.getElementById("searchInput").value = searchKeyword;
        Search.submit();
    }

})