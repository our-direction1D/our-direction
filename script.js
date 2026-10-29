// Initialize Supabase (Only once)
const SUPABASE_URL = 'https://sqtvpilfhyssmombmsnv.supabase.co';
const SUPABASE_KEY = 'sb_publishable_nnZHtn1NxcNSJVzb5O6-qg_g0MQb8R_';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const KEY = 'ourDirectionV8';
const ADMIN_EMAIL = 'admin@ourdirection.test';
const ADMIN_PASSWORD = 'admin123';

const DEFAULTS = {
 jokes: [
  "Louis has a carrot. We have questions. He has no answers.",
  "If you need directions, ask One Direction. If you need a carrot, apparently ask Louis.",
  "The real Take Me Home was the five people we mildly lost along the way.",
  "Breaking news: fan opens Fan Wall, immediately forgets what they were doing.",
  "This website contains zero sensible levels of nostalgia.",
  "Five boys, one plane seat, absolutely no concept of personal space.",
  "Somewhere, someone just said 'my favourite album is all five' and started a diplomatic crisis."
 ],
 randomBits: [
  "🎵 Random song: Stockholm Syndrome",
  "💭 Question: What 1D song would you introduce to someone first?",
  "🎯 Challenge: Rank your top 5 1D songs.",
  "💿 Album roulette landed on FOUR.",
  "🥕 Louis has been assigned one carrot. He has requested seventeen.",
  "🎤 Pick a 1D song and invent the most dramatic music-video plot possible.",
  "🧠 Trivia: Which member auditioned for The X Factor twice?",
  "📸 Find your oldest 1D photo and give it a dramatic caption."
 ],
 challenges: [
  "Describe your favourite 1D song using only emojis.",
  "Rank the five albums without starting an international incident.",
  "What's the first 1D song you remember hearing?",
  "Write the most overdramatic two-line review of a 1D song you can.",
  "Name five 1D songs in ten seconds.",
  "Choose one song that should have been the opening track of a sixth album."
 ],
 thisOrThat: [['NIGHT CHANGES','STORY OF MY LIFE'],['FOUR','MADE IN THE A.M.'],['NIALL','LOUIS'],['2013 1D','2015 1D']],
 songGame: [
  {answer:'Stockholm Syndrome',clues:['This song appears on FOUR.','Fans often describe it as one of the darker, more intense songs in the catalogue.','The title is two words.']},
  {answer:'Night Changes',clues:['This song appears on FOUR.','Its video follows several different dates.','The title contains the word “Changes”.']},
  {answer:'History',clues:['This song appears on Made in the A.M.','Its video looks back through the group’s story.','The title is one word.']}
 ]
};

const DEFAULT_DATA = {
 users: [{id:'admin',username:'directionadmin',email:ADMIN_EMAIL,password:ADMIN_PASSWORD,admin:true,joined:'2010',stats:{gamesPlayed:0,quizPlays:0}}],
 currentUser: null,
 site: {
  slogan: 'FIVE VOICES. ONE STORY. OUR DIRECTION.',
  copy: 'A fan-made corner for the memories, the music, the jokes, the facts nobody remembers and the pictures that deserve to live forever.',
  quote: 'Because technically we’re all just trying to find our way home.',
  footer1: 'OUR DIRECTION ★', footer2: 'UNOFFICIAL FAN PROJECT · MEDIA CREDITS REQUIRED', footer3: 'COPYRIGHT / DISCLAIMER',
  wallIntro: 'Approved memories, messages, pictures and videos from fans. Cards grow with the content — no forced square crops.',
  funIntro: 'Games, polls, challenges, random nonsense and things that may reveal whether you are actually a certified Directioner.',
  quizIntro: 'Take a quiz, filter by difficulty, or make your own if you have an account. Community quizzes go live immediately, while admins can still edit or delete them.',
  factsIntro: 'We want the weird, specific and genuinely interesting stuff — with a source. Facts stay pending until an admin checks them.',
  updatesIntro: 'Site news, fan-project announcements and community updates. Fan-submitted updates are checked by admins before they go live.',
  communityIntro: 'Profiles, badges, activity and your own little Directioner stats page.',
  submitIntro: 'Pictures and videos are welcome. Credits are required for uploaded media, and every contribution goes to the moderation queue first.',
  rulesIntro: 'Short version: be funny, be creative, be respectful, and don’t ruin the space for everyone else.'
 },
 fun: { ...structuredClone(DEFAULTS) },
 submissions: [],
 facts: [],
 updates: [],
 quizzes: [],
 poll: { id: 'poll-default', question: 'Which 1D album would you bring back for a new era?', options: ['Up All Night','Take Me Home','Midnight Memories','FOUR','Made in the A.M.'], votes: {'Up All Night':3,'Take Me Home':5,'Midnight Memories':7,'FOUR':12,'Made in the A.M.':9} },
 gamesPlayed: 0
};

