// Initialize Supabase
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
 else {
  data.fun.randomBits = data.fun.randomBits || deepClone(DEFAULTS.randomBits);
  data.fun.jokes = data.fun.jokes || deepClone(DEFAULTS.jokes);
  data.fun.challenges = data.fun.challenges || deepClone(DEFAULTS.challenges);
  data.fun.thisOrThat = data.fun.thisOrThat || deepClone(DEFAULTS.thisOrThat);
  data.fun.songGame = data.fun.songGame || deepClone(DEFAULTS.songGame);
 }
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

function incGame() {
 const u = current();
 if (u) { u.stats = u.stats || {}; u.stats.gamesPlayed = (u.stats.gamesPlayed || 0) + 1; }
 data.gamesPlayed = (data.gamesPlayed || 0) + 1;
 save();
 renderStats();
 renderCommunity();
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

let wallFilter = 'all';
async function renderWall(filter = wallFilter) {
 wallFilter = filter;
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

const findMineBtn = document.getElementById('findMine');
if (findMineBtn) {
 findMineBtn.onclick = () => {
  const u = current(), box = document.getElementById('wallMine');
  if (!box) return;
  if (!u) { box.innerHTML = '<div class="notice">Log in or sign up first and we can show every message you have posted.</div>'; return; }
  const mine = data.submissions.filter(s => s.user === '@' + u.username);
  box.innerHTML = `<div class="mine-box"><h2>YOUR MESSAGES</h2><p>${mine.length} submission(s) found. Like counts are shown; individual likers are never displayed.</p>${mine.length ? mine.map(s => submissionCard(s, true)).join('') : '<p>You have not posted anything yet.</p>'}</div>`;
  box.querySelectorAll('.own-delete').forEach(btn => btn.onclick = () => {
   const i = data.submissions.findIndex(s => s.id === btn.dataset.id);
   if (i >= 0 && data.submissions[i].user === '@' + u.username) {
    data.submissions.splice(i, 1);
    save();
    toast('Your post was deleted.');
    findMineBtn.click();
    renderWall();
   }
  });
  bindLikes();
 };
}

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
function renderHomePollFact() {
 pollMarkup('homePoll');
 const fs = data.facts.filter(x => x.status === 'approved');
 const hFact = document.getElementById('homeFact');
 if (hFact) hFact.textContent = fs[Math.floor(Math.random() * fs.length)]?.text || 'More facts coming soon.';
}

let totIndex = 0, songIndex = 0, songClue = 0;
function nextTot() {
 const qs = data.fun?.thisOrThat || [];
 if (!qs.length) return;
 const q = qs[totIndex % qs.length];
 const qEl = document.getElementById('totQuestion');
 if (qEl) qEl.textContent = `${q[0]} OR ${q[1]}?`;
 document.querySelectorAll('.choice').forEach((b, i) => b.textContent = q[i]);
}

function resetSong() {
 const games = data.fun?.songGame || [];
 if (!games.length) return;
 songIndex = Math.floor(Math.random() * games.length);
 songClue = 0;
 const cEl = document.getElementById('songClue');
 const rEl = document.getElementById('songResult');
 const gEl = document.getElementById('songGuess');
 if (cEl) cEl.textContent = 'Clue 1: ' + games[songIndex].clues[0];
 if (rEl) rEl.textContent = '';
 if (gEl) gEl.value = '';
}

const njBtn = document.getElementById('newJoke');
if (njBtn) njBtn.onclick = () => { const j = document.getElementById('joke'); if (j) j.textContent = (data.fun.jokes || [])[Math.floor(Math.random() * (data.fun.jokes || []).length)] || 'No joke loaded.'; };

const rbBtn = document.getElementById('randomBtn');
if (rbBtn) rbBtn.onclick = () => { const r = document.getElementById('randomResult'); if (r) r.textContent = (data.fun.randomBits || [])[Math.floor(Math.random() * (data.fun.randomBits || []).length)] || 'The chaos cupboard is empty.'; incGame(); };

document.querySelectorAll('.choice').forEach(b => b.onclick = () => {
 const qs = data.fun.thisOrThat || [];
 const q = qs[totIndex % qs.length];
 const res = document.getElementById('totResult');
 if (res) res.textContent = `You chose ${b.textContent}. The extremely scientific community result is: ${Math.floor(55 + Math.random() * 31)}% agree.`;
 incGame();
 totIndex++;
 nextTot();
});

const scBtn = document.getElementById('songClueBtn');
if (scBtn) scBtn.onclick = () => {
 const games = data.fun.songGame || [];
 if (!games.length) return;
 songClue = Math.min(songClue + 1, games[songIndex].clues.length - 1);
 const cEl = document.getElementById('songClue');
 if (cEl) cEl.textContent = 'Clue ' + (songClue + 1) + ': ' + games[songIndex].clues[songClue];
};

const sgBtn = document.getElementById('songGuessBtn');
if (sgBtn) sgBtn.onclick = () => {
 const games = data.fun.songGame || [];
 if (!games.length) return;
 const g = (document.getElementById('songGuess')?.value || '').trim().toLowerCase();
 const a = games[songIndex].answer.toLowerCase();
 const rEl = document.getElementById('songResult');
 if (g === a) {
  if (rEl) rEl.textContent = 'CORRECT. You are annoyingly good at this. 🎯';
  incGame();
  setTimeout(resetSong, 500);
 } else {
  if (rEl) rEl.textContent = 'Nope. Try again or use another clue.';
 }
};

const ncBtn = document.getElementById('newChallenge');
if (ncBtn) ncBtn.onclick = () => {
 const arr = data.fun.challenges || [];
 const ct = document.getElementById('challengeText');
 if (ct) ct.textContent = arr[Math.floor(Math.random() * arr.length)] || 'No challenge loaded.';
};

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

let quizFilter = 'all';
function renderQuizList(diff = quizFilter) {
 quizFilter = diff;
 const list = data.quizzes.filter(q => q.status === 'approved' && (diff === 'all' || q.difficulty === diff));
 const qList = document.getElementById('quizList');
 if (qList) {
  qList.innerHTML = list.map(q => `<article class="quiz-card"><span class="tag">${esc(q.difficulty)}</span><small>${esc(q.category)} · ${q.plays || 0} plays · ${q.questions.length} questions</small><h2>${esc(q.title)}</h2><p>${esc(q.description || '')}</p><b>BY ${esc(q.creator)}</b><button class="btn red take-quiz" data-id="${esc(q.id)}">TAKE QUIZ →</button></article>`).join('') || '<div class="empty">No quizzes in that category yet.</div>';
 }
 document.querySelectorAll('.take-quiz').forEach(b => b.onclick = () => runQuiz(b.dataset.id));
}

document.querySelectorAll('.quiz-filter').forEach(b => b.onclick = () => {
 document.querySelectorAll('.quiz-filter').forEach(x => x.classList.remove('active'));
 b.classList.add('active');
 renderQuizList(b.dataset.diff);
});

function runQuiz(id) {
 const q = data.quizzes.find(x => x.id === id);
 if (!q || !q.questions.length) return toast('This quiz has no questions yet.');
 const wrap = document.getElementById('quizRunner');
 if (!wrap) return;
 wrap.innerHTML = `<div class="modal"><button class="close" id="closeQuiz">×</button><small>${esc(q.difficulty)} · ${esc(q.category)} · ${q.questions.length} questions</small><h2>${esc(q.title)}</h2><form id="quizForm">${q.questions.map((x, i) => `<fieldset><legend>${i + 1}. ${esc(x.q)}</legend>${x.choices.map((c, j) => `<label class="quiz-choice"><input type="radio" name="q${i}" value="${j}" required>${esc(c)}</label>`).join('')}</fieldset>`).join('')}<button class="btn red">FINISH QUIZ</button></form><div id="quizScore"></div></div>`;
 wrap.classList.add('show');
 document.getElementById('closeQuiz').onclick = () => wrap.classList.remove('show');
 document.getElementById('quizForm').onsubmit = e => {
  e.preventDefault();
  let score = 0;
  q.questions.forEach((x, i) => { if (Number(new FormData(e.target).get('q' + i)) === x.answer) score++; });
  q.plays = (q.plays || 0) + 1;
  const u = current();
  if (u) { u.stats = u.stats || {}; u.stats.quizPlays = (u.stats.quizPlays || 0) + 1; }
  incGame();
  const pct = Math.round(score / q.questions.length * 100);
  const msg = pct === 100 ? 'CERTIFIED DIRECTIONER.' : 'Solid effort. The rabbit hole goes deeper.';
  document.getElementById('quizScore').innerHTML = `<div class="score-card"><strong>${score}/${q.questions.length}</strong><p>${pct}% — ${msg}</p>${q.questions.map((x, i) => `<p><b>${i + 1}.</b> Correct answer: ${esc(x.choices[x.answer])}. ${esc(x.explain || '')}</p>`).join('')}<button type="button" class="btn white" id="closeScore">BACK TO QUIZZES</button></div>`;
  document.getElementById('closeScore').onclick = () => wrap.classList.remove('show');
  renderQuizList();
 };
}

function renderQuizMaker() {
 const box = document.getElementById('quizMaker'), u = current();
 if (!box) return;
 if (!u) { box.innerHTML = '<h2>WANT TO MAKE A QUIZ?</h2><p>Sign up first. Community quizzes go live immediately. Admins can still edit or delete them.</p><a class="btn red" href="#signup">JOIN TO CREATE</a>'; return; }
 box.innerHTML = `<h2>CREATE A QUIZ</h2><p>Build as many questions as you want, with as many multiple-choice options as you need. Quizzes go live immediately.</p><form id="quizMakerForm"><label>Title<input id="qTitle" maxlength="80" required placeholder="e.g. How Well Do You Know FOUR?"></label><label>Description<input id="qDesc" maxlength="180" placeholder="What is this quiz about?"></label><div class="editor-grid"><label>Category<select id="qCat"><option>Songs</option><option>Albums</option><option>Members</option><option>1D History</option><option>Performances</option><option>Music Videos</option><option>Trivia</option><option>Fandom</option><option>Hard/Expert</option></select></label><label>Difficulty<select id="qDiff"><option>Easy</option><option>Medium</option><option>Hard</option><option>Expert</option></select></label></div><div id="makerQuestions"></div><button type="button" class="small" id="addQuestion">+ ADD ANOTHER QUESTION</button><button type="submit" class="btn red">POST QUIZ NOW →</button></form>`;
 const qbox = document.getElementById('makerQuestions');
 function addQuestion(q = { q: '', choices: ['', '', '', ''], answer: 0, explain: '' }) {
  const idx = qbox.children.length;
  const el = document.createElement('div');
  el.className = 'question-builder';
  el.innerHTML = `<div class="builder-head"><h3>QUESTION ${idx + 1}</h3><button type="button" class="small remove-question">REMOVE</button></div><label>Question<input class="qb-question" required value="${esc(q.q)}" placeholder="Write the question..."></label><div class="option-builder">${q.choices.map((c, j) => `<label>Option ${j + 1}<input class="qb-choice" value="${esc(c)}" required></label>`).join('')}</div><button type="button" class="small add-option">+ ADD OPTION</button><label>Correct option<select class="qb-answer">${q.choices.map((c, j) => `<option value="${j}" ${j === q.answer ? 'selected' : ''}>Option ${j + 1}</option>`).join('')}</select></label><label>Explanation<input class="qb-explain" maxlength="240" value="${esc(q.explain || '')}" placeholder="Optional explanation"></label>`;
  qbox.appendChild(el);
  el.querySelector('.remove-question').onclick = () => { if (qbox.children.length <= 1) return toast('Keep at least one question.'); el.remove(); renumberQuestionBuilders(); };
  el.querySelector('.add-option').onclick = () => {
   const options = el.querySelector('.option-builder');
   const n = options.children.length + 1;
   if (n > 12) return toast('Keep quizzes to 12 options per question.');
   const lab = document.createElement('label');
   lab.innerHTML = `Option ${n}<input class="qb-choice" required>`;
   options.appendChild(lab);
   updateAnswerSelect(el);
  };
  el.querySelectorAll('.qb-choice').forEach(i => i.addEventListener('input', () => updateAnswerSelect(el)));
  updateAnswerSelect(el);
 }
 function updateAnswerSelect(el) {
  const sel = el.querySelector('.qb-answer'), n = el.querySelectorAll('.qb-choice').length, old = Number(sel.value);
  sel.innerHTML = Array.from({ length: n }, (_, j) => `<option value="${j}">Option ${j + 1}</option>`).join('');
  sel.value = String(Math.min(old, n - 1));
 }
 function renumberQuestionBuilders() { qbox.querySelectorAll('.question-builder').forEach((el, i) => el.querySelector('h3').textContent = `QUESTION ${i + 1}`); }
 addQuestion();
 document.getElementById('addQuestion').onclick = () => addQuestion();
 document.getElementById('quizMakerForm').onsubmit = e => {
  e.preventDefault();
  const questions = [...qbox.querySelectorAll('.question-builder')].map(el => ({
   q: el.querySelector('.qb-question').value.trim(),
   choices: [...el.querySelectorAll('.qb-choice')].map(x => x.value.trim()).filter(Boolean),
   answer: Number(el.querySelector('.qb-answer').value),
   explain: el.querySelector('.qb-explain').value.trim()
  }));
  if (questions.some(q => q.choices.length < 2)) return toast('Each question needs at least two options.');
  data.quizzes.unshift({ id: uid('q'), title: document.getElementById('qTitle').value.trim(), description: document.getElementById('qDesc').value.trim(), category: document.getElementById('qCat').value, difficulty: document.getElementById('qDiff').value, plays: 0, creator: '@' + u.username, status: 'approved', questions });
  save();
  toast('Quiz posted!');
  e.target.reset();
  location.hash = 'quizzes';
 };
}

function renderCommunity() {
 const box = document.getElementById('communityArea'), u = current();
 if (!box) return;
 if (!u) { box.innerHTML = '<div class="community-landing section"><article class="home-card"><h2>JOIN THE COMMUNITY</h2><p>Pick a username, build badges, make quizzes, post memories and become part of the chaos.</p><a class="btn red" href="#signup">SIGN UP</a> <a class="btn white" href="#login">LOG IN</a></article></div>'; return; }
 u.stats = u.stats || { gamesPlayed: 0, quizPlays: 0 };
 const posts = data.submissions.filter(x => x.user === '@' + u.username), quizzes = data.quizzes.filter(x => x.creator === '@' + u.username), facts = data.facts.filter(x => x.user === '@' + u.username), updates = data.updates.filter(x => x.user === '@' + u.username), badges = [];
 if (posts.length >= 1) badges.push('FIRST MESSAGE');
 if (posts.length >= 5) badges.push('WALL REGULAR');
 if (quizzes.length >= 1) badges.push('QUIZ CREATOR');
 if (u.stats.gamesPlayed >= 5) badges.push('CHAOS PARTICIPANT');
 const pending = [...posts, ...facts, ...updates].filter(x => x.status === 'pending').length;
 box.innerHTML = `<div class="profile-layout section"><aside class="profile-card"><div class="avatar">${esc(u.username[0]?.toUpperCase() || 'D')}</div><h2>@${esc(u.username)}</h2><p>Certified Directioner in training.</p><div class="badges">${badges.length ? badges.map(b => `<span>${esc(b)}</span>`).join('') : '<small>Your first badge is waiting for you.</small>'}</div><div class="profile-note">Likes on your posts are anonymous: you see the number, never the names.</div></aside><div class="profile-main"><div class="stats-cards"><div><b>${posts.length}</b><span>wall messages</span></div><div><b>${quizzes.length}</b><span>quizzes made</span></div><div><b>${u.stats.gamesPlayed}</b><span>games played</span></div><div><b>${u.stats.quizPlays}</b><span>quiz plays</span></div></div><div class="home-card"><small>ACTIVITY</small><h2>YOUR DIRECTIONER TRAIL</h2><p>Games played counts only completed games/quiz attempts.</p><p>Posts: ${posts.length} · Facts: ${facts.length} · Updates: ${updates.length} · Pending contributions: ${pending}</p></div><div class="home-card"><small>YOUR FAN WALL POSTS</small><div class="account-posts">${posts.length ? posts.map(s => submissionCard(s)).join('') : '<p>You have not posted to the Fan Wall yet.</p>'}</div></div></div></div>`;
 bindLikes();
}

function adminButtons(kind, x) {
 const base = '<div class="admin-actions">';
 if (kind === 'quiz') return base + `<button class="edit" onclick="adminEdit('${kind}','${x.id}')">EDIT</button><button class="delete" onclick="adminDelete('${kind}','${x.id}')">DELETE</button></div>`;
 let b = '';
 if (x.status === 'pending') b += `<button class="approve" onclick="adminStatus('${kind}','${x.id}','approved')">APPROVE</button><button class="reject" onclick="adminStatus('${kind}','${x.id}','rejected')">REJECT</button>`;
 if (x.status === 'rejected') b += `<button class="approve" onclick="adminStatus('${kind}','${x.id}','approved')">APPROVE</button>`;
 b += `<button class="edit" onclick="adminEdit('${kind}','${x.id}')">EDIT</button><button class="delete" onclick="adminDelete('${kind}','${x.id}')">DELETE</button>`;
 return base + b + '</div>';
}

function collectionFor(kind) { return kind === 'submission' ? 'submissions' : kind === 'fact' ? 'facts' : kind === 'update' ? 'updates' : 'quizzes'; }

function adminStatus(kind, id, status) {
 if (!current()?.admin) return;
 const x = data[collectionFor(kind)].find(v => v.id === id);
 if (!x) return;
 x.status = status;
 save();
 toast(status === 'approved' ? 'Approved.' : 'Rejected.');
 render();
 renderAdmin();
}

function adminDelete(kind, id) {
 if (!current()?.admin) return;
 const arr = data[collectionFor(kind)], i = arr.findIndex(v => v.id === id);
 if (i < 0) return;
 if (!confirm('Delete this content permanently?')) return;
 arr.splice(i, 1);
 save();
 toast('Deleted.');
 render();
 renderAdmin();
}

function adminEdit(kind, id) {
 if (!current()?.admin) return;
 const arr = data[collectionFor(kind)], x = arr.find(v => v.id === id);
 if (!x) return;
 if (kind === 'submission') {
  x.category = prompt('Category:', x.category) || x.category;
  x.text = prompt('Post text:', x.text || '') ?? x.text;
  x.credit = prompt('Credits / source:', x.credit || '') ?? x.credit;
 } else if (kind === 'fact') {
  x.category = prompt('Category:', x.category) || x.category;
  x.text = prompt('Fact:', x.text) || x.text;
  x.source = prompt('Source:', x.source) || x.source;
 } else if (kind === 'update') {
  x.title = prompt('Update title:', x.title) || x.title;
  x.body = prompt('Update body:', x.body) || x.body;
 }
 save();
 toast('Edited and saved.');
 render();
 renderAdmin();
}

function renderAdmin() {
 const box = document.getElementById('adminArea'), u = current();
 if (!box) return;
 if (!u?.admin) { box.innerHTML = '<div class="empty">This area is private.</div>'; return; }
 const ps = data.submissions.filter(x => x.status === 'pending'), pf = data.facts.filter(x => x.status === 'pending'), pu = data.updates.filter(x => x.status === 'pending');
 box.innerHTML = `<div class="admin-box"><div class="notice"><b>ADMIN CONTROL ROOM:</b> Wall posts, facts and updates go through moderation before publication.</div><div class="admin-top"><div class="stat"><small>PENDING POSTS</small><strong>${ps.length}</strong></div><div class="stat"><small>PENDING FACTS</small><strong>${pf.length}</strong></div><div class="stat"><small>PENDING UPDATES</small><strong>${pu.length}</strong></div><div class="stat"><small>USERS</small><strong>${data.users.length}</strong></div></div><div id="adminSection"></div></div>`;
}

function render() {
 renderNav();
 if (document.getElementById('heroSlogan')) document.getElementById('heroSlogan').textContent = data.site.slogan;
 if (document.getElementById('heroCopy')) document.getElementById('heroCopy').textContent = data.site.copy;
 if (document.getElementById('featuredQuote')) document.getElementById('featuredQuote').textContent = data.site.quote;
 if (document.getElementById('joke')) document.getElementById('joke').textContent = (data.fun.jokes || [])[Math.floor(Math.random() * (data.fun.jokes || []).length)] || 'Loading extremely important research...';
 
 const setP = (sel, txt) => { const el = document.querySelector(sel); if (el) el.textContent = txt; };
 setP('#wall .page-head p', data.site.wallIntro);
 setP('#fun .page-head p', data.site.funIntro);
 setP('#quizzes .page-head p', data.site.quizIntro);
 setP('#facts .page-head p', data.site.factsIntro);
 setP('#updates .page-head p', data.site.updatesIntro);
 setP('#community .page-head p', data.site.communityIntro);
 setP('#submit .page-head p', data.site.submitIntro);
 setP('#rules .page-head p', data.site.rulesIntro);
 setP('footer span:nth-child(1)', data.site.footer1);
 setP('footer span:nth-child(2)', data.site.footer2);
 setP('footer span:nth-child(3) a:first-child', data.site.footer3);

 renderWall();
 renderFacts();
 renderSubmit();
 renderAccount();
 renderUpdates();
 renderPoll();
 renderHomePollFact();
 renderStats();
 renderQuizList();
 renderQuizMaker();
 renderCommunity();
 renderAdmin();
 nextTot();
 if (document.getElementById('songGuess') && !document.getElementById('songGuess').value && !document.getElementById('songResult').textContent) {
  resetSong();
 }
}

function renderAccount() {
 const box = document.getElementById('accountArea');
 if (box) box.innerHTML = '<div class="empty">Your main account activity is now in the Community page.</div>';
}

// Run immediately when loaded
go();
