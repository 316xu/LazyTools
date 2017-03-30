'use strict'
const fs = require('fs');
const cp = require('child_process');
const path = require('path');
const qshell = path.join(__dirname, 'qshell');

let randomFileName = function() {
    let len = 32;
　　let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
　　let maxPos = $chars.length;
　　let pwd = '';
　　for (let i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}

let config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf-8'));
let AK = config.accessKey;
let SK = config.secretKey;
let BUCKET = config.bucket;
let URL = config.url;

let file = process.argv[2];
let fileContent = fs.readFileSync(file, 'utf-8');
let regex = /!\[[\w\W]*?]\([\w\W]*?\)/g;
let imgs = fileContent.match(regex);
let urlRegex = /http.*?\)/g

if (imgs == null || imgs.length == 0) {
    return;
}
cp.execSync(qshell + ' account ' + AK + ' ' + SK);
let prefix = file.substring(0, file.length - 3) + "/";

for (let img of imgs) {
    let temp = img.match(urlRegex)[0];
    let imgUrl = temp.substring(0, temp.length - 1);
    let fileName = randomFileName();


    console.log('wget "' + imgUrl + '" -O ' + fileName);
    cp.execSync('wget "' + imgUrl + '" -O ' + fileName);
    cp.execSync(qshell + ' fput ' + BUCKET + ' ' + prefix + fileName + ' ' + fileName);
    fileContent = fileContent.replace(imgUrl, URL + prefix + fileName);
    console.log('rm -f ' + fileName);
    cp.execSync('rm -f ' + fileName);
}

fs.writeFileSync(file, fileContent);

