(async () => {
  const base = 'http://localhost:4000';
  const report = { posts: [], listCount: 0, sample: [], checks: [] };

  const props = [
    {
      name: 'E2E Prop With Map',
      status: 'Available',
      price: '1000000',
      dimension: '',
      location: 'Test Area',
      area: 'TestAreaName',
      mapsUrl: 'https://www.google.com/maps/place/12.3,76.6',
      propertyType: 'Residential',
      description: 'Has map'
    },
    {
      name: 'E2E Prop No Map',
      status: 'Available',
      price: '500000',
      dimension: '',
      location: '',
      area: '',
      mapsUrl: '',
      propertyType: 'Other',
      description: 'No map and no area and no dimension'
    }
  ];

  for (const p of props) {
    try {
      const res = await fetch(base + '/api/properties', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p)
      });
      const body = await res.json().catch(() => null);
      report.posts.push({ status: res.status, body });
    } catch (e) {
      report.posts.push({ error: String(e) });
    }
  }

  try {
    const listRes = await fetch(base + '/api/properties');
    const list = await listRes.json();
    report.listCount = Array.isArray(list) ? list.length : 0;
    report.sample = Array.isArray(list) ? list.slice(0, 5) : list;

    // checks
    if (Array.isArray(list)) {
      const withMap = list.find(p => p.mapsUrl && p.mapsUrl.trim());
      const withoutMap = list.find(p => !p.mapsUrl || !p.mapsUrl.trim());

      report.checks.push({ hasWithMap: !!withMap, hasWithoutMap: !!withoutMap });

      // check dimension fallback expectation: backend stores null; frontend should show default. But we assert that dimension may be null or missing.
      const anyMissingDimension = list.some(p => !p.dimension);
      report.checks.push({ anyMissingDimension });

      // ensure area is not prefixed in data
      const anyAreaPrefixed = list.some(p => typeof p.area === 'string' && p.area.startsWith('Area '));
      report.checks.push({ anyAreaPrefixed });
    }
  } catch (e) {
    report.fetchError = String(e);
  }

  const fs = await import('fs');
  fs.writeFileSync('e2e_result.json', JSON.stringify(report, null, 2));
  console.log('Wrote e2e_result.json');
})();
