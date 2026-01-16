require('dotenv').config({ path: '.env.local' });

console.log('Notion API Key:', process.env.NOTION_API_KEY ? 'Present' : 'Missing');
console.log('Work DB ID:', process.env.NOTION_DB_WORK);

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const DATABASE_ID = process.env.NOTION_DB_WORK;

async function debugWorkData() {
    if (!NOTION_API_KEY || !DATABASE_ID) {
        console.error('Missing API Key or DB ID');
        return;
    }

    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filter: {
                    property: 'Name',
                    title: {
                        contains: 'Newborn'
                    }
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log(`Found ${data.results.length} items.`);

        data.results.forEach(page => {
            const nameProp = page.properties['Name'] || page.properties['Title'];
            const name = nameProp.title[0]?.plain_text;
            console.log(`\n--- Item: ${name} ---`);

            const thumbProp = page.properties['Thumbnail'];
            console.log('Thumbnail Property Raw:', JSON.stringify(thumbProp, null, 2));

            if (thumbProp && thumbProp.rich_text) {
                console.log('Thumbnail Text Content:', thumbProp.rich_text.map(t => t.plain_text).join(''));
            }

            console.log('All Property Keys:', Object.keys(page.properties));
        });

    } catch (error) {
        console.error('Error:', error);
    }
}

debugWorkData();
