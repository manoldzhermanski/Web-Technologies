const pictureTemplate = document.getElementById("pictureTemplate");
const picturesContainer = document.getElementById("picturesContainer");
const username = document.getElementById("username");
const fetchImages = async () => {
  const username = localStorage.getItem("username");
  const images = await (
    await fetch(`http://localhost:3002/user/${username}/images`)
  ).json();

  return images;
};

const populateImages = async () => {
  const images = await fetchImages();
  picturesContainer.innerHTML = "";
  for (const image of images) {
    addImageToPage(image);
  }
};

const addImageToPage = (image) => {
  const pictureNode = pictureTemplate.content.cloneNode(true);

  pictureNode.querySelector(".picture-img").src = image.data;
  pictureNode.querySelector(".picture-title").innerText = image.name;
  pictureNode.querySelector(".edit").addEventListener("click", () => {
    const params = new URLSearchParams();
    params.append("image", image._id);

    location.href = `draw.html?${params.toString()}`;
  });
  pictureNode.querySelector(".delete").addEventListener("click", () => {
    deleteImage(image._id);
  });

  picturesContainer.append(pictureNode);
};

const deleteImage = async (imageId) => {
  const username = localStorage.getItem("username");
  await fetch(`http://localhost:3002/user/${username}/images/${imageId}`, {
    method: "DELETE",
  });

  populateImages();
};

(async () => {
  const loggedIn = !!localStorage.getItem("username");

  if (loggedIn) {
    populateImages();
    username.innerHTML = localStorage.getItem("username");
  } else {
    location.href = "login.html";
  }
})();