function deepClone(x) { return JSON.parse(JSON.stringify(x)); }
let stored = null; try { stored = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch(e) { stored = null; }
let data = stored || deepClone(DEFAULT_DATA);

function migrate() {
 if (!Array.isArray(data.users)) data.users = [];
 let admin = data.users.find(u => u.admin);
 if (!admin) {
  admin = { id: 'admin', username: 'directionadmin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD, admin: true, joined: '2010' };
  data.users.unshift(admin);
 }
 data.users.forEach(u => {
  u.stats = u.stats || {};
  if (typeof u.stats.gamesPlayed !== 'number') u.stats.gamesPlayed = 0;
  if (typeof u.stats.quizPlays !== 'number') u.stats.quizPlays = 0;
 });
 if (!data.site) data.site = deepClone(DEFAULT_DATA.site);
 else Object.assign(data.site, deepClone(DEFAULT_DATA.site), data.site);
 if (!data.fun) data.fun = deepClone(DEFAULTS);
 save();
}

function save() { localStorage.setItem(KEY, JSON.stringify(data)); }
migrate();

function esc(s = '') { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])); }
function uid(prefix = 'x') { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function current() { return data.users.find(u => u.id === data.currentUser); }
function toast(x) {
 const t = document.getElementById('toast');
 if (!t) return;
 t.textContent = x;
 t.classList.add('show');
 clearTimeout(window.__toast);
 window.__toast = setTimeout(() => t.classList.remove('show'), 2600);
}

function likeButton(item) {
 const u = current();
 const liked = u && Array.isArray(item.likedBy) && item.likedBy.includes(u.id);
 const count = Array.isArray(item.likedBy) ? item.likedBy.length : (Number(item.likes) || 0);
 return `<button class="like-btn ${liked ? 'liked' : ''}" data-like-id="${esc(item.id)}" aria-pressed="${liked}">♥ <span>${count}</span> ${liked ? 'LIKED' : 'LIKE'}</button>`;
}

function bindLikes() {
 document.querySelectorAll('.like-btn').forEach(btn => btn.onclick = async () => {
  const u = current();
  if (!u) { toast('Log in to like a message.'); location.hash = 'login'; return; }
  const id = btn.dataset.likeId;
  const item = data.submissions.find(s => s.id === id);
  if (!item) return;
  item.likedBy = Array.isArray(item.likedBy) ? item.likedBy : [];
  const i = item.likedBy.indexOf(u.id);
  if (i >= 0) item.likedBy.splice(i, 1); else item.likedBy.push(u.id);
  item.likes = item.likedBy.length;
  
  await supabase.from('wall_posts').update({ likes: item.likes, liked_by: item.likedBy }).eq('id', id);
  renderWall();
  renderCommunity();
  toast(i >= 0 ? 'Like removed.' : 'Liked!');
 });
}

function go() {
 const id = location.hash.slice(1) || 'home';
 document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.id === id));
 render();
 window.scrollTo(0, 0);
 if (window.innerWidth <= 850) {
  const nav = document.getElementById('nav');
  if (nav) nav.style.display = '';
 }
}
window.addEventListener('hashchange', go);

const menuBtn = document.getElementById('menuBtn');
if (menuBtn) {
 menuBtn.onclick = () => {
  const n = document.getElementById('nav');
  if (n) n.style.display = n.style.display === 'flex' ? '' : 'flex';
 };
}

