document.addEventListener("DOMContentLoaded", () => {

//fetch the profile picture and name of artist
(async () => {
  const artistId = new URLSearchParams(location.search).get("artistId");
  if (!artistId) return;

  try {
    const res  = await fetch(`https://atelier-0adu.onrender.com/products/artistId/${artistId}`);
    const list = await res.json();
    if (!Array.isArray(list) || !list.length) return;

    const artist = list[0].artist;
    if (!artist) return;

    // الاسم
    const nameP = document.querySelector(".artist-name p");
    if (nameP) nameP.textContent = artist.username || artist.name || "Artist";

    
    const box = document.querySelector(".profile-picture");
    if (box && artist.profilePic) {
      let img = box.querySelector("img");
      if (!img) { img = document.createElement("img"); img.alt = "artist"; box.appendChild(img); }
      img.src = artist.profilePic;
    }
  } catch (e) {
    console.error("Artist fetch failed:", e);
  }
})();




  // Gift Message Show/Hide
  const yesRadio = document.getElementById("gift-yes");
  const noRadio  = document.getElementById("gift-no");
  const msgBox   = document.getElementById("gift-message-box");
  if (yesRadio && noRadio && msgBox) {
    msgBox.style.display = yesRadio.checked ? "flex" : "none";
    yesRadio.addEventListener("change", () => (msgBox.style.display = "flex"));
    noRadio.addEventListener("change", () => (msgBox.style.display = "none"));
  }

  const person  = document.querySelector(".Person-Details-div");
  const order   = document.querySelector(".Order-Details");
  const summary = document.querySelector(".Summary-Details");

  const next1 = document.querySelector(".Person-Details-div .next-button");   
  const back1 = document.querySelector(".Order-Details .back-button");        
  const next2 = document.querySelector(".Order-Details .next-button");        
  const back2 = document.querySelector(".Summary-Details .back-button");      

  if (order)   order.classList.add("hidden");
  if (summary) summary.classList.add("hidden");

  // Progress
  const line1 = document.getElementById("line1");
  const line2 = document.getElementById("line2");
  const orderIcon   = document.querySelector(".order-icon");
  const summaryIcon = document.querySelector(".summery-icon");

  const goToOrder = () => {
    person.classList.add("hidden");
    order.classList.remove("hidden");
    line1?.classList.add("line-active");
    orderIcon?.classList.add("step-active");
  };
  const backToPerson = () => {
    order.classList.add("hidden");
    person.classList.remove("hidden");
    line1?.classList.remove("line-active");
    orderIcon?.classList.remove("step-active");
  };
  const goToSummary = () => {
    order.classList.add("hidden");
    summary.classList.remove("hidden");
    line2?.classList.add("line-active");
    summaryIcon?.classList.add("step-active");
  };
  const backToOrder = () => {
    summary.classList.add("hidden");
    order.classList.remove("hidden");
    line2?.classList.remove("line-active");
    summaryIcon?.classList.remove("step-active");
  };

  // stats
  const formState = {
    
    type: "",
    dimensions: "",
    description: "",
    attachmentFile: null,

    
    phone: "",
    country: "",
    city: "",
    isGift: "no",
    giftMessage: ""
  };

  // save info 
  function orderPage() {
    formState.type        = document.getElementById("options")?.value || "";
    formState.dimensions  = document.getElementById("dimension")?.value?.trim() || "";
    formState.attachmentFile = document.getElementById("upload-file")?.files?.[0] || null;
    formState.description = document.getElementById("description")?.value || "";
    console.log("Order Saved:", formState);
  }

  //save info
  function personPage() {
    formState.phone   = document.getElementById("phone")?.value?.trim() || "";
    formState.country = document.getElementById("coun")?.value?.trim() || "";
    formState.city    = document.getElementById("cit")?.value?.trim() || "";
    const gift = document.querySelector('input[name="gift"]:checked');
    if (gift) formState.isGift = gift.value;
    formState.giftMessage = document.getElementById("gift-message")?.value || "";
    console.log("Person Saved:", formState);
  }

  // show all info
  function showSummary() {
  const box = document.getElementById("all-description");
  if (!box) return;

  const attachmentName = formState.attachmentFile ? formState.attachmentFile.name : "No attachment";

  const giftMsg = (formState.isGift === "yes")
    ? `Gift: Yes\nMessage: ${formState.giftMessage}`
    : `Gift: No`;

  box.value =
`Email: ${formState.email}
Phone: ${formState.phone}
Country: ${formState.country}
City: ${formState.city}
${giftMsg}

Type: ${formState.type}
Dimensions: ${formState.dimensions}
Description: ${formState.description}
Attachment: ${attachmentName}
`;
}


  //Validation 
  const addErr = el => el && el.classList.add("input-error");
  const rmErr  = el => el && el.classList.remove("input-error");
  
  //animation
  const shake  = btn => { if (!btn) return;
     btn.classList.add("shake");
      setTimeout(()=>btn.classList.remove("shake"), 350); 
    };


  const phone = document.getElementById("phone");
  const coun  = document.getElementById("coun");
  const cit   = document.getElementById("cit");

  const validatePerson = () => {
    let ok = true;
    [phone, coun, cit].forEach(rmErr);
    if (!phone || !phone.value.trim()) { addErr(phone); ok = false; }
    if (!coun  || !coun.value.trim())  { addErr(coun);  ok = false; }
    if (!cit   || !cit.value.trim())   { addErr(cit);   ok = false; }
    if (ok && phone && !/^\+?\d[\d\s\-]{9,}$/.test(phone.value.trim())) { addErr(phone); ok = false; }
    return ok;
  };

  //Person to Order
  if (next1) {
    next1.type = "button";
    next1.addEventListener("click", () => {
      if (!validatePerson()) { shake(next1); phone?.focus(); return; }
      personPage();
      goToOrder();
    });
  }

  //back button
  back1?.addEventListener("click", backToPerson);

  //Order to Summary
  if (next2) {
    next2.type = "button";
    next2.addEventListener("click", () => {
      const fields = order ? Array.from(order.querySelectorAll('input:not([type="file"]), select, textarea')) : [];
      fields.forEach(rmErr);
      const invalid = fields.filter(el => !el.value || !el.value.trim());

      if (invalid.length > 0) {
        invalid.forEach(el => {
          addErr(el);
          el.classList.add("shake");
          setTimeout(() => el.classList.remove("shake"), 350);
        });
        shake(next2);
        invalid[0].focus();
        return;
      }

      orderPage();
      showSummary();
      goToSummary();
    });
  }

  //back button
  back2?.addEventListener("click", backToOrder);


  //Confirm
  const overlay    = document.getElementById("confirm-overlay");
  const confirmBtn = document.querySelector(".confirme-button");
  const closeBtn   = document.querySelector(".closed-button");

  confirmBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    overlay?.classList.remove("hidden");
    document.documentElement.style.overflow = "hidden";
  });
  closeBtn?.addEventListener("click", () => {
    overlay?.classList.add("hidden");
    document.documentElement.style.overflow = "";
  });
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      document.documentElement.style.overflow = "";
    }
  });

});
