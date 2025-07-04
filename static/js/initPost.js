
// console.log("postInit.js loaded");
var scriptMd5 = document.createElement("script");
scriptMd5.src = "/js/md5.js";
document.head.appendChild(scriptMd5);

scriptMd5.onload = function () {
  // console.log("md5.js loaded")
  // step1. sythx highlighting
  syntaxHighlight();
  // step2. lazyload
  initLazyLoad();
}

function initLazyLoad() {
  var script = document.createElement("script");
  script.src = "/js/animation.js";
  document.head.appendChild(script);

  script.onload = function () {
    // console.log("lazyload.js loaded");

    animationElementName = ".image-load";

    // Hook the loadImage function
    loadImage = (index) => {
      if (index >= imageElements.length) return;

      let image = imageElements[index];
      image.src = image.dataset.src;
      let img = new Image();
      img.src = image.src;

      // if the image is loaded or not loaded, load the next image
      img.onload = function () {
        loadImage(index + 1);
      };
      img.onerror = function () {
        loadImage(index + 1);
      }
    }

    loadAnimation = (item) => {
      if(item.classList.contains("image-loaded")) return;
      let grandSon = item.children[0].children[0];
      let img = new Image();
      img.src = grandSon.src;
      let sign = md5(grandSon.src);

      img.onload = function () {
        let percent = ((img.height / img.width) * 100).toFixed(5);
        var style = document.createElement("style");
        style.innerHTML = renderStyle(sign, percent);
        let target = document.getElementById(`lht${sign}`)

        if (!target) return;
        target.parentNode.insertBefore(style, target);
        item.classList.remove("image-load");
        item.classList.add("image-loaded");
      }

    }

    initImage();
  };
}


function renderStyle(sign, percent) {
  return `
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
  }

  @media only screen and (max-width: 1068px) {
      .image-${sign} {
      width: 100%;
      padding-top: ${percent}%;
      height: auto;
    }
  }

  @media only screen and (max-width: 734px) {
    .image-${sign} {
    width: 100%;
    padding-top: ${percent}%;
    height: auto;
  }
  };`
}

function syntaxHighlight() {
  var script = document.createElement("script");
  script.src = "//cdn.staticfile.org/highlight.js/11.7.0/highlight.min.js";
  document.head.appendChild(script);

  var styleLight = document.createElement("link");
  styleLight.rel = "stylesheet";
  styleLight.href = "//cdn.staticfile.org/highlight.js/11.7.0/styles/stackoverflow-light.min.css";

  var styleDark = document.createElement("link");
  styleDark.rel = "stylesheet";
  styleDark.href = "//cdn.staticfile.org/highlight.js/11.7.0/styles/stackoverflow-dark.min.css";

  if (document.querySelector("body").classList.contains("theme-dark")) {
    document.head.appendChild(styleDark);
  } else {
    document.head.appendChild(styleLight);
  }

  script.onload = function () {
    hljs.configure({
      ignoreUnescapedHTML: true
    });
    document.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });
  };
}
