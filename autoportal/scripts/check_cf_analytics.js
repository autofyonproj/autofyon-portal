const fs = require('fs');

async function main() {
  const toml = fs.readFileSync('C:/Users/7assan/AppData/Roaming/xdg.config/.wrangler/config/default.toml', 'utf8');
  const match = toml.match(/oauth_token\s*=\s*"([^"]+)"/);
  if (!match) {
    console.log('No oauth token found');
    return;
  }
  const token = match[1];
  
  // 1. Get zones
  const zonesRes = await fetch('https://api.cloudflare.com/client/v4/zones', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const zonesData = await zonesRes.json();
  console.log('Zones count:', zonesData.result ? zonesData.result.length : 0);
  if (zonesData.result) {
    for (const z of zonesData.result) {
      console.log(`- Zone: ${z.name} (ID: ${z.id}, Status: ${z.status})`);
    }
  }

  // Find autonegypt.com or autofyon.com
  const autoOneZone = zonesData.result && zonesData.result.find(z => z.name === 'autonegypt.com');
  const autoFyonZone = zonesData.result && zonesData.result.find(z => z.name === 'autofyon.com');

  for (const [zoneName, zone] of [['autonegypt.com', autoOneZone], ['autofyon.com', autoFyonZone]]) {
    if (!zone) {
      console.log(`Zone ${zoneName} not found on this account.`);
      continue;
    }
    console.log(`\n=== Querying Cloudflare Analytics for ${zoneName} (${zone.id}) ===`);
    
    // Query GraphQL analytics for requests & countries over last 30 days
    const query = `
      query {
        viewer {
          zones(filter: { zoneTag: "${zone.id}" }) {
            httpRequests1dGroups(
              limit: 30,
              filter: { date_geq: "2026-10-23" },
              orderBy: [date_DESC]
            ) {
              dimensions {
                date
              }
              sum {
                requests
                pageViews
                bytes
              }
            }
            httpRequestsAdaptiveGroups(
              limit: 15,
              filter: {
                datetime_geq: "2026-11-01T00:00:00Z"
              },
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientCountryName
              }
            }
          }
        }
      }
    `;

    try {
      const gqlRes = await fetch('https://api.cloudflare.com/client/v4/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const gqlData = await gqlRes.json();
      console.log(`Analytics result for ${zoneName}:`, JSON.stringify(gqlData, null, 2));
    } catch (e) {
      console.error(`GraphQL error for ${zoneName}:`, e.message);
    }
  }
}

main().catch(console.error);
