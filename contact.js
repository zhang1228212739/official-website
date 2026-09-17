document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const body = document.body;

  const methodInputs = document.querySelectorAll(
    'input[name="contact-method"]'
  );

  const dynamicFields = {
    email: document.getElementById("email-field"),
    phone: document.getElementById("phone-field"),
    line: document.getElementById("line-field"),
    wechat: document.getElementById("wechat-field")
  };

  const contactInputs = {
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    line: document.getElementById("line"),
    wechat: document.getElementById("wechat")
  };

  const countrySelect = document.getElementById("country-select");
  const countryTrigger = document.getElementById("country-select-trigger");
  const countryDropdown = document.getElementById("country-dropdown");
  const countrySearch = document.getElementById("country-search");
  const countryOptions = document.querySelectorAll(".country-option");
  const nationalityInput = document.getElementById("nationality");
  const countrySelectedText = document.getElementById("country-selected-text");

  const messages = {
    ja: {
      name: "お名前を入力してください。",
      method: "連絡方法を選択してください。",
      email: "正しいメールアドレスを入力してください。",
      phone: "正しい電話番号を入力してください。",
      line: "LINE IDを入力してください。",
      wechat: "WeChat IDを入力してください。",
      inquiry: "ご相談内容を入力してください。",
      privacy: "個人情報保護方針に同意してください。"
    },
    cn: {
      name: "请输入姓名。",
      method: "请选择联系方式。",
      email: "请输入正确的邮箱地址。",
      phone: "请输入正确的电话号码。",
      line: "请输入 LINE ID。",
      wechat: "请输入微信号。",
      inquiry: "请输入咨询内容。",
      privacy: "请同意隐私政策。"
    },
    en: {
      name: "Please enter your name.",
      method: "Please select a contact method.",
      email: "Please enter a valid email address.",
      phone: "Please enter a valid phone number.",
      line: "Please enter your LINE ID.",
      wechat: "Please enter your WeChat ID.",
      inquiry: "Please enter your inquiry.",
      privacy: "Please agree to the Privacy Policy."
    }
  };

  function getLanguage() {
    if (body.classList.contains("lang-cn")) return "cn";
    if (body.classList.contains("lang-en")) return "en";
    return "ja";
  }

  function updatePlaceholders() {
    const lang = getLanguage();

    document.querySelectorAll("[data-placeholder-ja]").forEach((element) => {
      const key = `placeholder${lang.charAt(0).toUpperCase()}${lang.slice(1)}`;
      element.placeholder = element.dataset[key];
    });

    if (!nationalityInput.value) {
      countrySelectedText.textContent = countrySelectedText.dataset[lang];
    }
  }

  function openCountryDropdown() {
    countryDropdown.hidden = false;
    countryTrigger.setAttribute("aria-expanded", "true");
    countrySearch.value = "";

    countryOptions.forEach((option) => {
      option.hidden = false;
    });

    countrySearch.focus();
  }

  function closeCountryDropdown() {
    countryDropdown.hidden = true;
    countryTrigger.setAttribute("aria-expanded", "false");
  }

  countryTrigger.addEventListener("click", () => {
    if (countryDropdown.hidden) {
      openCountryDropdown();
    } else {
      closeCountryDropdown();
    }
  });

  countrySearch.addEventListener("input", () => {
    const keyword = countrySearch.value.trim().toLowerCase();

    countryOptions.forEach((option) => {
      option.hidden = !option.textContent.toLowerCase().includes(keyword);
    });
  });

  countryOptions.forEach((option) => {
    option.addEventListener("click", () => {
      nationalityInput.value = option.dataset.value;
      countrySelectedText.textContent = option.textContent;
      countryOptions.forEach((item) => item.classList.remove("is-selected"));
      option.classList.add("is-selected");
      closeCountryDropdown();
    });
  });

  document.addEventListener("click", (event) => {
    if (!countrySelect.contains(event.target)) {
      closeCountryDropdown();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeCountryDropdown();
    }
  });

  function clearError(id) {
    const error = document.getElementById(`${id}-error`);
    const group = error?.closest(
      ".form-group, .contact-method-group, .privacy-group"
    );

    if (error) error.textContent = "";
    if (group) group.classList.remove("has-error");
  }

  function showError(id, text) {
    const error = document.getElementById(`${id}-error`);
    const group = error?.closest(
      ".form-group, .contact-method-group, .privacy-group"
    );

    if (error) error.textContent = text;
    if (group) group.classList.add("has-error");
  }

  function updateContactField() {
    const selected = document.querySelector(
      'input[name="contact-method"]:checked'
    );

    Object.entries(dynamicFields).forEach(([method, field]) => {
      const input = contactInputs[method];
      const isSelected = selected && selected.value === method;

      field.hidden = !isSelected;
      input.disabled = !isSelected;
      input.required = isSelected;

      if (!isSelected) {
        input.value = "";
        clearError(method);
      }
    });

    clearError("contact-method");
  }

  methodInputs.forEach((input) => {
    input.addEventListener("change", updateContactField);
  });

  form.addEventListener("submit", (event) => {
    const lang = getLanguage();
    const text = messages[lang];
    let isValid = true;

    [
      "name",
      "contact-method",
      "email",
      "phone",
      "line",
      "wechat",
      "inquiry",
      "privacy"
    ].forEach(clearError);

    const name = document.getElementById("name");
    const inquiry = document.getElementById("inquiry");
    const privacy = document.getElementById("privacy");
    const selectedMethod = document.querySelector(
      'input[name="contact-method"]:checked'
    );

    if (!name.value.trim()) {
      showError("name", text.name);
      isValid = false;
    }

    if (!selectedMethod) {
      showError("contact-method", text.method);
      isValid = false;
    } else {
      const method = selectedMethod.value;
      const value = contactInputs[method].value.trim();

      if (!value) {
        showError(method, text[method]);
        isValid = false;
      } else if (
        method === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        showError("email", text.email);
        isValid = false;
      } else if (
        method === "phone" &&
        value.replace(/[^\d]/g, "").length < 6
      ) {
        showError("phone", text.phone);
        isValid = false;
      }
    }

    if (!inquiry.value.trim()) {
      showError("inquiry", text.inquiry);
      isValid = false;
    }

    if (!privacy.checked) {
      showError("privacy", text.privacy);
      isValid = false;
    }

    if (!isValid) {
      event.preventDefault();

      const firstError = document.querySelector(".has-error");
      firstError?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });

  const languageObserver = new MutationObserver(updatePlaceholders);

  languageObserver.observe(body, {
    attributes: true,
    attributeFilter: ["class"]
  });

  updatePlaceholders();
  updateContactField();
});