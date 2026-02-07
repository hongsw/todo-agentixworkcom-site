/**
 * Slack Workspace Invitation Handler
 * Cloudflare Pages Function
 *
 * Manual trigger for sending Slack workspace invitations
 * Admin reviews demo requests in Notion and approves them
 * This endpoint sends invitation to approved email addresses
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight request
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Admin authentication (simple bearer token)
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || authHeader !== `Bearer ${env.ADMIN_API_KEY}`) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Unauthorized'
            }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Parse request
        const body = await request.json();
        const { email, channels = [] } = body;

        if (!email) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Email required'
            }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // Send Slack invitation using Slack Web API
        const slackResponse = await fetch('https://slack.com/api/admin.users.invite', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.SLACK_BOT_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                team_id: env.SLACK_TEAM_ID,
                email: email,
                channel_ids: channels,
                is_restricted: false,
                is_ultra_restricted: false
            })
        });

        const slackData = await slackResponse.json();

        if (!slackData.ok) {
            console.error('Slack API error:', slackData);

            // Handle already invited case
            if (slackData.error === 'already_invited' || slackData.error === 'already_in_team') {
                return new Response(JSON.stringify({
                    success: true,
                    message: '이미 초대된 이메일입니다.',
                    slack_response: slackData
                }), {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                });
            }

            throw new Error(`Slack invitation failed: ${slackData.error}`);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Slack 초대장을 발송했습니다.',
            slack_response: slackData
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Slack invitation error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Internal server error'
        }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
