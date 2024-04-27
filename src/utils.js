export async function getData(url, accessToken) {
  // fetch data from url
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error("Error fetching data");
  }
}
