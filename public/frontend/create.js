const successBtns = document.querySelectorAll(".success-buttons");
const successModal = document.querySelector(".success-modal");
const textContent = document.querySelector(".text-content");

successBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.type == "add") {
      successModal.style.display = "none";
    }
    if (btn.dataset.type == "blogs") {
      window.location.replace("/blogs");
    }
    document.body.style.height = "100%";
    document.body.style.overflow = "unset";
  });
});

if (successModal !== null) {
  document.body.style.height = "100vh";
  document.body.style.overflow = "hidden";
}

textContent.defaultValue =
  textContent.dataset.value != undefined ? textContent.dataset.value : "";
