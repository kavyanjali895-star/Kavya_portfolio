(() => {
  "use strict";

  const links = [["Home","home"],["About Me","about"],["Interests","interests"],["Learning Journey","journey"],["Future Goals","future"],["Contact","contact"]];
  const menuButton = document.querySelector(".mobile-toggle");
  const headerInner = document.querySelector(".header-inner");

  if (menuButton && headerInner) {
    const nav = document.createElement("nav");
    nav.id = "mobile-nav";
    nav.className = "mobile-nav";
    nav.setAttribute("aria-label", "Mobile navigation");
    nav.hidden = true;

    links.forEach(([label, id]) => {
      const link = document.createElement("a");
      link.href = "#" + id;
      link.textContent = label;
      link.addEventListener("click", () => setMenu(false));
      nav.appendChild(link);
    });
    headerInner.insertAdjacentElement("afterend", nav);

    function setMenu(open) {
      nav.hidden = !open;
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      menuButton.innerHTML = open
        ? '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>'
        : '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"></path><path d="M4 12h16"></path><path d="M4 19h16"></path></svg>';
    }
    menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") setMenu(false); });
    window.addEventListener("resize", () => { if (window.innerWidth > 850) setMenu(false); });
  }

  const stages = [
    ["FOUNDATION","Building the Foundation",[
      "Strengthen core biotechnology concepts.",
      "Develop a sound understanding of biology and chemistry.",
      "Explore fundamental laboratory and scientific research methods through coursework."
    ]],
    ["EXPLORATION","Exploring Interdisciplinary Skills",[
      "Begin exploring computational biology and bioinformatics tools.",
      "Learn introductory data analysis and relevant programming concepts.",
      "Understand the fundamentals of food processing, quality, and pharmaceutical research."
    ]],
    ["APPLICATION","Applying Scientific Knowledge",[
      "Work toward academic and personal projects.",
      "Explore suitable internships and research opportunities.",
      "Build a portfolio of verified projects, practical learning, and future achievements."
    ]]
  ];

  const tabs = Array.from(document.querySelectorAll(".roadmap-tab"));
  const panel = document.querySelector("#stage-panel");

  function selectStage(index, focus) {
    if (!stages[index] || !panel) return;
    tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.classList.toggle("selected", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    const activeTab = tabs[index];
    panel.setAttribute("aria-labelledby", activeTab.id);
    panel.querySelector(".small-kicker").textContent = "STAGE 0" + (index + 1) + " · LEARNING GOALS";
    panel.querySelector("h3").textContent = stages[index][1];
    panel.querySelector("ul").replaceChildren(...stages[index][2].map((point) => {
      const item = document.createElement("li");
      const marker = document.createElement("span");
      const text = document.createElement("p");
      text.textContent = point;
      item.append(marker, text);
      return item;
    }));
    if (focus) activeTab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectStage(index, false));
    tab.addEventListener("keydown", (event) => {
      let next = index;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      selectStage(next, true);
    });
  });
  if (tabs.length) selectStage(0, false);

  const form = document.querySelector(".contact-form");
  if (form) {
    const fields = ["name","email","subject","message"];
    const limits = {name:100,email:255,subject:150,message:3000};

    function errorFor(name, value) {
      const valueTrimmed = value.trim();
      if (!valueTrimmed) return ({
        name:"Please enter your name.",
        email:"Please enter a valid email address.",
        subject:"Please enter a subject.",
        message:"Please write your message."
      })[name];
      if (valueTrimmed.length > limits[name]) return "Please keep this under " + limits[name] + " characters.";
      if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueTrimmed)) return "Please enter a valid email address.";
      return "";
    }

    function showFieldError(field, message) {
      const wrapper = field.closest(".field");
      let error = wrapper.querySelector(".field-error");
      field.setAttribute("aria-invalid", String(Boolean(message)));
      if (message) {
        if (!error) {
          error = document.createElement("span");
          error.className = "field-error";
          error.id = field.id + "-error";
          wrapper.appendChild(error);
        }
        error.textContent = message;
        field.setAttribute("aria-describedby", error.id);
      } else {
        if (error) error.remove();
        field.removeAttribute("aria-describedby");
      }
    }

    fields.forEach((name) => {
      const field = form.elements.namedItem(name);
      field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") showFieldError(field, errorFor(name, field.value));
      });
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      fields.forEach((name) => {
        const field = form.elements.namedItem(name);
        const message = errorFor(name, field.value);
        showFieldError(field, message);
        if (message) valid = false;
      });
      if (!valid) {
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      const subject = encodeURIComponent(form.elements.namedItem("subject").value.trim());
      const body = encodeURIComponent(
        "Name: " + form.elements.namedItem("name").value.trim() +
        "\nEmail: " + form.elements.namedItem("email").value.trim() +
        "\n\n" + form.elements.namedItem("message").value.trim()
      );
      window.location.href = "mailto:kavyanjali895@gmail.com?subject=" + subject + "&body=" + body;
    });
  }
})();
