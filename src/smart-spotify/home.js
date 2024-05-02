// homepage
export function homepage(req, res) {
  // if the user is logged in get user info
  if (req.session.access_token) {
    res.redirect("/me");
  } else {
    // else send login page text
    res.json({ message: "Login to use DiscoverWeeklyArchive!" });
  }
}
