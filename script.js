const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("heroDate").textContent = new Intl.DateTimeFormat("en-IN", {weekday:"long", month:"long", day:"numeric"}).format(new Date());

const authModal = $("#authModal");
let authMode = "login";

function openAuth(mode="login"){
  authMode = mode;
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden","false");
  updateAuthUI();
}
function closeAuth(){
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden","true");
}
function updateAuthUI(){
  const signup = authMode === "signup";
  $("#authEyebrow").textContent = signup ? "CREATE YOUR SPACE" : "WELCOME BACK";
  $("#authTitle").textContent = signup ? "Start your LifeBox" : "Log in to LifeBox";
  $("#authSubtitle").textContent = signup ? "Create a personal space for everything important." : "Access your personal control center.";
  $("#nameField").classList.toggle("hidden", !signup);
  $("#nameField input").required = signup;
  $("#authSubmit").textContent = signup ? "Create account ↗" : "Log in ↗";
  $("#switchAuth").textContent = signup ? "Already have an account? Log in" : "Need an account? Sign up";
  $("#authStatus").textContent = "";
}
$$("[data-open-auth]").forEach(b => b.addEventListener("click", () => openAuth(b.dataset.openAuth)));
$$("[data-close-modal]").forEach(b => b.addEventListener("click", closeAuth));
$("#switchAuth").addEventListener("click", () => {authMode = authMode === "login" ? "signup" : "login"; updateAuthUI();});
authModal.addEventListener("click", e => {if(e.target === authModal) closeAuth();});

$("#authForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const users = JSON.parse(localStorage.getItem("lifebox_users") || "{}");
  const status = $("#authStatus");
  if(authMode === "signup"){
    if(users[data.email]){status.textContent = "An account already exists in this demo."; return;}
    users[data.email] = {name:data.name, email:data.email, password:data.password};
    localStorage.setItem("lifebox_users", JSON.stringify(users));
    localStorage.setItem("lifebox_session", JSON.stringify({name:data.name,email:data.email}));
    $("#heroName").textContent = data.name.split(" ")[0];
    status.textContent = "Demo account created. Your local session is active.";
  } else {
    if(!users[data.email] || users[data.email].password !== data.password){status.textContent = "Demo login failed. Check your details."; return;}
    localStorage.setItem("lifebox_session", JSON.stringify({name:users[data.email].name,email:data.email}));
    $("#heroName").textContent = users[data.email].name.split(" ")[0];
    status.textContent = "Logged in successfully in demo mode.";
  }
  setTimeout(closeAuth, 900);
});

const session = JSON.parse(localStorage.getItem("lifebox_session") || "null");
if(session?.name) $("#heroName").textContent = session.name.split(" ")[0];

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  if(!data.name || !data.email || !data.message) return;
  $("#contactStatus").textContent = "Message validated. Connect this form to Formspree, Resend or your own API to deliver it.";
  e.target.reset();
});

$("#menuToggle").addEventListener("click", () => {
  const links = $(".nav-links");
  links.style.display = links.style.display === "flex" ? "none" : "flex";
  links.style.position = "absolute";
  links.style.top = "82px";
  links.style.left = "0";
  links.style.right = "0";
  links.style.padding = "25px";
  links.style.background = "#0d111a";
  links.style.flexDirection = "column";
});

if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  gsap.from(".navbar", {y:-30, opacity:0, duration:1, ease:"power3.out"});
  gsap.from(".hero-copy > *", {y:35, opacity:0, duration:1, stagger:.09, delay:.2, ease:"power3.out"});
  gsap.to(".orb-one", {x:25, y:-25, duration:5, repeat:-1, yoyo:true, ease:"sine.inOut"});
  gsap.to(".orb-two", {x:-20, y:25, duration:6, repeat:-1, yoyo:true, ease:"sine.inOut"});
  gsap.to(".dashboard-card", {y:-12, duration:4, repeat:-1, yoyo:true, ease:"sine.inOut"});
  gsap.utils.toArray(".reveal").forEach(el => {
    gsap.from(el, {scrollTrigger:undefined, y:30, opacity:0, duration:.8, delay:.05, ease:"power2.out",
      scrollTrigger:{trigger:el, start:"top 88%", once:true}});
  });
}
$$(".tilt-card").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform = `perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});
