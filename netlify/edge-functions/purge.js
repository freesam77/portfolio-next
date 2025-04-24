export default async (request) => {
    const token = process.env.NETLIFY_PERSONAL_ACCESS_TOKEN;
    const siteId = process.env.NETLIFY_SITE_ID;
  
    if (!token || !siteId) {
      return new Response("Missing Netlify credentials", { status: 500 });
    }
  
    try {
      // Fire and forget
      fetch("https://api.netlify.com/api/v1/purge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ site_id: siteId }),
      }).catch((e) => console.error("Purge error:", e));
  
      // Let the request continue to the actual API handler
      return;
    } catch (err) {
      console.error("Error purging cache:", err);
      return new Response("Error triggering purge", { status: 500 });
    }
  };
  