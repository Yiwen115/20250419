let circles = [];
let droplets = []; // 儲存水滴
let puddles = []; // 儲存積水
let all1, all2; // 儲存圖片
let frame1 = 0, frame2 = 0; // 儲存動畫的偵數
let frameRate1 = 7, frameRate2 = 6; // 每秒偵數
let spriteWidth1 = 42.5, spriteHeight1 = 65; // all_1.png 單張圖片大小
let spriteWidth2 = 45, spriteHeight2 = 61; // all_2.png 單張圖片大小
let showSprite2 = false; // 控制是否顯示精靈圖2
let sprite2X = -200; // 精靈圖2的初始 X 座標（畫布外）
let sprite2TargetX = 200; // 選單右側 5 公分處（可根據選單位置調整）
let sprite2Y = 50; // 精靈圖2的固定 Y 座標
let sprite2Visible = false; // 控制精靈圖2是否顯示

function preload() {
  all1 = loadImage('all_1.png'); // 載入 all_1.png
  all2 = loadImage('all_2.png'); // 載入 all_2.png
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor(); // 隱藏預設游標
  background('#f9eae1');

  // 生成 40 個圓的初始資料
  for (let i = 0; i < 40; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: random(30, 50),
      color: color(random(255), random(255), random(255))
    });
  }

  // 生成水滴
  for (let i = 0; i < 50; i++) {
    droplets.push({
      x: random(width),
      y: random(-height, 0), // 從畫布上方生成
      size: random(5, 10),
      speed: random(3, 7),
      color: color(0, 100, 255, 150) // 半透明藍色
    });
  }

  // 建立選單
  createMenu();
}

function draw() {
  // 設定漸層背景
  setGradient(0, 0, width, height, color('#001d3d'), color('#003566'), 'Y'); // 深藍到淺藍的垂直漸層

  // 繪製水滴
  for (let droplet of droplets) {
    fill(droplet.color);
    noStroke();
    ellipse(droplet.x, droplet.y, droplet.size);

    // 更新水滴位置
    droplet.y += droplet.speed;

    // 如果水滴到達地面，生成積水
    if (droplet.y > height - 10) {
      puddles.push({
        x: droplet.x,
        y: height - 5,
        size: random(10, 20),
        color: color(0, 100, 255, 100) // 半透明藍色
      });
      droplet.y = random(-height, 0); // 重置水滴到畫布上方
      droplet.x = random(width);
    }
  }

  // 繪製積水
  for (let puddle of puddles) {
    fill(puddle.color);
    noStroke();
    ellipse(puddle.x, puddle.y, puddle.size, puddle.size / 3); // 橢圓形積水
  }

  // 根據滑鼠的 X 位置調整星星的大小
  let sizeFactor = map(mouseX, 0, width, 20, 80);

  // 繪製所有星星
  for (let circle of circles) {
    fill(circle.color.levels[0], circle.color.levels[1], circle.color.levels[2], random(150, 255)); // 增加透明度
    noStroke();

    // 繪製星星
    drawStar(circle.x, circle.y, circle.size * sizeFactor / 100, circle.size * sizeFactor / 50, 5);
  }

  // 如果需要顯示精靈圖2
  if (sprite2Visible) {
    let totalFrames2 = 6; // 總偵數
    let sx2 = frame2 * spriteWidth2; // 計算來源 X 座標
    let sy2 = 0; // 假設只有一行動畫
    if (frameCount % 30 === 0) { // 每 30 幀更新一次
      frame2 = (frame2 + 1) % totalFrames2; // 更新偵數
    }
    image(
      all2,
      sprite2X, // 精靈圖2的 X 座標
      sprite2Y, // 精靈圖2的 Y 座標
      spriteWidth2,
      spriteHeight2,
      sx2,
      sy2,
      spriteWidth2,
      spriteHeight2
    );
  }

  // 繪製精靈圖1作為自定義鼠標指標
  let totalFrames1 = 7; // 假設精靈圖1有 7 幀
  let sx1 = frame1 * spriteWidth1; // 計算來源 X 座標
  let sy1 = 0; // 假設只有一行動畫
  if (frameCount % 10 === 0) { // 每 10 幀更新一次
    frame1 = (frame1 + 1) % totalFrames1; // 更新偵數
  }
  image(
    all1,
    mouseX - spriteWidth1 / 2, // 調整 X 座標，讓圖片中心對齊滑鼠
    mouseY - spriteHeight1 / 2, // 調整 Y 座標，讓圖片中心對齊滑鼠
    spriteWidth1,
    spriteHeight1,
    sx1,
    sy1,
    spriteWidth1,
    spriteHeight1
  );
}

