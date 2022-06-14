const pictureTemplate = document.getElementById("pictureTemplate");
const picturesContainer = document.getElementById("picturesContainer");

const fetchImages = async () => {
  const username = localStorage.getItem("username");
  const images = await (
    await fetch(`http://localhost:3002/images/${username}`)
  ).json();

  return images;
};

const populateImages = async () => {
  const images = await fetchImages();
  for (const image of images) {
    addImageToPage(image);
  }
};

const addImageToPage = (image) => {
  const pictureNode = pictureTemplate.content.cloneNode(true);

  pictureNode.querySelector(".picture-img").src = image.data;
  pictureNode.querySelector(".picture-title").innerText = image.name;

  picturesContainer.append(pictureNode);
};

(async () => {
  const loggedIn = !!localStorage.getItem('username');

  if(loggedIn) {
    populateImages();
  } else {
    location.href = "login.html"
  }
})();
