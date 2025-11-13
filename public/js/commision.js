document.addEventListener("DOMContentLoaded", () => {



  //stats
  const formState = {
    type: "",
    dimensions: "",
    attachment: null,
    description: "",
    phoneNumber: "",
    country: "",
    city: "",
    isGift: false,
    giftMessage: "",

    artistEmail: "",
    artistName: "",

    userEmail: "",
    username: ""
  };




  //get artist info
  (async () => {
    const artistId = new URLSearchParams(location.search).get("artistId");
    if (!artistId) return;

    try {
      const res = await fetch(`https://atelier-0adu.onrender.com/products/artistId/${artistId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const artist = data.artist;
      if (!artist) {
        console.warn("No artist found in response");
        return;
      }

    
      formState.artistEmail = artist.email || "";
      formState.artistName  = artist.username || artist.name || "";

      
      const nameP = document.querySelector(".artist-name");
      if (nameP) nameP.textContent = formState.artistName || "Artist";

      
      const box = document.querySelector(".profile-picture");
      if (box && artist.profilePic) {
        let img = box.querySelector("img");
        if (!img) {
          img = document.createElement("img");
          img.alt = "artist";
          box.appendChild(img);
        }
        img.src = artist.profilePic;
      }
    } catch (e) {
      console.error("Artist fetch failed:", e);
    }
  })();

 


  //get user info
  const userId = localStorage.getItem("userId");

  if (userId) {
    fetch(`https://atelier-0adu.onrender.com/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        formState.userEmail = data.email || "";
        formState.username  = data.username || "";

        console.log("User email fetched:", formState.userEmail);
        console.log("Username fetched:", formState.username);
      })
      .catch(err => console.error("Error fetching user email:", err));
  }

  


  //show and hide the gift message
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




  // progress 
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

  


  //save order info
  function orderPage() {
    formState.type        = document.getElementById("options")?.value || "";
    formState.dimensions  = document.getElementById("dimension")?.value?.trim() || "";
    formState.attachment  = document.getElementById("upload-file")?.files?.[0] || null;
    formState.description = document.getElementById("description")?.value || "";
    console.log("Order Saved:", formState);
  }


  //save person info
  function personPage() {
    formState.phoneNumber = document.getElementById("phone")?.value?.trim() || "";
    formState.country     = document.getElementById("coun")?.value?.trim() || "";
    formState.city        = document.getElementById("cit")?.value?.trim() || "";

    const gift = document.querySelector('input[name="gift"]:checked');
    if (gift) formState.isGift = (gift.value === "yes");

    formState.giftMessage = document.getElementById("gift-message")?.value || "";
    console.log("Person Saved:", formState);
  }

  

  //show the summary
  function showSummary() {
    const box = document.getElementById("all-description");
    if (!box) return;

    const attachmentName = formState.attachment ? formState.attachment.name : "No attachment";

    const giftMsg = formState.isGift
      ? `Gift: Yes\nMessage: ${formState.giftMessage}`
      : `Gift: No`;

    box.value =
`Username: ${formState.username}
Email: ${formState.userEmail}
Phone: ${formState.phoneNumber}
Country: ${formState.country}
City: ${formState.city}
${giftMsg}

Type: ${formState.type}
Dimensions: ${formState.dimensions}
Description: ${formState.description}
Attachment: ${attachmentName}
`;
}

 


//validation
const addErr = el => el && el.classList.add("input-error");
const rmErr  = el => el && el.classList.remove("input-error");

  const shake  = btn => {
    if (!btn) return;
    btn.classList.add("shake");
    setTimeout(() => btn.classList.remove("shake"), 350);
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
    if (ok && phone && !/^\+?\d[\d\s\-]{9,}$/.test(phone.value.trim())) {
      addErr(phone);
      ok = false;
    }
    return ok;
  };




  // Person to Order
  if (next1) {
    next1.type = "button";
    next1.addEventListener("click", () => {
      if (!validatePerson()) { shake(next1); phone?.focus(); return; }
      personPage();
      goToOrder();
    });
  }


  // back to person
  back1?.addEventListener("click", backToPerson);




  // order to summary
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



  // back to order
  back2?.addEventListener("click", backToOrder);

 



  //post the commision
  async function sendCommission() {
    try {
      const res = await fetch("https://atelier-0adu.onrender.com/commission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type:         formState.type,
          dimensions:   formState.dimensions,
          attachment:   formState.attachment ? formState.attachment.name : null,
          description:  formState.description,
          phoneNumber:  formState.phoneNumber,
          country:      formState.country,
          city:         formState.city,
          isGift:       formState.isGift,

          artistEmail:  formState.artistEmail,
          userEmail:    formState.userEmail,
          username:     formState.username
        })
      });

      const data = await res.json();
      console.log("Commission Sent:", data);
    } catch (err) {
      console.error("Error sending commission:", err);
    }
  }

 


  
  //confirm
  const overlay    = document.getElementById("confirm-overlay");
  const confirmBtn = document.querySelector(".confirme-button");
  const closeBtn   = document.querySelector(".closed-button");

  confirmBtn?.addEventListener("click", async (e) => {
    e.preventDefault();


    //send to server
    await sendCommission();


    // show the confirm message
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
