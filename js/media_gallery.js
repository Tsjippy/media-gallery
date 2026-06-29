console.log("Media galery js loaded");

function showImage(index) {
  //hide all containers
  document
    .querySelectorAll(".large-image:not(.hidden)")
    .forEach((el) => el.classList.add("hidden"));

  //show new one
  let wrapper = document.querySelector(`.large-image[data-index="${index}"]`);

  let image = wrapper.querySelector(".image img");
  if (image != null && image.dataset.full != undefined) {
    image.src = image.dataset.full;
  }
  wrapper.classList.remove("hidden");
}

async function loadMore(index, showFirst, skipAmount = 0) {
  let button = document.getElementById("loadmoremedia");
  if (button != null) {
    button.classList.add("hidden");
  }
  var amount = document.querySelector("#media-amount").value;
  if (amount == skipAmount) return;
  var types = [];
  document
    .querySelectorAll(".media-type-selector:checked")
    .forEach((element) => types.push(element.value));
  var cats = [];
  document
    .querySelectorAll(".media-cat-selector:checked")
    .forEach((element) => cats.push(element.value));

  var formData = new FormData();
  formData.append("amount", amount);
  formData.append("page", document.querySelector("#paged").value);
  formData.append("skipAmount", skipAmount);
  formData.append("types", types);
  formData.append("categories", cats);
  formData.append("startIndex", index + 1);

  var response = await FormSubmit.fetchRestApi(
    "media_gallery/load_more_media",
    formData,
  );

  // Hide the full screen loader
  document.getElementById("media-loader-wrapper").classList.add("hidden");

  if (!response) {
    Main.displayMessage("All media are loaded", "info");
  } else {
    if (button != null) {
      button.classList.remove("hidden");
    }
    document
      .querySelector(".mediawrapper")
      .insertAdjacentHTML("beforeEnd", response);

    if (showFirst) {
      var el = document.querySelector(`[data-index="${index}"]`);
      var nextEl = el.nextElementSibling.nextElementSibling;

      showImage(nextEl.dataset.index);
    }

    //hide the load more button if the last cell has no next button
    var cells = document.querySelectorAll(".large-image");
    if (cells[cells.length - 1].querySelector(".next-button") == null) {
      document.getElementById("loadmoremedia").classList.add("hidden");
    }
  }

  if (button != null) {
    button.parentNode.querySelector(".loader-wrapper").remove();
  }
}

async function catChanged(target) {
  document.querySelector(".mediawrapper").innerHTML = "";

  let loader = Main.showLoader(
    document.querySelector(".mediawrapper"),
    false,
    50,
    "Loading",
  );

  var amount = document.querySelector("#media-amount").value;
  var types = [];
  document
    .querySelectorAll(".media-type-selector:checked")
    .forEach((element) => types.push(element.value));
  var cats = [];
  document
    .querySelectorAll(".media-cat-selector:checked")
    .forEach((element) => cats.push(element.value));

  var formData = new FormData();
  formData.append("amount", amount);
  formData.append("types", types);
  formData.append("categories", cats);

  var response = await FormSubmit.fetchRestApi(
    "media_gallery/change_cats",
    formData,
  );

  if (response) {
    document.querySelector(".mediawrapper").innerHTML = response;
  }

  loader.remove();
}

async function mediaSearch(target) {
  var amount = document.querySelector("#media-amount").value;
  var types = [];
  document
    .querySelectorAll(".media-type-selector:checked")
    .forEach((el) => types.push(el.value));
  var searchString = target
    .closest(".mediabuttons")
    .querySelector(".searchtext").value;

  var formData = new FormData();
  formData.append("amount", amount);
  formData.append("types", types);
  formData.append("search", searchString);

  var response = await FormSubmit.fetchRestApi(
    "media_gallery/media_search",
    formData,
  );

  if (!response) {
    Main.displayMessage("Nothing found", "warning");
  } else {
    document.querySelector(".mediawrapper").innerHTML = response;
  }
}

document.querySelectorAll(".searchtext").forEach((el) => {
  el.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
      mediaSearch(event.target);
    }
  });
});

function nextButtonClicked(target) {
  let el = target.closest(".large-image");
  let nextEl = el.nextElementSibling;
  if (nextEl != null) {
    nextEl = nextEl.nextElementSibling;
  }

  //load more
  if (nextEl == null) {
    document.getElementById("media-loader-wrapper").classList.remove("hidden");

    document.getElementById("paged").value =
      parseInt(document.getElementById("paged").value) + 1;
    loadMore(el.dataset.index, true);
  } else {
    showImage(nextEl.dataset.index);
  }
}

function loadMoreMedia(target) {
  //find the last image
  let media = document.querySelectorAll(".cell");

  document.getElementById("paged").value =
    parseInt(document.getElementById("paged").value) + 1;

  loadMore(media[media.length - 1].dataset.index, false);

  Main.showLoader(target, false);
}

