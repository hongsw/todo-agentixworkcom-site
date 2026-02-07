/**
 * Cloudflare Pages Function: Slack Workspace Invitation
 *
 * POST /api/slack-invite
 * - Sends Slack workspace invitation
 * - Requires admin API key authentication
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Check admin API key authentication
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new Response(JSON.stringify({
                success: false,
                error: '인증이 필요합니다.'
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        const apiKey = authHeader.replace('Bearer ', '');
        if (apiKey !== env.ADMIN_API_KEY) {
            return new Response(JSON.stringify({
                success: false,
                error: '인증이 실패했습니다.'
            }), {
                status: 403,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

        // Parse request body
        const body = await request.json();
        const { email, channels } = body;

        // Validate email
        if (!email) {
            return new Response(JSON.stringify({
                success: false,
                error: '이메일을 입력해주세요.'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }

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

        // Send Slack invitation
        const inviteResponse = await sendSlackInvite(env, email, channels);

        return new Response(JSON.stringify({
            success: true,
            message: 'Slack 초대장을 발송했습니다.',
            email: email
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });

    } catch (error) {
        console.error('Slack invite error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: '초대장 발송 중 오류가 발생했습니다.',
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
 * Send Slack workspace invitation using Admin API
 */
async function sendSlackInvite(env, email, channels = null) {
    const payload = {
        email: email,
        team_id: env.SLACK_TEAM_ID,
        real_name: email.split('@')[0],
        resend: true
    };

    // Add channels if specified
    if (channels) {
        payload.channels = channels;
    }

    const response = await fetch('https://slack.com/api/admin.users.invite', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!result.ok) {
        throw new Error(result.error || 'Slack invitation failed');
    }

    return result;
}
