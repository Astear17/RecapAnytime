export function showToast(message: string, duration = 2500) {
  if (typeof document === 'undefined') return;

  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'toast-pop';
  document.body.appendChild(el);

  setTimeout(() => {
    el.classList.add('toast-exit');
    setTimeout(() => el.remove(), 300);
  }, duration);
}