function mediaTypeSelected(target) {
  let visibleCells;
  let amount = document.querySelector("#media-amount").value;

  // we should show a new type or show all
  if (
    target.checked ||
    document.querySelectorAll(".media-type-selector:checked").length == 0
  ) {
    // show all hidden ones
    document
      .querySelectorAll(`.cell.${target.value}.hidden`)
      .forEach((el) => el.classList.remove("hidden"));

    if (target.checked) {
      // hide all needed
      document
        .querySelectorAll(".media-type-selector:not(:checked)")
        .forEach((type) => {
          document
            .querySelectorAll(`.cell.${type.value}:not(.hidden)`)
            .forEach((el) => el.classList.add("hidden"));
        });
    }

    // remove all more than the maximum in case we have too many
    visibleCells = document.querySelectorAll(".cell:not(.hidden)");
    for (let i = amount; i < visibleCells.length; i++) {
      // remove the cell and the larger-image
      document
        .querySelector(
          `.mediawrapper [data-index="${visibleCells[i].dataset.index}"`,
        )
        .remove();
    }
  } else {
    document
      .querySelectorAll(`.cell.${target.value}`)
      .forEach((el) => el.classList.add("hidden"));
  }

  let media = document.querySelectorAll(".cell");

  // load more of the remaining types untill we reach the maximum
  let visibleCellsCount =
    document.querySelectorAll(".cell:not(.hidden)").length;

  if (visibleCellsCount < amount) {
    let types = "";

    document.querySelectorAll(".media-type-selector:checked").forEach((el) => {
      if (types != "") {
        types += " and ";
      }

      types += el.value + "s";
    });

    Main.showLoader(
      document.getElementById("loadmoremedia"),
      false,
      50,
      "Loading " + types,
    );

    let index = 0;
    if (media.length > 0) {
      index = media[media.length - 1].dataset.index;
    }
    loadMore(index, false, visibleCellsCount);
  }
}

async function downloadMedia(target) {
  let options = {
    title: `Warning`,
    ConfirmButtonText: "I promise not to share this file",
    CancelButtonText: "Cancel",
  };

  let alerter = new Main.Alert(
    "Downloading of materials is only allowed for use in presentations. <br>You should not share this file with others as it may contain privacy sensitive information",
    "loader",
    options,
  );
  let response = await alerter.promise;

  if (response == "confirm") {
    target.querySelector("a").click();
  }
}

document.addEventListener("click", async (ev) => {
  var target = ev.target;
  var parent = target.closest(".large-image");

  if (target.matches(".media-item")) {
    ev.preventDefault();
    ev.stopPropagation();
    showImage(target.closest(".cell").dataset.index);
  } else if (target.matches(".closebtn")) {
    parent.classList.add("hidden");

    //stop any video's
    var iframe = parent.querySelector("iframe");
    if (iframe != null) {
      // refresh iframe
      iframe.src = iframe.src;
    }
  } else if (target.matches(".previous-button")) {
    let el = target.closest(".large-image");
    let prevEl = el.previousElementSibling.previousElementSibling;

    showImage(prevEl.dataset.index);
  } else if (target.matches(".next-button")) {
    nextButtonClicked(target);
  } else if (target.id == "loadmoremedia") {
    ev.preventDefault();
    ev.stopPropagation();

    loadMoreMedia(target);
  } else if (target.matches(".button-wrapper .description")) {
    Main.displayMessage(atob(target.dataset.description));
  } else if (target.matches(".media-type-selector")) {
    // media type selector
    mediaTypeSelected(target);
  } else if (target.matches(".mediabuttons .search")) {
    ev.preventDefault();
    ev.stopPropagation();
    mediaSearch(target);
  } else if (target.matches(".download")) {
    ev.preventDefault();
    downloadMedia(target);
  } else if (target.matches(".media-cat-selector")) {
    catChanged(target);
  } else if ((target.id = "category-options")) {
    target
      .closest(".media-gallery-wrapper")
      .querySelector(".media-categories")
      .classList.toggle("hidden");
  } else {
    return;
  }

  ev.stopImmediatePropagation();
});

document.addEventListener("change", (ev) => {
  var target = ev.target;

  if (target.id == "media-amount") {
    ev.stopImmediatePropagation();

    //reset page count
    document.getElementById("paged").value = 1;

    //Check how many we have currently
    var media = document.querySelectorAll(".cell");
    var curAmount = media.length;

    // We need to add more
    if (target.value > curAmount) {
      var start = parseInt(media[media.length - 1].dataset.index);
      loadMore(start, false, curAmount);

      Main.showLoader(
        document.getElementById("loadmoremedia"),
        false,
        50,
        "Loading more...",
      );
      // We need to remove some
    } else if (target.value < curAmount) {
      var i = 1;
      document.querySelectorAll(".cell, .large-image").forEach((el) => {
        if (i > target.value) {
          el.remove();
        }

        if (el.matches(".cell")) {
          i++;
        }
      });
    }
  }
});

var xDown = null;
var yDown = null;
document.addEventListener("touchstart", (evt) => {
  const firstTouch = evt.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
});

document.addEventListener("touchmove", (evt) => {
  if (!xDown || !yDown) {
    return;
  }

  var xUp = evt.touches[0].clientX;
  var yUp = evt.touches[0].clientY;

  var xDiff = xDown - xUp;
  var yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    var nextEl;
    var el = document.querySelector(".large-image:not(.hidden)");
    if (xDiff > 0) {
      /* right swipe */
      nextEl = el.nextElementSibling.nextElementSibling;
    } else {
      /* left swipe */
      nextEl = el.previousElementSibling.previousElementSibling;
    }
    showImage(nextEl.dataset.index);
  }
  /* reset values */
  xDown = null;
  yDown = null;
});

// close fullscreen view on escape
document.onkeydown = function (evt) {
  evt = evt || window.event;
  var isEscape = false;
  if ("key" in evt) {
    isEscape = evt.key === "Escape" || evt.key === "Esc";
  } else {
    isEscape = evt.keyCode === 27;
  }
  if (isEscape) {
    document
      .querySelectorAll(".large-image:not(.hidden)")
      .forEach((el) => el.classList.add("hidden"));
  }
};
