---
title: 纯 HTML 打印页面参考
date: 2024-4-22
categories:
  - Frontend
tags:
  - html
sidebar: 'auto'
publish: true
showSponsor: true
---

## 👋 打印页面参考

> FROM Calidan 立超，有时间补充一些基础

### relative、absolute、fix

```
relative 用于相对当前文档流定位。
absolute 用于从文档流中移除，并相对于最近的定位祖先定位。
fixed 用于从文档流中移除，并相对于视窗固定定位，无论页面如何滚动都不会改变。
```

### 元素居中

```css
/* 用于内联级元素和文本。 */
.container {
  text-align: center;
}

/* 用于块级元素和弹性布局 */
.container {
  display: flex;
  justify-content: center;
}

/* 用于块级元素和网格布局 */
.container {
  display: grid;
  justify-items: center;
}

/* 用于绝对定位的元素 */
.container {
  position: relative;
}

.centered {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
```

### @Media 用途

- 响应式设计：通过 `@media`，开发者可以为不同设备、屏幕尺寸或条件创建特定的样式，从而使网页在多种环境中表现良好。

- 多样性：`@media` 支持多种条件，如设备类型、屏幕宽度、高度、分辨率、颜色深度等。这使得样式定制非常灵活。

#### 常见条件

- `min-width` 和 `max-width`：用于根据屏幕或视窗的宽度应用样式。常用于响应式设计中，确保页面在不同屏幕尺寸上都能正确显示。

- `min-height` 和 `max-height`：根据高度进行样式调整。

- `orientation`：根据设备的方向（横向或纵向）应用样式。

  - `landscape` 横向
  - `protrait` 纵向

- `print`：为打印时提供定制样式。

- `screen`：适用于显示屏幕的样式

#### Demo

```css
/* 为宽度大于等于 600px 的屏幕应用特定样式 */
@media (min-width: 600px) {
  .container {
    width: 50%;
  }
}

/* 为打印应用特定样式 */
@media print {
  .no-print {
    display: none;
  }
}

/* 在这个例子中，只有当宽度大于600px且设备为横向时，.landscape-container 才会显示。 */
@media (min-width: 600px) and (orientation: landscape) {
  .landscape-container {
    display: block;
  }
}
```

### 页面参考

```html
<html lang="ja">
  <meta charset="UTF-8" />
  <style>
    @page {
      width: 210mm;
      height: 297mm;
      margin: 0;
    }
    * {
      font-size: 12px;
      padding: 0;
      margin: 0;
      font-family: 'Hiragino Kaku Gothic ProN';
      outline: none; /* 禁用所有元素的外框 */
      /* 这三个属性确保打印时颜色的准确性。!important 用来覆盖其他规则。*/
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
      /* 为所有元素启用border-box，这意味着元素的总大小包括内边距和边框。这通常用于更容易地控制布局。 */
      box-sizing: border-box;
    }
    body {
      background-color: #ddd;
    }
    .wrap {
      width: 210mm;
      height: 297mm;
      margin: auto;
      background-color: white;
      position: relative;
      background-image: url(https://cdn.helloboss.com/system/print/code-print.webp);
      background-size: cover; /* 指定背景图像应该尽可能大，以完全覆盖其背景区域，即使这意味着图像的一部分会被裁剪 */
      margin-top: 15mm;
    }
    .wrap2 {
      width: 210mm;
      height: 297mm;
      margin: auto; /* 水平居中 */
      background-image: url(https://cdn.helloboss.com/system/print/code-print2.webp);
      background-size: cover;
    }
    .address {
      .content {
        font-size: 11px;
        border: none;
        background-color: transparent;
        text-align: right;
      }
      input:focus {
        border: 1px solid #ddd;
      }
    }
    .notice {
      position: absolute;
      right: 50px;
      top: 253px;
      color: #f27200;
      width: 140px;
      font-size: 10px;
    }
    .code {
      position: absolute;
      top: 260px;
      left: 329px;
      width: 253px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    .print-button {
      position: fixed;
      right: 20px;
      top: 10px;
      padding: 6px 12px;
      cursor: pointer;
      background-color: white;
      color: white;
      border-radius: 99px;
      border: none;
      box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
      font-size: 20px;
    }

    .print-button:active {
      box-shadow: inset 0px 1px 3px rgba(0, 0, 0, 0.3);
      top: 11px;
    }

    .envelope-button {
      position: fixed;
      right: 20px;
      top: 70px;
      padding: 6px 12px;
      cursor: pointer;
      background-color: white;
      color: rgb(133, 126, 126);
      border-radius: 99px;
      border: none;
      box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.2);
      font-size: 20px;
    }

    .envelope-button:active {
      box-shadow: inset 0px 1px 3px rgba(167, 158, 158, 0.3);
      top: 71px;
    }

    .envelope {
      width: 235mm;
      height: 120mm;
      background-image: url(https://cdn.helloboss.com/system/print/envelope.png);
      background-size: cover;
      position: absolute;
      left: -12.5mm;
      top: -13mm;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.1s;
    }

    .window {
      position: absolute;
      left: 10.5mm;
      top: -1mm;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 91mm;
      height: 45mm;
      border-radius: 30px;
    }

    /* 用于指定仅在打印时才应用的CSS规则 */
    @media print {
      .print-button {
        display: none !important;
      }
      .envelope-button {
        display: none !important;
      }
      .wrap {
        margin-top: 0;
      }
      .envelope {
        display: none;
      }
      .window {
        /* 有助于减少不必要的颜色，从而节省墨水或增强可读性 */
        background-color: transparent !important;
      }
      .wrap {
        height: 297mm !important;
      }
      .wrap2 {
        /* 这可能是因为在正常情况下，该元素是隐藏的，但在打印时需要显示 */
        display: block !important;
      }
    }
  </style>

  <body>
    <div class="wrap" id="wrap">
      <div class="window" id="window">
        <div class="address">
          <!-- this.innerHTML=this.innerHTML 确保在元素失去焦点时，其 innerHTML 不会改变。这通常用于触发重新渲染或强制更新 -->
          <div id="input-addr" contenteditable="true" class="content" onblur="this.innerHTML=this.innerHTML">
            〒${corp.postCode} ${corp.prefectureName}${corp.cityName}<br />
            ${corp.streetNumber}<br />
            ${corp.name}<br />
            ${corpUser.position} ${bossApplyInfo.name}様<br />
          </div>
        </div>
      </div>
      <div class="code">${corp.bossApplyCode}</div>
      <div class="notice">認証コードは一企業一つで、複数メンバーで管理する場合は御社内でご共有お願いします。</div>
      <div class="envelope" id="envelope"></div>
    </div>
    <div class="wrap2" id="wrap2"></div>
    <button class="envelope-button" onclick="showHide()">✉️</button>
    <button class="print-button" onmousedown="document.getElementById('input-addr').blur()" onclick="window.print()">🖨️</button>
    <script>
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari) {
        alert('请使用Chrome浏览器打印');
      }
      function showHide() {
        window.show = !window.show;
        if (show) {
          document.getElementById('envelope').style.opacity = 1;
          document.getElementById('window').style.backgroundColor = '#f2f2f2';
          document.getElementById('wrap').style.height = '100mm';
          document.getElementById('wrap2').style.display = 'none';
        } else {
          document.getElementById('envelope').style.opacity = 0;
          document.getElementById('window').style.backgroundColor = '';
          document.getElementById('wrap').style.height = '297mm';
          document.getElementById('wrap2').style.display = 'none';
        }
      }
    </script>
  </body>
</html>
```
