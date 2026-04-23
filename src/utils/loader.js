export function showLoader() {
  if (document.getElementById("NotiflixLoadingWrap")) {
    return;
  }
  const loader = document.createElement("div");
  loader.id = 'NotiflixLoadingWrap';
  loader.innerHTML = `
      <html>
    <head>
        <style>
        .ngx-overlay.loading-foreground[_ngcontent-ng-c1591448945], .ngx-overlay.foreground-closing[_ngcontent-ng-c1591448945] {
          display: block;
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99998!important;
          background-color: #282828cc;
          cursor: progress;
          display: none;
      }
      .center-center[_ngcontent-ng-c1591448945] {
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99998!important;
          background-color: #282828cc;
          cursor: progress;
          display: none;
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] > .ngx-loading-text[_ngcontent-ng-c1591448945] {
          position: fixed;
          margin: 0;
          font-family: sans-serif;
          font-weight: 400;
          font-size: 1.2em;
          color: #fff;
      }
      .center-center[_ngcontent-ng-c1591448945] {
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99998!important;
          background-color: #282828cc;
          cursor: progress;
          display: none;
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] {
          width: 100%;
          height: 100%;
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] > .ngx-foreground-spinner[_ngcontent-ng-c1591448945] {
          position: fixed;
          width: 60px;
          height: 60px;
          margin: 0;
          color: #00acc1;
      }
      .ngx-overlay[_ngcontent-ng-c1591448945] {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 99998!important;
          background-color: #282828cc;
          cursor: progress;
          display: none;
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945]:nth-child(1) {
          left: 0%;
          top: 0%;
          animation: _ngcontent-ng-c1591448945_sk-threeStrings-rotateOne 1s linear infinite;
          border-bottom: 6px solid currentColor;
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945] {
          position: absolute;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 50%;
      }
      @keyframes _ngcontent-ng-c1591448945_sk-threeStrings-rotateOne{
      0% {
          transform: rotateX(35deg) rotateY(-45deg) rotate(0);
      }

      100% {
          transform: rotateX(35deg) rotateY(-45deg) rotate(360deg);
      }
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945]:nth-child(2) {
          right: 0%;
          top: 0%;
          animation: _ngcontent-ng-c1591448945_sk-threeStrings-rotateTwo 1s linear infinite;
          border-right: 6px solid currentColor;
      }
      @keyframes _ngcontent-ng-c1591448945_sk-threeStrings-rotateTwo{
      0% {
          transform: rotateX(50deg) rotateY(10deg) rotate(0);
      }
      100% {
          transform: rotateX(50deg) rotateY(10deg) rotate(360deg);
      }
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945] {
          position: absolute;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 50%;
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945]:nth-child(3) {
          right: 0%;
          bottom: 0%;
          animation: _ngcontent-ng-c1591448945_sk-threeStrings-rotateThree 1s linear infinite;
          border-top: 6px solid currentColor;
      }
      @keyframes _ngcontent-ng-c1591448945_sk-threeStrings-rotateThree{
      0% {
          transform: rotateX(35deg) rotateY(55deg) rotate(0);
      }
      100% {
          transform: rotateX(35deg) rotateY(55deg) rotate(360deg);
      }
      }
      .sk-three-strings[_ngcontent-ng-c1591448945] > div[_ngcontent-ng-c1591448945] {
          position: absolute;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          border-radius: 50%;
      }
        </style>
    </head>
    <body>
    <div _ngcontent-ng-c1591448945="" class="ngx-overlay loading-foreground" style="background-color: rgb(92 90 90 / 80%);border-radius: 0px;"><!--bindings={
      "ng-reflect-ng-if": ""
    }--><div _ngcontent-ng-c1591448945="" class="ngx-foreground-spinner center-center" ng-reflect-ng-class="center-center" style="color: #8b0305; width: 110px; height: 110px; top: calc(50% - 24px);"><div _ngcontent-ng-c1591448945="" class="sk-three-strings"><div _ngcontent-ng-c1591448945=""></div><div _ngcontent-ng-c1591448945=""></div><div _ngcontent-ng-c1591448945=""></div><!--bindings={
      "ng-reflect-ng-for-of": "1,1,1"
    }--></div><!--bindings={
      "ng-reflect-ng-if-else": "[object Object]"
    }--><!--container--></div><div _ngcontent-ng-c1591448945="" class="ngx-loading-text center-center" ng-reflect-ng-class="center-center" style="top: calc(50% + 67px); color: rgb(255, 255, 255);"><span _ngcontent-ng-c1591448945=""></span></div></div>
    </body>
    </html>
`;
  document.body.appendChild(loader);
}

export function hideLoader() {
  const loader = document.getElementById("NotiflixLoadingWrap");
  if (loader) {
    loader.remove();
  }
}
