import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyACCpl5f7g34Fs0eMxUguBuGE80SuKZCIA",
  authDomain: "hrms-326ad.firebaseapp.com",
  projectId: "hrms-326ad",
  storageBucket: "hrms-326ad.firebasestorage.app",
  messagingSenderId: "813107687048",
  appId: "1:813107687048:web:2d3c2fff54a65285ba793d",
  measurementId: "G-HXGFCBV64Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Make functions available globally
window.openDialog = function (id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

window.closeDialog = function (id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

window.smoothScroll = function (targetId) {
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth'
    });
  }
}

window.openMobileMenu = function () {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  if (mobileMenu && mobileMenuButton) {
    mobileMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

window.closeMobileMenu = function () {
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  if (mobileMenu && mobileMenuButton) {
    mobileMenu.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

window.toggleFAQ = function (id) {
  const faq = document.getElementById(id);
  const arrow = document.getElementById(`arrow-${id}`);
  if (faq && arrow) {
    faq.classList.toggle('hidden');
    arrow.classList.toggle('transform', !faq.classList.contains('hidden'));
  }
}

// Form Submission Logic
window.submitJoinForm = async function (event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const instagramId = document.getElementById('instagramId').value;
  const location = document.getElementById('location').value;
  const leadSource = document.getElementById('leadSource').value;
  const leadSourceOther = document.getElementById('leadSourceOther') ? document.getElementById('leadSourceOther').value : '';
  const whatTheyDo = document.getElementById('whatTheyDo').value;
  const whyWantToJoin = document.getElementById('whyWantToJoin').value;

  let finalLeadSource = leadSource;
  if (leadSource === 'others') {
    finalLeadSource = `Others: ${leadSourceOther}`;
  }

  showLoading(true);

  try {
    await addDoc(collection(db, 'joinRequests'), {
      name: name,
      phone: phone,
      email: email,
      age: parseInt(age) || null,
      instagramId: instagramId,
      location: location,
      leadSource: finalLeadSource,
      whatTheyDo: whatTheyDo,
      whyWantToJoin: whyWantToJoin,
      timestamp: serverTimestamp()
    });

    showLoading(false);
    showMessage('🎉 Request submitted! We will contact you soon.', true);
    document.getElementById('joinForm').reset();
    if(document.getElementById('otherFieldContainer')) {
        document.getElementById('otherFieldContainer').classList.add('hidden');
    }

  } catch (error) {
    console.error("Error writing document: ", error);
    showLoading(false);
    showMessage('❌ Error submitting. Please try again.', false);
  }
};

function showLoading(show) {
  const submitText = document.getElementById('submitText');
  const loadingText = document.getElementById('loadingText');
  const submitBtn = document.getElementById('submitBtn');

  if (submitText && loadingText && submitBtn) {
    if (show) {
      submitText.classList.add('hidden');
      loadingText.classList.remove('hidden');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
      submitText.classList.remove('hidden');
      loadingText.classList.add('hidden');
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
  }
}

function showMessage(message, isSuccess) {
  const formMessage = document.getElementById('formMessage');
  if (formMessage) {
    formMessage.textContent = message;
    formMessage.classList.remove('text-green-500', 'text-red-500', 'opacity-0');
    formMessage.classList.add(isSuccess ? 'text-green-500' : 'text-red-500', 'opacity-100');

    setTimeout(() => {
      formMessage.classList.add('opacity-0');
    }, 5000);
  }
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', () => {
    
  // Check for auto-open join modal parameter
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('openJoin') === 'true') {
    window.openDialog('formDialog');
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  }

  // Initialize Antigravity Features
  initTypewriter();
  loadParticles();
  
  // Mobile Menu Button
  const mobileMenuButton = document.getElementById('mobileMenuButton');
  if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', window.openMobileMenu);
  }
  
  // Lead Source Change
  const leadSource = document.getElementById('leadSource');
  if (leadSource) {
    leadSource.addEventListener('change', function () {
      const otherContainer = document.getElementById('otherFieldContainer');
      const otherInput = document.getElementById('leadSourceOther');
      if (this.value === 'others') {
        otherContainer.classList.remove('hidden');
        otherInput.required = true;
      } else {
        otherContainer.classList.add('hidden');
        otherInput.required = false;
        otherInput.value = ''; 
      }
    });
  }
});

// Typewriter Effect
function initTypewriter() {
  const words = ["Growth", "Freedom", "NextGen Udaan"];
  const el = document.getElementById('typewriter');
  if (!el) return;
  
  let i = 0;
  let j = 0;
  let currentWord = "";
  let isDeleting = false;
  
  function type() {
    currentWord = words[i];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, j - 1);
      j--;
      if (j == 0) {
        isDeleting = false;
        i = (i + 1) % words.length;
      }
    } else {
      el.textContent = currentWord.substring(0, j + 1);
      j++;
      if (j == currentWord.length) {
        isDeleting = true;
      }
    }
    
    const speed = isDeleting ? 100 : 200;
    setTimeout(type, speed);
  }
  
  type();
}

// Custom Particle System (Grouped Wavy Water Style)
class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = Math.random() * canvasWidth;
    this.y = Math.random() * canvasHeight;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
    this.size = Math.random() * 3 + 2; // Bigger (2px to 5px)
    
    // Google Colors
    const colors = ["#4285F4", "#00ff44ff"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    
    this.angle = Math.random() * Math.PI * 2;
    this.spinSpeed = (Math.random() - 0.5) * 0.04 + 0.015;
    this.baseRadius = Math.random() * 300 + 100; // Increased gap (Radius)
    this.waveOffset = Math.random() * 100;
  }

  update(mouseX, mouseY, active) {
    if (active) {
      // Wavy circular logic around mouse
      this.angle += this.spinSpeed;
      
      // Calculate wavy radius (water effect)
      const time = Date.now() * 0.002;
      const wave = Math.sin(this.angle * 5 + time + this.waveOffset) * 20;
      const targetRadius = this.baseRadius + wave;
      
      const targetX = mouseX + Math.cos(this.angle) * targetRadius;
      const targetY = mouseY + Math.sin(this.angle) * targetRadius;
      
      // Smoothly move towards the wavy orbit
      this.x += (targetX - this.x) * 0.05;
      this.y += (targetY - this.y) * 0.05;
    } else {
      // Normal floating
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce or wrap
      if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1;
      if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

let particles = [];
let canvas, ctx, animationId;
let mouseX = -1000, mouseY = -1000;
let mouseActive = false;

function initParticles() {
  canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  resizeCanvas();
  
  particles = [];
  const particleCount = 200; // Adjusted for global view
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height));
  }
  
  // Track mouse globally across window
  window.addEventListener('mousemove', (e) => {
    // Relative to viewport works best for fixed canvas
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseActive = true;
  });
  
  window.addEventListener('mouseout', () => {
    mouseActive = false;
  });

  if (!animationId) animate();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particles.forEach(p => {
    p.update(mouseX, mouseY, mouseActive);
    p.draw(ctx);
  });
  
  animationId = requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  if (canvas) {
    resizeCanvas();
    particles.forEach(p => {
      p.canvasWidth = canvas.width;
      p.canvasHeight = canvas.height;
    });
  }
});

window.loadParticles = initParticles;
