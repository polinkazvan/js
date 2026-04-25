function renderArticles(articles, isNewSearch = false) {
  if (isNewSearch) {
    contentArea.innerHTML = "";
  }

  if (articles.length === 0 && activePage === 1) {
    statusMessage.innerHTML = "Ничего не найдено";
    return;
  }

  let htmlString = "";
  for (let article of articles) {
    htmlString += `
      <div class="post-card">
        <h2>${article.title}</h2>
        <p>${article.body}</p>
      </div>
    `;
  }

  contentArea.innerHTML += htmlString;
}
