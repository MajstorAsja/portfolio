import { DotLottie } from 'https://cdn.jsdelivr.net/npm/@lottiefiles/dotlottie-web/+esm';

new DotLottie({
  autoplay: true,
  loop: true,
  canvas: document.querySelector('#loading-cat'),
  src: './cat_loading%20(1).lottie',
});

const emailLink = document.querySelector('.email-link');
const toast = document.querySelector('.copy-toast');
const toastMessage = toast.querySelector('span:last-child');
let toastTimer;

// Keep the address out of the page markup and reconstruct it only for copying.
const emailAddress = ['asja', 'smarty'].join('.')
  + String.fromCharCode(64)
  + ['gmail', 'com'].join('.');

const copyEmail = async email => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(email);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = email;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.append(textArea);
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
};

emailLink.addEventListener('click', async event => {
  event.preventDefault();

  try {
    await copyEmail(emailAddress);
    window.clearTimeout(toastTimer);
    toastMessage.textContent = 'Email copied to clipboard';
    emailLink.classList.add('is-copied');
    toast.classList.add('is-visible');

    toastTimer = window.setTimeout(() => {
      emailLink.classList.remove('is-copied');
      toast.classList.remove('is-visible');
    }, 2400);
  } catch {
    toastMessage.textContent = 'Copy failed — please try again';
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }
});
