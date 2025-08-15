const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// 检查是否已存在 extension.zip，如果存在则删除
const zipPath = path.join(__dirname, 'extension.zip');
if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
}

// 读取 manifest.json 文件
const manifestPath = path.join(__dirname, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// 创建写入流和归档对象
const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', {
    zlib: { level: 9 } // 设置压缩级别
});

// 监听归档过程中的事件
output.on('close', function () {
    console.log(`extension.zip 创建成功，共 ${archive.pointer()} 字节`);
});

archive.on('error', function(err){
    throw err;
});

// 将归档数据.pipe到输出文件
archive.pipe(output);

// 添加 manifest.json 到 zip
archive.file(manifestPath, { name: 'manifest.json' });

// 添加 entries 中列出的所有文件
if (manifest.entries && Array.isArray(manifest.entries)) {
    manifest.entries.forEach(entry => {
        const entryPath = path.join(__dirname, entry);
        if (fs.existsSync(entryPath)) {
            archive.file(entryPath, { name: entry });
        } else {
            console.warn(`警告：文件 ${entry} 不存在，已跳过`);
        }
    });
}

// 完成归档
archive.finalize();