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
        // TODO: Replace with actual API endpoint
        // For now, log to console and show success message
        console.log('Demo request submitted:', formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success message
        alert('데모 신청이 완료되었습니다!\n1영업일 내 Slack 초대장을 보내드리겠습니다.');

        // Reset form
        form.reset();

    } catch (error) {
        console.error('Submission error:', error);
        alert('전송 중 오류가 발생했습니다. 다시 시도해주세요.');
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
