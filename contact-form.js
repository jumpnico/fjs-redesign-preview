const contactCopy = {
  ja: {
    required: "必須",
    optional: "任意",
    inquiryType: "お問い合わせ種別",
    company: "会社名",
    department: "部署名",
    name: "お名前",
    furigana: "ふりがな",
    email: "メールアドレス",
    confirmEmail: "メールアドレス（確認用）",
    phone: "電話番号",
    postalCode: "郵便番号",
    prefecture: "都道府県",
    address: "住所",
    message: "お問い合わせ内容",
    privacyIntro: "プライバシーポリシーをご確認のうえ、同意いただける場合はチェックしてください。",
    privacyConsent: '<a href="/privacy/" target="_blank" rel="noopener">プライバシーポリシー</a>に同意する',
    reviewButton: "入力内容を確認する",
    confirmTitle: "お問い合わせ内容の確認",
    editButton: "修正する",
    submitButton: "送信する",
    sending: "送信中…",
    successTitle: "お問い合わせありがとうございます。",
    successBody: "お問い合わせを受け付けました。内容を確認のうえ、担当者よりご連絡いたします。",
    successButton: "ホームへ戻る",
    errorSubmit: "送信中にエラーが発生しました。お手数ですが、しばらくしてから再度お試しください。",
    errorRequired: "必須項目です。",
    errorEmail: "正しいメールアドレスを入力してください。",
    errorEmailMatch: "メールアドレスが一致していません。",
    errorPrivacy: "プライバシーポリシーへの同意が必要です。",
    errorCaptcha: "送信前に認証を完了してください。",
    options: ["商品について", "コラボレーション・お取引について", "OEM / ODMについて", "オンラインショップについて", "その他"],
    selectPlaceholder: "選択してください",
    overseas: "海外"
  },
  en: {
    required: "Required",
    optional: "Optional",
    inquiryType: "Inquiry Type",
    company: "Company Name",
    department: "Department",
    name: "Name",
    furigana: "Furigana",
    email: "Email Address",
    confirmEmail: "Confirm Email Address",
    phone: "Phone Number",
    postalCode: "Postal Code",
    prefecture: "Prefecture / State / Region",
    address: "Address",
    message: "Message",
    privacyIntro: "Please review our Privacy Policy and check the box below if you agree.",
    privacyConsent: 'I agree to the <a href="/privacy/" target="_blank" rel="noopener">Privacy Policy</a>.',
    reviewButton: "Review Your Information",
    confirmTitle: "Review Your Inquiry",
    editButton: "Edit",
    submitButton: "Submit",
    sending: "Sending…",
    successTitle: "Thank you for your inquiry.",
    successBody: "Your inquiry has been received. Our team will review your message and contact you shortly.",
    successButton: "Back to Home",
    errorSubmit: "An error occurred while sending your inquiry. Please try again later.",
    errorRequired: "This field is required.",
    errorEmail: "Please enter a valid email address.",
    errorEmailMatch: "Email addresses do not match.",
    errorPrivacy: "Please agree to the Privacy Policy.",
    errorCaptcha: "Please complete the captcha before submitting.",
    options: ["Product Inquiry", "Collaboration / Business Partnership", "OEM / ODM", "Online Shop", "Other"],
    selectPlaceholder: "Please select"
  }
};

const prefectures = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

const fields = [
  "inquiryType",
  "company",
  "department",
  "name",
  "furigana",
  "email",
  "phone",
  "postalCode",
  "prefecture",
  "address",
  "message"
];

