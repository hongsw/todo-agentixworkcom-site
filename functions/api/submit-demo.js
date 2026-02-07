/**
 * Cloudflare Pages Function: Demo Request Form Handler
 *
 * POST /api/submit-demo
 * - Saves lead to Notion database
 * - Sends Slack notification
 * - Returns success/error response
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Parse request body
        const body = await request.json();
        const { company, name, email, useCase, timestamp } = body;

        // Validate required fields
        if (!company || !name || !email) {
            return new Response(JSON.stringify({
                success: false,
                error: '필수 항목을 모두 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: '올바른 이메일 주소를 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Save to Notion database
        const notionResponse = await saveToNotion(env, {
            company,
            name,
            email,
            useCase,
            timestamp
        });

        // Send Slack notification
        if (env.SLACK_WEBHOOK_URL) {
            await sendSlackNotification(env.SLACK_WEBHOOK_URL, {
                company,
                name,
                email,
                useCase
            });
        }

        // Return success response
        return new Response(JSON.stringify({
            success: true,
            message: '데모 신청이 완료되었습니다.',
            notionPageId: notionResponse.id
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });

    } catch (error) {
        console.error('Demo submission error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}

/**
 * Save lead to Notion database
 */
async function saveToNotion(env, data) {
    const { company, name, email, useCase, timestamp } = data;

    const notionPayload = {
        parent: {
            database_id: env.NOTION_LEADS_DB_ID
        },
        properties: {
            '회사명': {
                title: [
                    {
                        text: {
                            content: company
                        }
                    }
                ]
            },
            '담당자명': {
                rich_text: [
                    {
                        text: {
                            content: name
                        }
                    }
                ]
            },
            '이메일': {
                email: email
            },
            '사용 목적': {
                rich_text: [
                    {
                        text: {
                            content: useCase || ''
                        }
                    }
                ]
            },
            '신청일': {
                date: {
                    start: timestamp.split('T')[0]
                }
            },
            '상태': {
                select: {
                    name: '신규'
                }
            }
        }
    };

    const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.NOTION_API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        },
        body: JSON.stringify(notionPayload)
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Notion API error: ${error}`);
    }

    return await response.json();
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(webhookUrl, data) {
    const { company, name, email, useCase } = data;

    const slackPayload = {
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: '🎉 새로운 데모 신청',
                    emoji: true
                }
            },
            {
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*회사명:*\n${company}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*담당자:*\n${name}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*이메일:*\n${email}`
                    },
                    {
                        type: 'mrkdwn',
                        text: `*시간:*\n${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}`
                    }
                ]
            }
        ]
    };

    if (useCase) {
        slackPayload.blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*사용 목적:*\n${useCase}`
            }
        });
    }

    slackPayload.blocks.push({
        type: 'actions',
        elements: [
            {
                type: 'button',
                text: {
                    type: 'plain_text',
                    text: 'Slack 초대 보내기',
                    emoji: true
                },
                style: 'primary',
                url: `https://agentixwork.com/admin/slack-invite?email=${encodeURIComponent(email)}`
            }
        ]
    });

    const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(slackPayload)
    });

    if (!response.ok) {
        console.error('Slack notification failed:', await response.text());
        // Don't throw error - Slack notification is optional
    }
}