// 繪製星星的輔助函式
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// 自訂漸層背景的輔助函式
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  if (axis === 'Y') { // 垂直漸層
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === 'X') { // 水平漸層
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

function createMenu() {
  let menu = createElement('ul');
  menu.style('position', 'fixed');
  menu.style('top', '-100px');
  menu.style('right', '10px');
  menu.style('list-style', 'none');
  menu.style('padding', '10px 20px');
  menu.style('background', 'linear-gradient(135deg, #001d3d, #004080)'); // 深藍到淺藍的漸層背景
  menu.style('border', '1px solid #00509e'); // 更亮的藍色邊框
  menu.style('border-radius', '15px');
  menu.style('box-shadow', '0 8px 15px rgba(0, 0, 0, 0.6)'); // 增加陰影
  menu.style('display', 'flex');
  menu.style('gap', '20px');
  menu.style('align-items', 'center');
  menu.style('z-index', '3000');
  menu.style('transition', 'top 0.5s ease');

  let items = ['首頁', '自我介紹', '作品集', '測驗卷', '教學影片'];
  for (let item of items) {
    let li = createElement('li', item);
    li.style('cursor', 'pointer');
    li.style('padding', '15px 25px');
    li.style('background', 'rgba(255, 255, 255, 0.1)'); // 半透明背景
    li.style('border', '1px solid rgba(255, 255, 255, 0.3)'); // 半透明邊框
    li.style('border-radius', '10px');
    li.style('text-align', 'center');
    li.style('font-family', 'Arial, sans-serif');
    li.style('font-size', '16px');
    li.style('color', '#ffffff'); // 白色文字
    li.style('transition', 'all 0.4s ease, transform 0.2s ease');
    li.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');

    li.mouseOver(() => {
      li.style('background', 'linear-gradient(135deg, #ffdd57, #ffd700)'); // 黃色漸層背景
      li.style('color', '#00264d'); // 深藍文字
      li.style('transform', 'scale(1.2) rotate(3deg)');
      li.style('box-shadow', '0 6px 10px rgba(0, 0, 0, 0.5)');
    });

    li.mouseOut(() => {
      li.style('background', 'rgba(255, 255, 255, 0.1)');
      li.style('color', '#ffffff');
      li.style('transform', 'scale(1) rotate(0deg)');
      li.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.3)');
    });

    if (item === '首頁') {
      li.mousePressed(() => {
        clear(); // 清除畫布
        hideIframe(); // 隱藏 iframe
        hideVideo(); // 隱藏 video

        // 設定精靈圖2的位置，讓它顯示在首頁左邊 2 公分（20px）
        let liBounds = li.elt.getBoundingClientRect(); // 獲取選單項目的邊界
        sprite2X = liBounds.left - spriteWidth2 - 20; // 選單項目左側減去精靈圖寬度和 20px
        sprite2Y = liBounds.top + window.scrollY; // 與選單項目垂直對齊
        sprite2Visible = true; // 顯示精靈圖2
      });
    } else if (item === '自我介紹') {
      li.mousePressed(() => {
        clear(); // 清除畫布
        hideIframe(); // 隱藏 iframe
        hideVideo(); // 隱藏 video

        // 嵌入自我介紹的連結
        loadIframe('https://yiwen115.github.io/20240413/');
      });
    } else if (item === '作品集') {
      li.mousePressed(() => toggleSubMenu(li)); // 點擊時顯示子選單
    } else if (item === '教學影片') {
      li.mousePressed(() => {
        clear(); // 清除畫布
        hideIframe(); // 隱藏 iframe
        hideVideo(); // 隱藏 video
        loadVideo('./教學影片.mp4'); // 播放教學影片
      });
    } else if (item === '測驗卷') {
      li.mousePressed(() => {
        clear(); // 清除畫布
        hideVideo(); // 隱藏 video
        loadIframe('https://yiwen115.github.io/20250417/'); // 更新測驗卷的連結
      });
    }

    menu.child(li);
  }

  window.addEventListener('mousemove', (event) => {
    if (event.clientY >= 0 && event.clientY <= 200) {
      menu.style('top', '10px');
    } else {
      menu.style('top', '-100px');
      sprite2Visible = false; // 當選單隱藏時，隱藏精靈圖2
    }
  });
}