function renderNav() {
 const a = document.getElementById('authNav');
 if (!a) return;
 const u = current();
 a.innerHTML = u ? `<a href="#community">@${esc(u.username)}</a>${u.admin ? '<a href="#admin">CONTROL ROOM</a>' : ''}<a href="#" id="logout">LOG OUT</a>` : '<a href="#login">LOG IN</a><a href="#signup" class="join-link">JOIN</a>';
 const l = document.getElementById('logout');
 if (l) l.onclick = e => { e.preventDefault(); data.currentUser = null; save(); toast('Logged out.'); location.hash = 'home'; };
}

function mediaMarkup(s, cls = 'submission-media') {
 if (s.video) return `<video class="${cls}" controls preload="metadata" src="${s.video}"></video>`;
 if (s.image) return `<img class="${cls}" src="${s.image}" alt="Fan-submitted picture">`;
 return '';
}

function submissionCard(s, withDelete = false) {
 const long = (s.text || '').length > 650;
 return `<article class="submission-card ${long ? 'long-post' : ''}">${mediaMarkup(s)}<div class="submission-body"><span class="tag">${esc(s.category)}</span><p class="post-text">${esc(s.text || '')}</p>${s.credit ? `<div class="media-credit"><b>Credit:</b> ${esc(s.credit)}</div>` : ''}<div class="post-meta"><div><div class="username">${esc(s.user)}</div><small>${esc(s.date || '')}</small></div>${likeButton(s)}</div>${withDelete ? `<button class="small own-delete" data-id="${esc(s.id)}">DELETE MY POST</button>` : ''}</div></article>`;
}

async function renderWall(filter = 'all') {
 const { data: posts, error } = await supabase.from('wall_posts').select('*').eq('status', 'approved').order('created_at', { ascending: false });
 if (error) { console.error('Error loading posts:', error); return; }
 
 data.submissions = (posts || []).map(p => ({
  id: p.id,
  user: p.user_name || p.username,
  category: p.category,
  text: p.message || p.text,
  image: p.image,
  video: p.video,
  credit: p.credit,
  status: p.status,
  date: p.date,
  likes: p.likes || 0,
  likedBy: p.liked_by || []
 }));

 const list = data.submissions.filter(s => filter === 'all' || s.category === filter);
 const wallSub = document.getElementById('wallSubmissions');
 const homeSub = document.getElementById('homeSubmissions');
 if (wallSub) wallSub.innerHTML = list.length ? list.map(submissionCard).join('') : '<div class="empty">Nothing here yet. Add yours!</div>';
 if (homeSub) homeSub.innerHTML = list.slice(0, 3).map(submissionCard).join('') || '<div class="empty">The wall is waiting for you.</div>';
 bindLikes();
}

document.querySelectorAll('.filter').forEach(b => b.onclick = () => {
 document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
 b.classList.add('active');
 renderWall(b.dataset.filter);
});

async function renderFacts() {
 const { data: facts, error } = await supabase.from('facts').select('*').eq('status', 'approved').order('created_at', { ascending: false });
 if (error) { console.error('Error loading facts:', error); return; }
 data.facts = (facts || []).map(f => ({ id: f.id, user: f.user_name, category: f.category, text: f.text, source: f.source, status: f.status }));
 const factsList = document.getElementById('factsList');
 if (factsList) factsList.innerHTML = data.facts.map(f => `<article class="fact-card"><span class="tag">${esc(f.category)}</span><h3>DID YOU KNOW?</h3><p>${esc(f.text)}</p><div class="fact-source"><b>Source:</b> ${esc(f.source)}<br><b>Submitted by:</b> ${esc(f.user)}</div></article>`).join('') || '<div class="empty">No facts yet.</div>';
}

async function renderUpdates() {
 const { data: updates, error } = await supabase.from('updates').select('*').eq('status', 'approved').order('created_at', { ascending: false });
 if (error) { console.error('Error loading updates:', error); return; }
 data.updates = (updates || []).map(u => ({ id: u.id, title: u.title, body: u.body, date: u.date, user: u.user_name, status: u.status }));
 const updatesList = document.getElementById('updatesList');
 if (updatesList) updatesList.innerHTML = data.updates.length ? data.updates.map(u => `<article class="update"><small>${esc(u.date)}</small><h2>${esc(u.title)}</h2><p>${esc(u.body)}</p><small>Posted by ${esc(u.user || '@directionadmin')}</small></article>`).join('') : '<div class="empty">No public updates yet.</div>';
}

