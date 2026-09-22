(function () {
  const dict = {
    en: {
      nav_maison: "Maison",
      nav_auto: "Automobiles",
      nav_watches: "Watches",
      nav_services: "Services",
      nav_approach: "Approach",
      nav_mail: "Correspondence",
      footer_left: "Valeris",
      footer_right: "Private brokerage · France & Europe",
      form_name: "Name",
      form_place: "City / country",
      form_interest: "Interest",
      form_role: "Position",
      form_note: "Note",
      form_opt_car: "Automobile",
      form_opt_watch: "Watch",
      form_opt_both: "Both",
      form_opt_buy: "Buyer",
      form_opt_sell: "Seller",
      form_opt_intro: "Introduction",
      form_send: "Prepare enquiry",
      form_need: "Required.",
      form_ok:
        "Nothing has been sent. Your enquiry is copied below for a private channel of your choosing. Correspondence details are not published on this site.",
    },
    fr: {
      nav_maison: "Maison",
      nav_auto: "Automobiles",
      nav_watches: "Montres",
      nav_services: "Services",
      nav_approach: "Approche",
      nav_mail: "Correspondance",
      footer_left: "Valeris",
      footer_right: "Courtage privé · France & Europe",
      form_name: "Nom",
      form_place: "Ville / pays",
      form_interest: "Intérêt",
      form_role: "Position",
      form_note: "Note",
      form_opt_car: "Automobile",
      form_opt_watch: "Montre",
      form_opt_both: "Les deux",
      form_opt_buy: "Acheteur",
      form_opt_sell: "Vendeur",
      form_opt_intro: "Introduction",
      form_send: "Préparer la demande",
      form_need: "Obligatoire.",
      form_ok:
        "Rien n’a été transmis. Votre demande est recopiée ci-dessous pour le canal privé de votre choix. Les coordonnées de correspondance ne sont pas publiées sur ce site.",
    },
  };

  const page = document.body.dataset.page || "";
  const links = [
    { href: "index.html", key: "nav_maison", id: "home" },
    { href: "automobiles.html", key: "nav_auto", id: "automobiles" },
    { href: "montres.html", key: "nav_watches", id: "watches" },
    { href: "services.html", key: "nav_services", id: "services" },
    { href: "approche.html", key: "nav_approach", id: "approach" },
    { href: "correspondance.html", key: "nav_mail", id: "mail" },
  ];

  function lang() {
    return localStorage.getItem("valeris-lang") === "fr" ? "fr" : "en";
  }

  function setLang(next) {
    localStorage.setItem("valeris-lang", next);
    document.documentElement.lang = next;
    applyCopy();
    renderChrome();
  }

  function applyCopy() {
    const t = dict[lang()];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    document.querySelectorAll("[data-lang]").forEach((el) => {
      el.hidden = el.getAttribute("data-lang") !== lang();
    });
  }

  function navMarkup(mobile) {
    return links
      .map((item) => {
        const current = item.id === page ? ' aria-current="page"' : "";
        return `<a href="${item.href}"${current} data-i18n="${item.key}">${dict[lang()][item.key]}</a>`;
      })
      .join(mobile ? "" : "");
  }

  function renderChrome() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const t = dict[lang()];
    if (header) {
      header.innerHTML = `
        <a class="brand" href="index.html">VALERIS</a>
        <nav class="nav-desktop" aria-label="Primary">${navMarkup(false)}</nav>
        <div class="nav-meta">
          <div class="lang-wrap">
            <button type="button" class="lang ${lang() === "fr" ? "is-active" : ""}" data-set-lang="fr">FR</button>
            <span>|</span>
            <button type="button" class="lang ${lang() === "en" ? "is-active" : ""}" data-set-lang="en">EN</button>
          </div>
          <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="nav-mobile">Menu</button>
        </div>
      `;
      let mobile = document.getElementById("nav-mobile");
      if (!mobile) {
        mobile = document.createElement("nav");
        mobile.id = "nav-mobile";
        mobile.className = "nav-mobile";
        mobile.setAttribute("aria-label", "Primary");
        header.insertAdjacentElement("afterend", mobile);
      }
      mobile.innerHTML = navMarkup(true);
    }
    if (footer) {
      footer.innerHTML = `<span>${t.footer_left}</span><span>${t.footer_right}</span>`;
    }
  }

  function bindHeader() {
    const header = document.getElementById("site-header");
    if (!header) return;
    header.addEventListener("click", (event) => {
      const langBtn = event.target.closest("[data-set-lang]");
      if (langBtn) {
        setLang(langBtn.getAttribute("data-set-lang"));
        return;
      }
      const toggle = event.target.closest(".menu-toggle");
      if (toggle) {
        const menu = document.getElementById("nav-mobile");
        const open = menu.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
        toggle.textContent = open ? "Close" : "Menu";
      }
    });
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function bindForm() {
    const form = document.getElementById("enquiry-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const t = dict[lang()];
      const fields = ["name", "place", "note"];
      let valid = true;
      fields.forEach((id) => {
        const input = form.querySelector("#" + id);
        const err = form.querySelector('[data-error="' + id + '"]');
        const empty = !input.value.trim();
        err.textContent = empty ? t.form_need : "";
        if (empty) valid = false;
      });
      const status = document.getElementById("form-status");
      const preview = document.getElementById("enquiry-preview");
      if (!valid) {
        status.textContent = "";
        preview.hidden = true;
        return;
      }
      const payload = [
        "VALERIS — private enquiry",
        "Name: " + form.name.value.trim(),
        "Place: " + form.place.value.trim(),
        "Interest: " + form.interest.value,
        "Position: " + form.role.value,
        "Note:",
        form.note.value.trim(),
      ].join("\n");
      preview.hidden = false;
      preview.textContent = payload;
      status.textContent = t.form_ok;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(payload).catch(() => {});
      }
    });
  }

  document.documentElement.lang = lang();
  renderChrome();
  applyCopy();
  bindHeader();
  bindForm();
})();
