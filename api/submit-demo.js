/**
 * Demo Request Submission Handler
 * Cloudflare Pages Function
 *
 * Handles demo request form submissions:
 * 1. Validates form data
 * 2. Stores lead in Notion database
 * 3. Sends notification to admin (optional: Slack webhook)
 * 4. Returns success response
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Parse form data
        const body = await request.json();
        const { company, name, email, useCase } = body;

        // Validation
        if (!company || !name || !email) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Required fields missing'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email format'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Store in Notion
        const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.NOTION_API_KEY}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                parent: { database_id: env.NOTION_LEADS_DB_ID },
                properties: {
                    '회사명': {
                        title: [{ text: { content: company } }]
                    },
                    '담당자명': {
                        rich_text: [{ text: { content: name } }]
                    },
                    '이메일': {
                        email: email
                    },
                    '사용목적': {
                        rich_text: [{ text: { content: useCase || '' } }]
                    },
                    '신청일': {
                        date: { start: new Date().toISOString().split('T')[0] }
                    },
                    'Status': {
                        select: { name: '신청 접수' }
                    }
                }
            })
        });

        if (!notionResponse.ok) {
            console.error('Notion API error:', await notionResponse.text());
            throw new Error('Failed to store lead in Notion');
        }

        // Send Slack notification (optional)
        if (env.SLACK_WEBHOOK_URL) {
            await fetch(env.SLACK_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: `🎯 새로운 데모 신청`,
                    blocks: [
                        {
                            type: 'header',
                            text: {
                                type: 'plain_text',
                                text: '🎯 새로운 데모 신청'
                            }
                        },
                        {
                            type: 'section',
                            fields: [
                                { type: 'mrkdwn', text: `*회사명:*\n${company}` },
                                { type: 'mrkdwn', text: `*담당자:*\n${name}` },
                                { type: 'mrkdwn', text: `*이메일:*\n${email}` },
                                { type: 'mrkdwn', text: `*사용목적:*\n${useCase || '(미입력)'}` }
                            ]
                        }
                    ]
                })
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: '데모 신청이 완료되었습니다. 1영업일 내 연락드리겠습니다.'
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Demo submission error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: 'Internal server error'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