function setupContactForm() {
  const form = document.querySelector("#inquiry-form");
  if (!form) return;

  const inputStep = form.querySelector('[data-form-step="input"]');
  const confirmStep = form.querySelector('[data-form-step="confirm"]');
  const successStep = form.querySelector("[data-form-success]");
  const status = form.querySelector("[data-form-status]");
  const submitButton = form.querySelector("[data-submit-button]");
  const confirmList = form.querySelector("[data-confirm-list]");

  function lang() {
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function copy() {
    return contactCopy[lang()];
  }

  function field(name) {
    return form.querySelector(`[data-field="${name}"]`);
  }

  function value(name) {
    if (name === "prefecture") {
      return lang() === "ja" ? field("prefectureJa").value.trim() : field("prefectureEn").value.trim();
    }
    if (name === "privacyConsent") return field(name).checked;
    return (field(name)?.value || "").trim();
  }

  function setError(name, message = "") {
    const node = form.querySelector(`[data-error-for="${name}"]`);
    if (!node) return;
    node.textContent = message;
  }

  function clearErrors() {
    form.querySelectorAll("[data-error-for]").forEach((node) => {
      node.textContent = "";
    });
    status.textContent = "";
  }

  function renderOptions() {
    const inquiry = field("inquiryType");
    const previous = inquiry.value;
    inquiry.innerHTML = `<option value="">${copy().selectPlaceholder}</option>${copy().options.map((option) => `<option value="${option}">${option}</option>`).join("")}`;
    inquiry.value = copy().options.includes(previous) ? previous : "";

    const prefecture = field("prefectureJa");
    const previousPrefecture = prefecture.value;
    prefecture.innerHTML = `<option value="">${copy().selectPlaceholder}</option>${prefectures.map((name) => `<option value="${name}">${name}</option>`).join("")}<option value="${copy().overseas}">${copy().overseas}</option>`;
    prefecture.value = prefectures.includes(previousPrefecture) || previousPrefecture === copy().overseas ? previousPrefecture : "";
  }

  function applyLanguage() {
    document.querySelectorAll("[data-contact-text]").forEach((node) => {
      node.textContent = copy()[node.dataset.contactText] || "";
    });
    document.querySelectorAll("[data-contact-html]").forEach((node) => {
      node.innerHTML = copy()[node.dataset.contactHtml] || "";
    });
    renderOptions();

    const isJa = lang() === "ja";
    const furiganaWrap = form.querySelector("[data-ja-only]");
    furiganaWrap.classList.toggle("is-hidden", !isJa);
    field("furigana").required = isJa;
    field("prefectureJa").classList.toggle("is-hidden", !isJa);
    field("prefectureEn").classList.toggle("is-hidden", isJa);
    field("prefectureJa").required = isJa;
    field("prefectureEn").required = !isJa;

    if (!confirmStep.classList.contains("is-hidden")) renderConfirmation();
  }

  function validate() {
    clearErrors();
    let ok = true;
    const requiredNames = ["inquiryType", "company", "name", "email", "confirmEmail", "phone", "prefecture", "message"];
    if (lang() === "ja") requiredNames.push("furigana");

    requiredNames.forEach((name) => {
      if (!value(name)) {
        setError(name === "confirmEmail" ? "confirmEmail" : name, copy().errorRequired);
        ok = false;
      }
    });

    if (value("email") && !field("email").validity.valid) {
      setError("email", copy().errorEmail);
      ok = false;
    }

    if (value("confirmEmail") && value("email") !== value("confirmEmail")) {
      setError("confirmEmail", copy().errorEmailMatch);
      ok = false;
    }

    if (!value("privacyConsent")) {
      setError("privacyConsent", copy().errorPrivacy);
      ok = false;
    }

    return ok;
  }

  function renderConfirmation() {
    const rows = fields
      .filter((name) => lang() === "ja" || name !== "furigana")
      .filter((name) => value(name))
      .map((name) => `
        <div>
          <dt>${contactCopy[lang()][name]}</dt>
          <dd>${escapeHtml(value(name)).replaceAll("\n", "<br>")}</dd>
        </div>
      `);
    confirmList.innerHTML = rows.join("");
  }

  function getCaptchaToken() {
    return form.querySelector('[name="h-captcha-response"]')?.value || "";
  }

  function buildPayload() {
    const payload = new FormData();
    payload.append("access_key", "5df7b702-dafc-4cd9-b053-1755bfb4cad8");
    payload.append("subject", `FJSI Contact Form - ${value("inquiryType")}`);
    payload.append("from_name", value("name"));
    payload.append("email", value("email"));
    payload.append("replyto", value("email"));
    payload.append("Inquiry Type", value("inquiryType"));
    payload.append("Company Name", value("company"));
    if (value("department")) payload.append("Department", value("department"));
    payload.append("Name", value("name"));
    if (lang() === "ja" && value("furigana")) payload.append("Furigana", value("furigana"));
    payload.append("Email Address", value("email"));
    payload.append("Phone Number", value("phone"));
    if (value("postalCode")) payload.append("Postal Code", value("postalCode"));
    payload.append("Prefecture / Region", value("prefecture"));
    if (value("address")) payload.append("Address", value("address"));
    payload.append("Message", value("message"));
    payload.append("h-captcha-response", getCaptchaToken());
    return payload;
  }

  form.querySelector("[data-review-button]").addEventListener("click", () => {
    if (!validate()) return;
    renderConfirmation();
    inputStep.classList.add("is-hidden");
    confirmStep.classList.remove("is-hidden");
    confirmStep.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.querySelector("[data-edit-button]").addEventListener("click", () => {
    confirmStep.classList.add("is-hidden");
    inputStep.classList.remove("is-hidden");
    inputStep.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();
    if (!getCaptchaToken()) {
      setError("captcha", copy().errorCaptcha);
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = copy().sending;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: buildPayload()
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Submission failed");

      confirmStep.classList.add("is-hidden");
      successStep.classList.remove("is-hidden");
      status.textContent = "";
      form.reset();
      successStep.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      status.textContent = copy().errorSubmit;
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = copy().submitButton;
    }
  });

  window.addEventListener("fjs-language-change", applyLanguage);
  applyLanguage();
}

setupContactForm();
