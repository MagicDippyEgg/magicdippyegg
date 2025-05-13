export default async function handler(req, res) {
  try {
    // Fetch basic profile
    const profileRes = await fetch("https://api.scratch.mit.edu/users/magicdippyegg");
    const profileData = await profileRes.json();

    // Fetch all projects with pagination
    let allProjects = [];
    let offset = 0;
    const limit = 40;
    let done = false;

    while (!done) {
      const projectRes = await fetch(`https://api.scratch.mit.edu/users/magicdippyegg/projects?limit=${limit}&offset=${offset}`);
      const projectData = await projectRes.json();

      if (!Array.isArray(projectData)) break;

      allProjects = allProjects.concat(projectData);
      if (projectData.length < limit) {
        done = true;
      } else {
        offset += limit;
      }
    }

    // Scrape follower count
    const htmlRes = await fetch("https://scratch.mit.edu/users/magicdippyegg/");
    const html = await htmlRes.text();
    const match = html.match(/"follower_count":(\d+)/);
    const followerCount = match ? parseInt(match[1]) : null;

    res.status(200).json({
      ...profileData,
      followers: followerCount,
      projectCount: allProjects.length
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.
