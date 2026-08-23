const apiKey = 'AQ.Ab8RN6L67bqTjQy1MDnzL3GBCyGD0T5GEws4SEspcb7c9pxr3w';
const model = 'gemini-3.6-flash';
const prompt = `You are an expert real-estate assistant for Shreyas Associates in Mysuru. Respond in a warm, professional WhatsApp style. Keep the answer concise, friendly, and practical. Do not invent properties or prices. Use only the given property data.

Customer context:
- Name: Test Lead
- Message: I want a 2 BHK in Mysuru under 60 lakh
- Budget: Under ₹60 lakh
- Area: Mysuru
- Property type: Residential Property
- Notes: Local testing

Listing catalogue:
[{"name":"prop_03","status":"Available","price":"₹1.4 Cr","dimension":"20x30","area":"Saraswathi puram","propertyType":"Residential Land","facing":"South","landType":"REVENUE","siteNo":"ak47","location":"Near aroma signal","description":"NKN"}]

Return JSON with exactly this shape:
{
  "summary": "short summary of the buyer need",
  "matches": ["property name 1", "property name 2"],
  "draftReply": "a polished WhatsApp-style reply to the customer",
  "action": "suggested next step: follow-up, share listings, ask budget, or schedule visit"
}`;

fetch('https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 500, responseMimeType: 'application/json' }
  })
}).then(async (response) => {
  const text = await response.text();
  console.log('STATUS', response.status);
  console.log(text.slice(0, 4000));
}).catch((error) => {
  console.error('FETCH_ERROR', error);
  process.exit(1);
});
