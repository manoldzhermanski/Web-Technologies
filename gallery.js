const pictureTemplate = document.getElementById("pictureTemplate");
const picturesContainer = document.getElementById("picturesContainer");
const username = document.getElementById("username");
const fetchImages = async () => {
  const headers = new Headers();
  headers.append("Authorization", localStorage.getItem("access_token"));
  const images = await (
    await fetch(`http://localhost:3002/images`, {
      headers,
    })
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
  const headers = new Headers();
  headers.append("Authorization", localStorage.getItem("access_token"));
  await fetch(`http://localhost:3002/images/${imageId}`, {
    headers,
    method: "DELETE",
  });

  populateImages();
};

const getUserData = async () => {
  const headers = new Headers();
  headers.append("Authorization", localStorage.getItem("access_token"));

  const userData = await (
    await fetch("http://localhost:3002/user", { headers })
  ).json();

  return userData;
};

(async () => {
  const loggedIn = !!localStorage.getItem("access_token");

  if (loggedIn) {
    const userData = await getUserData();
    populateImages();
    username.innerHTML = userData.username;
  } else {
    location.href = "login.html";
  }
})();
