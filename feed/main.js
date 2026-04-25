let activePage = 1;
let isFetching = false;
let typeTimeout = null;

const searchInput = document.querySelector("#searchInput");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const contentArea = document.querySelector("#contentArea");
const statusMessage = document.querySelector("#statusMessage");
const loadingIndicator = document.querySelector("#loadingIndicator");
const scrollTrigger = document.querySelector("#scrollTrigger");

function toggleLoading(show) {
  isFetching = show;
  loadMoreBtn.disabled = show;
  loadingIndicator.style.display = show ? "block" : "none";
}

async function processDataRequest(isNewSearch = false) {
  if (isFetching) return;

  const keyword = searchInput.value.trim();
  if (!keyword) {
    statusMessage.innerHTML = "Введите текст для поиска";
    contentArea.innerHTML = "";
    return;
  }

  if (isNewSearch) {
    activePage = 1;
    statusMessage.innerHTML = "";
    observer.observe(scrollTrigger);
  } else {
    activePage++;
  }

  toggleLoading(true);

  try {
    const newArticles = await fetchArticles(keyword, activePage);

    if (newArticles.length > 0) {
      renderArticles(newArticles, isNewSearch);

      if (newArticles.length < 3) {
        statusMessage.innerHTML = "Это все результаты";
        loadMoreBtn.disabled = true;
        observer.unobserve(scrollTrigger);
      }
    } else {
      if (!isNewSearch) statusMessage.innerHTML = "Больше постов нет";
      loadMoreBtn.disabled = true;
      observer.unobserve(scrollTrigger);
    }
  } catch (error) {
    statusMessage.innerHTML = error.message;
  } finally {
    toggleLoading(false);
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(typeTimeout);
  typeTimeout = setTimeout(() => {
    processDataRequest(true); // true означает, что это новый поиск
  }, 300);
});

loadMoreBtn.addEventListener("click", () => {
  processDataRequest(false);
});

const observer = new IntersectionObserver(
  (entries) => {
    const target = entries[0];
    if (
      target.isIntersecting &&
      !isFetching &&
      searchInput.value.trim() !== ""
    ) {
      processDataRequest(false);
    }
  },
  {
    rootMargin: "100px",
  },
);
