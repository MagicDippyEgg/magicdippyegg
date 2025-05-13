export default async function handler(req, res) {
  try {
    // Profile data
    const profileRes = await fetch("https://api.scratch.mit.edu/users/magicdippyegg");
    const profileData = await profileRes.json();

    // Projects (limit 40)
    const projectsRes = await fetch("https://api.scratch.mit.edu/users/magicdippyegg/projects?limit=40&offset=0");
    const projectsData = await projectsRes.json();

    // Scrape follower count from HTML
    const profilePageRes = await fetch("https://scratch.mit.edu/users/magicdippyegg/");
    const html = await profilePageRes.text();

    // Regex to find follower count from page
    const followerMatch = html.match(/"follower_count":(\d+)/);
    const followerCount = followerMatch ? parseInt(followerMatch[1]) : null;

    res.status(200).json({
      ...profileData,
      followers: followerCount,
      projectCount: projectsData.length
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}
