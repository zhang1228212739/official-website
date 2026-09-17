

document.addEventListener("DOMContentLoaded", function () {

  // =======================================
  // 获取语言按钮
  // =======================================

  const buttons = document.querySelectorAll("[data-language]");

  // =======================================
  // 语言配置
  // =======================================

  const languageConfig = {
    ja: {
      bodyClass: "lang-ja",
      htmlLang: "ja"
    },

    zh: {
      bodyClass: "lang-cn",
      htmlLang: "zh-CN"
    },

    en: {
      bodyClass: "lang-en",
      htmlLang: "en"
    }
  };


  // =======================================
  // 切换语言
  // =======================================

  function changeLanguage(lang) {

    // 如果传入的语言不存在
    // 自动回到日语

    if (!languageConfig[lang]) {
      lang = "ja";
    }


    const config = languageConfig[lang];


    // =====================================
    // 清除旧语言
    // =====================================

    document.body.classList.remove(
      "lang-ja",
      "lang-cn",
      "lang-en"
    );


    // =====================================
    // 添加当前语言
    // =====================================

    document.body.classList.add(
      config.bodyClass
    );


    // =====================================
    // 修改 HTML lang 属性
    // =====================================

    document.documentElement.setAttribute(
      "lang",
      config.htmlLang
    );


    // =====================================
    // 更新按钮状态
    // =====================================

    buttons.forEach(function (button) {

      button.classList.remove("active");

      if (
        button.dataset.language === lang
      ) {

        button.classList.add("active");

      }

    });


    // =====================================
    // 保存语言
    // =====================================

    localStorage.setItem(
      "language",
      lang
    );

  }


  // =======================================
  // 点击语言按钮
  // =======================================

  buttons.forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const lang =
          this.getAttribute("data-language");

        changeLanguage(lang);

      }
    );

  });


  // =======================================
  // 读取之前保存的语言
  // =======================================

  const savedLanguage =
    localStorage.getItem("language");


  // =======================================
  // 初始化
  // =======================================

  if (
    savedLanguage &&
    languageConfig[savedLanguage]
  ) {

    changeLanguage(
      savedLanguage
    );

  } else {

    changeLanguage("ja");

  }

});
