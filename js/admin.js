import{
  fetchRestApi
} from "../../tsjippy-forms/js/form_submit_functions.js";

import { 
  displayMessage 
} from "../../tsjippy-shared-functionality/js/partials/display_message.js";

async function downloadVimeoVideo(ev) {
  const vimeoUrl = ev.target
    .closest("form")
    .querySelector('[name="download-url"]').value;

  if (vimeoUrl == "") {
    displayMessage("Please give an url to download from", "error");
    return;
  }

  //show loader
  ev.target
    .closest(".submit-wrapper")
    .querySelector(".loader-wrapper")
    .classList.remove("hidden");

  let params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let vidmeoId = params.vimeoid;
  let formData = new FormData();
  formData.append("vimeoid", vidmeoId);
  formData.append("download-url", vimeoUrl);

  displayMessage("Download started please wait till it finishes");

  let response = await fetchRestApi(
    "vimeo/download_to_server",
    formData,
  );

  if (response) {
    displayMessage(response);
    ev.target.closest("form").remove();
  } else {
    ev.target.closest("form").querySelector('[name="download-url"]').value = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector('[name="download-video"]')
    .addEventListener("click", downloadVimeoVideo);
});