function renderSubmit() {
 const box = document.getElementById('submitArea');
 if (!box) return;
 const u = current();
 if (!u) {
  box.innerHTML = '<div class="submit-box"><h2>JOIN FIRST</h2><p>Create an account so the site knows which username to attach to your contribution.</p><a class="btn red" href="#signup">SIGN UP</a> <a class="btn white" href="#login">LOG IN</a></div>';
  return;
 }
 box.innerHTML = `<div class="submit-box"><form id="submissionForm"><label>Category<select id="category"><option>One Direction</option><option>Harry</option><option>Louis</option><option>Liam</option><option>Zayn</option><option>Niall</option></select></label><label>Your post<textarea id="message" maxlength="3000" placeholder="Memory, joke, story, fan message..."></textarea></label><label>Add one picture or video <input id="media" type="file" accept="image/*,video/*"></label><div id="preview"></div><div id="creditWrap" class="conditional-media"><label>Credits / source for your media<input id="credit" maxlength="500" placeholder="e.g. My own photo / @creator / source URL"></label><label class="check-label"><input id="rightsCheck" type="checkbox"> I have the right to share this content.</label></div><button class="btn red">SEND TO THE FAN WALL →</button></form></div>`;
 const form = document.getElementById('submissionForm');
 if (form) form.onsubmit = submitPost;
}

async function submitPost(e) {
 e.preventDefault();
 const u = current();
 if (!u) return toast('Log in first!');

 const mediaFile = document.getElementById('media').files[0];
 const category = document.getElementById('category').value;
 const message = document.getElementById('message').value.trim();
 const credit = document.getElementById('credit')?.value.trim() || '';

 if (mediaFile && !credit) return toast('Please add a credit/source for your media.');
 if (mediaFile && !document.getElementById('rightsCheck').checked) return toast('Please confirm media rights.');

 let mediaUrl = null;
 let mediaType = null;

 if (mediaFile) {
  const fileExt = mediaFile.name.split('.').pop();
  const filePath = `${uid('media')}.${fileExt}`;

  toast('Uploading media...');
  const { error: uploadError } = await supabase.storage.from('fan-media').upload(filePath, mediaFile);
  if (uploadError) return toast('Media upload failed: ' + uploadError.message);

  const { data: publicUrlData } = supabase.storage.from('fan-media').getPublicUrl(filePath);
  mediaUrl = publicUrlData.publicUrl;
  mediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image';
 }

 const { error } = await supabase.from('wall_posts').insert([{
  user_name: '@' + u.username,
  category: category,
  message: message,
  image: mediaType === 'image' ? mediaUrl : null,
  video: mediaType === 'video' ? mediaUrl : null,
  media_type: mediaType,
  credit: credit,
  status: 'pending',
  date: new Date().toISOString().slice(0, 10),
  likes: 0,
  liked_by: []
 }]);

 if (error) toast('Failed to save post: ' + error.message);
 else { toast('Submitted! Pending admin approval.'); location.hash = 'community'; }
}

const factForm = document.getElementById('factForm');
if (factForm) {
 factForm.onsubmit = async (e) => {
  e.preventDefault();
  const u = current();
  if (!u) return toast('Log in first.');
  const { error } = await supabase.from('facts').insert([{
   user_name: '@' + u.username,
   category: document.getElementById('factCategory').value,
   text: document.getElementById('factText').value.trim(),
   source: document.getElementById('factSource').value.trim(),
   status: 'pending',
   date: new Date().toISOString().slice(0, 10)
  }]);
  if (error) toast('Error: ' + error.message);
  else { toast('Fact sent to admins!'); e.target.reset(); location.hash = 'community'; }
 };
}

