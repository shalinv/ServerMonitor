const goHome = document.getElementById("home");
goHome.addEventListener("click", () => {
  window.location.href = "/";
});

const filterOpt = document.getElementById("filter");
filterOpt.addEventListener("click", () => {
  console.log("clicked");
  const filterVal = filterOpt.value;
  if (filterVal == "all") {
    window.location.href = "/history/?filter=all";
  } else {
    window.location.href = `/history/?filter=${filterVal}`;
  }
});
