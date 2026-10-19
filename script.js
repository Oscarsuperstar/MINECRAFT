// script.js — handles quiz instant feedback and small UI pieces

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll when clicking "Start Learning"
  const startBtn = document.getElementById('start-btn');
  startBtn?.addEventListener('click', () => {
    document.getElementById('basics')?.scrollIntoView({behavior:'smooth', block:'start'});
  });

  // Quiz logic
  const quizForm = document.getElementById('quiz-form');
  const scoreEl = document.getElementById('score');
  const resetBtn = document.getElementById('reset-quiz');

  // Find all questions
  const questions = Array.from(document.querySelectorAll('.question'));

  // Function to update score and UI after any choice change
  function updateScoreAndFeedback() {
    let correctCount = 0;
    questions.forEach(q => {
      // For each question, find the selected input (if any)
      const inputs = Array.from(q.querySelectorAll('input[type="radio"]'));
      const selected = inputs.find(i => i.checked);

      // Remove "selected" class from labels, then add to active
      inputs.forEach(i => {
        const label = i.closest('label');
        if (label) label.classList.remove('selected');
      });
      if (selected) {
        const label = selected.closest('label');
        if (label) label.classList.add('selected');
      }

      const feedback = q.querySelector('.feedback');
      if (!selected) {
        // No answer chosen yet — hide feedback
        if (feedback) {
          feedback.style.display = 'none';
          feedback.classList.remove('correct','wrong');
          feedback.textContent = '';
        }
        return;
      }

      // Read correctness and explanation from data attributes on the selected input
      const isCorrect = selected.dataset.correct === 'true';
      const explanation = selected.dataset.explain || (isCorrect ? 'Correct!' : 'Not quite.');

      // Show instant feedback text and style
      if (feedback) {
        feedback.textContent = explanation;
        feedback.classList.toggle('correct', isCorrect);
        feedback.classList.toggle('wrong', !isCorrect);
        feedback.style.display = 'block';
      }

      if (isCorrect) correctCount++;
    });

    // Update overall score displayed
    scoreEl.textContent = `Score: ${correctCount} / ${questions.length}`;
  }

  // Attach change listeners to all radio inputs for instant feedback
  quizForm?.addEventListener('change', (e) => {
    // If a radio changed, recalc score/feedback
    updateScoreAndFeedback();
  });

  // Reset quiz — clears selections and feedback
  resetBtn?.addEventListener('click', () => {
    const inputs = quizForm.querySelectorAll('input[type="radio"]');
    inputs.forEach(i => i.checked = false);
    questions.forEach(q => {
      const feedback = q.querySelector('.feedback');
      if (feedback) {
        feedback.style.display = 'none';
        feedback.classList.remove('correct','wrong');
        feedback.textContent = '';
      }
      // Remove selected class from all labels
      const labels = q.querySelectorAll('label');
      labels.forEach(l => l.classList.remove('selected'));
    });
    scoreEl.textContent = `Score: 0 / ${questions.length}`;
    // Scroll quiz slightly into view for mobile convenience
    document.getElementById('quiz')?.scrollIntoView({behavior:'smooth'});
  });

  // Initial update (in case some radios are prefilled)
  updateScoreAndFeedback();
});
