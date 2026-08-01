console.log("Hi mate, go watch Spiderman Brand new day");

const COMPOSE_SELECTORS = [
  'div[aria-label="Message Body"][contenteditable="true"]',
  'div[role="textbox"][contenteditable="true"][g_editable="true"]',
  '.Am.Al.editable[contenteditable="true"]',
  '.editable[g_editable="true"]',
].join(", ");

const detectedComposeElements = new WeakSet();

function getEmailContent() {
  const selectors = [
    ".h7",
    ".gmail_quote",
    '[role="presentation"]',
    ".a3s.aiL",
  ];

  for (const selector of selectors) {
    const content = document.querySelector(selector);
    if (content) {
      return content.innerText.trim();
    }
    return "";
  }
}

function findComposeToolBar() {
  const selectors = [".btC", ".aDh", '[role="toolbar"]', ".gU.Up"];

  for (const selector of selectors) {
    const toolbar = document.querySelector(selector);
    if (toolbar) {
      return toolbar;
    }
    return null;
  }
}

function createAIButton() {
  const btn = document.createElement("div");
  btn.className = "T-I J-J5-Ji aoO v7 T-I-atl L3";
  btn.style.marginRight = "8px";
  btn.innerHTML = "AI Reply";
  btn.setAttribute("role", "button");
  btn.setAttribute("data-tooltip", "Generate AI Reply");
  return btn;
}

function injectButton() {
  const existingButton = document.querySelector(".ai-reply-btn");
  if (existingButton) {
    existingButton.remove();
  }
  const toolBar = findComposeToolBar();
  if (!toolBar) {
    console.log("Toolbar not found");
    return;
  }

  console.log("Creating AI button");
  const btn = createAIButton();
  btn.classList.add("ai-reply-btn");

  btn.addEventListener("click", async () => {
    try {
      btn.innerHTML = "Generating...";
      btn.disabled = true;

      const emailContent = getEmailContent();
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: emailContent,
          tone: "Friendly",
        })
      });

      if(!response.ok){
        throw new Error('API Request Failed!');
      }
      const generetedReply = await response.text();
      const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

      if(composeBox){
        composeBox.focus();
        document.execCommand('insertText', false, generetedReply);
      }else{
        console.error('Compose Box not found');
      }
    } catch (error) {
        console.error(error);
        alert('Failed to generate a reply');
    }finally{
        btn.innerHTML = 'AI Reply';
        btn.disabled = false;
    }
  });

  toolBar.insertBefore(btn, toolBar.firstChild);
}

function findComposeElement(root) {
  if (!root) {
    return null;
  }

  if (root instanceof Element && root.matches(COMPOSE_SELECTORS)) {
    return root;
  }

  if (typeof root.querySelector === "function") {
    return root.querySelector(COMPOSE_SELECTORS);
  }

  return null;
}

function handleComposeElement(composeElement) {
  if (!composeElement || detectedComposeElements.has(composeElement)) {
    return;
  }

  detectedComposeElements.add(composeElement);
  console.log("Compose window detected");
  setTimeout(injectButton, 500);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const candidateNodes = [
      mutation.target,
      ...Array.from(mutation.addedNodes),
    ];

    for (const node of candidateNodes) {
      const composeElement = findComposeElement(node);

      if (composeElement) {
        handleComposeElement(composeElement);
      }
    }
  }
});

handleComposeElement(findComposeElement(document));

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: [
    "aria-label",
    "class",
    "contenteditable",
    "g_editable",
    "role",
  ],
});
