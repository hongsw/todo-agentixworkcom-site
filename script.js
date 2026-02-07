// Demo Form Submission Handler
document.getElementById('demoRequestForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Get form data
    const formData = {
        company: form.company.value,
        name: form.name.value,
        email: form.email.value,
        useCase: form['use-case'].value,
        timestamp: new Date().toISOString()
    };

    // Update button state
    submitBtn.textContent = '전송중...';
    submitBtn.disabled = true;

    try {
        // Submit to API
        const response = await fetch('/api/submit-demo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.error || 'Submission failed');
        }

        // Show success message
        alert('데모 신청이 완료되었습니다!\n1영업일 내 Slack 초대장을 보내드리겠습니다.');

        // Reset form
        form.reset();

        // Track conversion
        trackEvent('demo_request_success', {
            company: formData.company,
            has_use_case: !!formData.useCase
        });

    } catch (error) {
        console.error('Submission error:', error);
        alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');

        // Track error
        trackEvent('demo_request_error', {
            error_message: error.message
        });
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// GA4 Event Tracking (placeholder)
function trackEvent(eventName, eventParams = {}) {
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventParams);
    } else {
        console.log('GA4 Event:', eventName, eventParams);
    }
}

// Track form submission
document.getElementById('demoRequestForm')?.addEventListener('submit', () => {
    trackEvent('form_submit', {
        form_name: 'demo_request'
    });
});

// Track CTA button clicks
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            button_location: e.target.closest('section')?.className || 'unknown'
        });
    });
});
