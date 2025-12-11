const addBtn = document.getElementById("add");
const inputBox = document.getElementById("ip");
addBtn.addEventListener("click", () => {
  const textUrl = inputBox.value;
  const data = { url: textUrl };
  axios
    .post("/add", data)
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      console.error(err);
    });
});

const history = document.getElementById("history");
history.addEventListener("click", () => {
  window.location.href = `/history/?filter=all`;
});
