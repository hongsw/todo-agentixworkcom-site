/**
 * Debug endpoint to check environment variables
 * GET /api/debug-env
 */

export async function onRequest(context) {
    const { env } = context;

    return new Response(JSON.stringify({
        hasNotionApiKey: !!env.NOTION_API_KEY,
        hasNotionLeadsDbId: !!env.NOTION_LEADS_DB_ID,
        notionApiKeyLength: env.NOTION_API_KEY ? env.NOTION_API_KEY.length : 0,
        notionLeadsDbIdLength: env.NOTION_LEADS_DB_ID ? env.NOTION_LEADS_DB_ID.length : 0,
        notionApiKeyPrefix: env.NOTION_API_KEY ? env.NOTION_API_KEY.substring(0, 10) : 'none',
        notionLeadsDbId: env.NOTION_LEADS_DB_ID || 'none',
        expectedDbId: '300af259fd0580f38fe9daba999d0754',
        dbIdMatch: env.NOTION_LEADS_DB_ID === '300af259fd0580f38fe9daba999d0754',
        availableEnvKeys: Object.keys(env || {}).filter(k => !k.startsWith('__')),
        timestamp: new Date().toISOString()
    }, null, 2), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
