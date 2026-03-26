/* ============================================
   Bo Bois Deco — Contact Form
   Formspree integration with fetch API
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmit');
  const submitText = submitBtn.querySelector('.form__submit-text');
  const submitLoading = submitBtn.querySelector('.form__submit-loading');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitText.hidden = true;
    submitLoading.hidden = false;
    feedback.className = 'form__feedback';
    feedback.textContent = '';

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        feedback.className = 'form__feedback form__feedback--success';
        feedback.textContent = 'Merci ! Votre message a bien été envoyé. Nous vous recontacterons rapidement.';
        form.reset();
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (err) {
      feedback.className = 'form__feedback form__feedback--error';
      feedback.textContent = 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement par email.';
    } finally {
      submitBtn.disabled = false;
      submitText.hidden = false;
      submitLoading.hidden = true;
    }
  });
});