const updateSubmitForm = document.getElementById('updateSubmitForm');
if (updateSubmitForm) {
 updateSubmitForm.onsubmit = async (e) => {
  e.preventDefault();
  const u = current();
  if (!u) return toast('Log in first.');
  const { error } = await supabase.from('updates').insert([{
   title: document.getElementById('updateSubmitTitle').value.trim(),
   body: document.getElementById('updateSubmitBody').value.trim(),
   user_name: '@' + u.username,
   status: 'pending',
   date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }]);
  if (error) toast('Error: ' + error.message);
  else { toast('Update sent to news desk!'); e.target.reset(); location.hash = 'community'; }
 };
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
 signupForm.onsubmit = e => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value.trim().replace(/^@/,''), email = document.getElementById('signupEmail').value.trim().toLowerCase(), password = document.getElementById('signupPassword').value;
  if (data.users.some(u => u.email === email || u.username.toLowerCase() === username.toLowerCase())) return toast('Username or email already taken.');
  const u = { id: uid('u'), username, email, password, admin: false, joined: new Date().getFullYear(), stats: { gamesPlayed: 0, quizPlays: 0 } };
  data.users.push(u); data.currentUser = u.id; save(); toast('Welcome to OUR DIRECTION!'); location.hash = 'community';
 };
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
 loginForm.onsubmit = e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase(), password = document.getElementById('loginPassword').value, u = data.users.find(x => x.email === email && x.password === password);
  if (!u) return toast('Incorrect email or password.');
  data.currentUser = u.id; save(); toast('Welcome back!'); location.hash = 'community';
 };
}

function pollMarkup(target) {
 const box = document.getElementById(target);
 if (!box) return;
 const p = data.poll, total = Object.values(p.votes || {}).reduce((a, b) => a + Number(b || 0), 0);
 box.innerHTML = `<div class="poll-question">${esc(p.question)}</div><div class="poll-options">${p.options.map(o => { const n = Number(p.votes[o] || 0), pct = total ? Math.round(n / total * 100) : 0; return `<button class="poll-option" data-opt="${esc(o)}"><span>${esc(o)}</span><b>${pct}%</b><span class="bar"><i style="width:${pct}%"></i></span></button>`; }).join('')}</div><small>${total} votes so far</small>`;
 box.querySelectorAll('.poll-option').forEach(b => b.onclick = () => {
  const u = current();
  if (!u) { toast('Log in to vote.'); location.hash = 'login'; return; }
  const key = 'odPollVoted_' + p.id + '_' + u.id;
  if (localStorage.getItem(key)) return toast('You already voted.');
  p.votes[b.dataset.opt] = (p.votes[b.dataset.opt] || 0) + 1;
  localStorage.setItem(key, '1'); save(); pollMarkup(target); toast('Vote counted!');
 });
}
function renderPoll() { pollMarkup('pollArea'); }
function renderHomePollFact() { pollMarkup('homePoll'); }

function renderStats() {
 const u = document.getElementById('statUsers');
 const m = document.getElementById('statMessages');
 const q = document.getElementById('statQuizzes');
 const g = document.getElementById('statGames');
 if (u) u.textContent = data.users.length;
 if (m) m.textContent = data.submissions.length;
 if (q) q.textContent = data.quizzes.length;
 if (g) g.textContent = data.gamesPlayed || 0;
}

function renderCommunity() {
 const box = document.getElementById('communityArea');
 if (!box) return;
 const u = current();
 if (!u) { box.innerHTML = '<div class="community-landing section"><article class="home-card"><h2>JOIN THE COMMUNITY</h2><a class="btn red" href="#signup">SIGN UP</a> <a class="btn white" href="#login">LOG IN</a></article></div>'; return; }
 box.innerHTML = `<div class="profile-layout section"><aside class="profile-card"><h2>@${esc(u.username)}</h2></aside><div class="profile-main"><h2>WELCOME BACK</h2></div></div>`;
}

function renderAdmin() {
 const box = document.getElementById('adminArea');
 if (!box) return;
 const u = current();
 if (!u?.admin) { box.innerHTML = '<div class="empty">This area is private.</div>'; return; }
 box.innerHTML = `<div class="admin-box"><h2>ADMIN CONTROL ROOM</h2><p>Manage posts, facts, and updates directly in your Supabase Dashboard table editor!</p></div>`;
}

function render() {
 renderNav();
 renderWall();
 renderFacts();
 renderSubmit();
 renderUpdates();
 renderPoll();
 renderHomePollFact();
 renderStats();
 renderCommunity();
 renderAdmin();
}

go();
