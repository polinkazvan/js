async function fetchArticles(keyword, page = 1) {
  if (keyword.trim().length === 0) return [];

  const params = new URLSearchParams({
    _page: page,
    q: keyword,
    _limit: 3,
  });

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?${params}`,
  );

  if (!response.ok) throw new Error(`Ошибка сети : ${response.status}`);

  return await response.json();
}
