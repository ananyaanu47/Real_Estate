(async () => {
  try {
    const base = 'http://localhost:4000';

    const props = [
      {
        name: 'Test Prop A',
        status: 'Available',
        price: '₹50,00,000',
        dimension: '',
        location: 'Telecom Layout',
        area: 'Mysuru West',
        mapsUrl: 'https://www.google.com/maps/place/12.3,76.6',
        propertyType: 'Residential Property',
        description: 'Test A'
      },
      {
        name: 'Test Prop B',
        status: 'Available',
        price: '',
        dimension: '',
        location: '',
        area: '',
        mapsUrl: '',
        propertyType: 'Other',
        description: 'Test B'
      }
    ];

    for (const p of props) {
      const res = await fetch(base + '/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p)
      });
      const body = await res.text();
      console.log('POST status', res.status, body);
    }

    const listRes = await fetch(base + '/api/properties');
    const list = await listRes.json();
    console.log('Properties count:', list.length);
    console.log(JSON.stringify(list.slice(0,5), null, 2));
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
