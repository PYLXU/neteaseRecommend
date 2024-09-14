var styles = `
#qrcodeContainer {
    min-width: 40%;
}

#userInfo {
    display: none;
}

.userPageMain {
    display: grid;
    place-items: center;
    height: 100vh;
    margin-left: auto;
    margin-right: auto;
    position: relative;
    width: calc(100% - 40px);
    max-width: 520px;
}   
.userPageMod {
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

.tabLinkContainer {
    background: transparent;
    margin-left: 15px;
}

.tablink {
    margin: 0 2px;
    cursor: pointer;
    background: none;
    color: black;
}

.tablink:hover {
    color: #1391efb5;
}

.tablink.active {
    color: #0092ff;
}

.tabcontent {
    display: none;
}


#ncm_search_form, #ncm_search_mv_form {
    margin-top: 10px;
    display: flex;
    white-space: nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
}

#ncm_recommendPageMain {
    position: absolute;
    z-index: 1;
    padding: 50px 27.5px 100px 27.5px;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
}

.ncm_miniPlayBtn {
    padding: 0 10px;
    font-size: 22px;
    margin-right: 10px;
    height: 33px
}

.ncm_table {
    width: 100%;
    max-width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
}

.ncm_table th {
    font-weight: normal;
    text-align: left;
    opacity: .5;
    font-size: .9em;
    padding: 5px 0;
    transition: opacity .2s;
}

.ncm_table tr {
    height: 45px;
}

.ncm_table tr:hover {
    background-color: rgba(0,0,0,.05);
}

#ncm_search_btn, #ncm_search_mv_btn {
    height: 37px;
    font-size: 1.05em;
    margin-left:5px;
}
`;

includeStyleElement(styles);