function toggleSubMenu(parentLi) {
  // 如果子選單已存在，則移除
  let existingSubMenu = document.querySelector('.sub-menu');
  if (existingSubMenu) {
    existingSubMenu.remove();
    return;
  }

  // 建立子選單
  let subMenu = createElement('ul');
  subMenu.class('sub-menu');
  subMenu.style('position', 'absolute');
  subMenu.style('top', '100%');
  subMenu.style('left', '0');
  subMenu.style('list-style', 'none');
  subMenu.style('padding', '15px 20px');
  subMenu.style('background', 'linear-gradient(135deg, #ffffff, #f0f0f0)');
  subMenu.style('border', '1px solid #ccc');
  subMenu.style('border-radius', '10px');
  subMenu.style('box-shadow', '0 8px 15px rgba(0, 0, 0, 0.2)');
  subMenu.style('z-index', '3000'); // 確保子選單在最上層
  subMenu.style('display', 'block'); // 設定為垂直排列

  let subItems = [
    { name: '第一周作業', url: 'https://yiwen115.github.io/20250303/' },
    { name: '第二周作業', url: 'https://yiwen115.github.io/20250317/' },
    { name: '第三周作業', url: 'https://yiwen115.github.io/20250324/' },
    { name: '第四周作業', url: 'https://yiwen115.github.io/20250407/' },
    { name: 'HackMD', url: 'https://hackmd.io/@Yiwen115/S1Xgq2l01g' } // 更新 HackMD 子選單項目
  ];

  for (let subItem of subItems) {
    let li = createElement('li', subItem.name);
    li.style('cursor', 'pointer');
    li.style('padding', '12px 20px');
    li.style('background', '#ffffff');
    li.style('border', '1px solid #ddd');
    li.style('border-radius', '8px');
    li.style('margin-bottom', '10px'); // 增加選項之間的垂直間距
    li.style('text-align', 'center');
    li.style('font-family', 'Arial, sans-serif');
    li.style('font-size', '15px');
    li.style('color', '#333');
    li.style('transition', 'all 0.3s ease');
    li.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');

    // 滑鼠懸停動畫
    li.mouseOver(() => {
      li.style('background', 'linear-gradient(135deg, #f9f9f9, #e0e0e0)');
      li.style('box-shadow', '0 6px 10px rgba(0, 0, 0, 0.2)');
    });
    li.mouseOut(() => {
      li.style('background', '#ffffff');
      li.style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
    });

    // 點擊事件
    li.mousePressed(() => loadIframe(subItem.url));
    subMenu.child(li);
  }

  parentLi.child(subMenu);
}

