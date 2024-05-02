export async function getData(url, accessToken) {
  // fetch data from url
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  if (response.ok) {
    return json;
  } else {
    throw new Error(`Error fetching data: ${json.error.message}`);
  }
}

export async function getPaginatedData(url, accessToken) {
  let items = [];
  let nextPageUrl = url;
  while (nextPageUrl) {
    const data = await getData(nextPageUrl, accessToken);
    items = items.concat(data.items);
    nextPageUrl = data.next;
  }
  return items;
}