function toggleVideoMenu(parentLi) {
  // 如果影片已經存在，則移除
  let existingVideo = document.querySelector('video');
  if (existingVideo) {
    existingVideo.remove();
    return;
  }

  // 清除畫布並嵌入 video 元素
  clear();
  let video = createElement('video');
  video.attribute('src', './教學影片.mp4'); // 本地 MP4 檔案路徑
  video.attribute('controls', 'true'); // 顯示播放控制列
  video.attribute('autoplay', 'true'); // 自動播放

  // 設定 video 的寬度和高度
  let videoWidth = windowWidth * 0.8; // 寬度為視窗的 80%
  let videoHeight = windowHeight * 0.8; // 高度為視窗的 80%

  // 計算置中位置
  let videoTop = (windowHeight - videoHeight) / 2; // 垂直置中
  let videoLeft = (windowWidth - videoWidth) / 2; // 水平置中

  video.style('position', 'absolute');
  video.style('top', `${videoTop}px`);
  video.style('left', `${videoLeft}px`);
  video.style('width', `${videoWidth}px`);
  video.style('height', `${videoHeight}px`);
  video.style('border', 'none');
  video.style('border-radius', '10px'); // 增加圓角
  video.style('box-shadow', '0 8px 15px rgba(0, 0, 0, 0.3)'); // 增加陰影
  video.style('z-index', '2000'); // 確保 video 在最上層
  document.body.appendChild(video.elt);
}

function loadIframe(url) {
  // 清除畫布並嵌入 iframe
  clear();
  let iframe = createElement('iframe');
  iframe.attribute('src', url);

  // 設定 iframe 的寬度和高度
  let iframeWidth = windowWidth * 0.8; // 寬度為視窗的 80%
  let iframeHeight = windowHeight * 0.8; // 高度為視窗的 80%

  // 計算置中位置
  let iframeTop = (windowHeight - iframeHeight) / 2; // 垂直置中
  let iframeLeft = (windowWidth - iframeWidth) / 2; // 水平置中

  iframe.style('position', 'absolute');
  iframe.style('top', `${iframeTop}px`);
  iframe.style('left', `${iframeLeft}px`);
  iframe.style('width', `${iframeWidth}px`);
  iframe.style('height', `${iframeHeight}px`);
  iframe.style('border', 'none');
  iframe.style('border-radius', '10px'); // 增加圓角
  iframe.style('box-shadow', '0 8px 15px rgba(0, 0, 0, 0.3)'); // 增加陰影
  iframe.style('z-index', '2000'); // 確保 iframe 在子選單下方
  document.body.appendChild(iframe.elt);
}

function loadVideo(url) {
  // 清除畫布並嵌入 video 元素
  clear();
  let video = createElement('video');
  video.attribute('src', url);
  video.attribute('controls', 'true'); // 顯示播放控制列
  video.attribute('autoplay', 'true'); // 自動播放

  // 設定 video 的寬度和高度
  let videoWidth = windowWidth * 0.8; // 寬度為視窗的 80%
  let videoHeight = windowHeight * 0.8; // 高度為視窗的 80%

  // 計算置中位置
  let videoTop = (windowHeight - videoHeight) / 2; // 垂直置中
  let videoLeft = (windowWidth - videoWidth) / 2; // 水平置中

  video.style('position', 'absolute');
  video.style('top', `${videoTop}px`);
  video.style('left', `${videoLeft}px`);
  video.style('width', `${videoWidth}px`);
  video.style('height', `${videoHeight}px`);
  video.style('border', 'none');
  video.style('border-radius', '10px'); // 增加圓角
  video.style('box-shadow', '0 8px 15px rgba(0, 0, 0, 0.3)'); // 增加陰影
  video.style('z-index', '2000'); // 確保 video 在子選單下方
  document.body.appendChild(video.elt);
}

function hideIframe() {
  // 隱藏 iframe
  let iframe = document.querySelector('iframe');
  if (iframe) {
    iframe.remove(); // 移除 iframe 元素
  }
}

function hideVideo() {
  // 隱藏 video
  let video = document.querySelector('video');
  if (video) {
    video.remove(); // 移除 video 元素
  }
}
