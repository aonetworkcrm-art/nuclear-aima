/* ══════════════════════════════════════════════
   NUCLEAR AIMA — BLOGGER SCHEDULER v1.0
   Planificador de Publicaciones con Calendario
   Calendario mensual · Programación · Notificaciones · SEO Integration
   La bestia más poderosa del universo 🔥
   ══════════════════════════════════════════════ */

/* ══════════════════════════════════════════════
   STATE
   ══════════════════════════════════════════════ */

let blogState = {
  posts: JSON.parse(localStorage.getItem('na_blog_posts') || '[]'),
  viewDate: new Date(),
  viewMode: 'calendar', // 'calendar' | 'list' | 'today'
  filterStatus: 'all',
  filterNiche: 'all',
  editingPostId: null,
  checkInterval: null,
  notificationsEnabled: false,
  nextPostId: parseInt(localStorage.getItem('na_blog_next_id') || '1'),
};

/* ── Drag & Drop State ── */
let blogDragData = {
  postId: null,
  sourceDate: null,
  draggedEl: null,
};

/* ── Default Post Templates ── */
const POST_STATUSES = [
  { id: 'draft', label: 'Borrador', icon: '📝', color: 'var(--muted2)' },
  { id: 'scheduled', label: 'Programado', icon: '📅', color: 'var(--info-bright)' },
  { id: 'published', label: 'Publicado', icon: '✅', color: 'var(--success-bright)' },
  { id: 'missed', label: 'Perdido', icon: '❌', color: 'var(--danger)' },
];

function getBlogNiches() {
  if (typeof CPC_NICHES !== 'undefined' && CPC_NICHES.length > 0) {
    return [...new Set(CPC_NICHES.map(n => n.cat))].map(c => ({ id: c.toLowerCase().replace(/[^a-z]/g,''), name: c }));
  }
  return [];
}

/* ══════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════ */

function getBlogPostId() {
  return blogState.nextPostId++;
}

function saveBlogState() {
  localStorage.setItem('na_blog_posts', JSON.stringify(blogState.posts));
  localStorage.setItem('na_blog_next_id', blogState.nextPostId.toString());
}

function formatBlogDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

function formatBlogTime(d) {
  const date = new Date(d);
  return date.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
}

function isToday(d) {
  const today = new Date();
  const date = new Date(d);
  return date.getFullYear() === today.getFullYear() &&
         date.getMonth() === today.getMonth() &&
         date.getDate() === today.getDate();
}

function isOverdue(d) {
  return new Date(d) < new Date() && !isToday(d);
}

function getMonthDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const weeks = [];
  let day = 1;
  let nextMonthDay = 1;
  let prevMonthDay = daysInPrevMonth - firstDay + 1;

  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      if (w === 0 && d < firstDay) {
        week.push({ day: prevMonthDay++, month: month - 1, year: month === 0 ? year - 1 : year, other: true });
      } else if (day > daysInMonth) {
        week.push({ day: nextMonthDay++, month: month + 1, year: month === 11 ? year + 1 : year, other: true });
        if (nextMonthDay > 7) break;
      } else {
        week.push({ day: day++, month, year, other: false });
      }
    }
    weeks.push(week);
    if (day > daysInMonth && weeks.length >= 4) break;
  }
  return weeks;
}

function getPostsForDate(year, month, day) {
  return blogState.posts.filter(p => {
    const d = new Date(p.scheduledDate);
    return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
  }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
}

function getMonthNames() {
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
}

function getDayNames() {
  return ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
}

/* ══════════════════════════════════════════════
   MAIN RENDER
   ══════════════════════════════════════════════ */

function renderBloggerScheduler() {
  const container = document.getElementById('cpc-tab-content') || document.getElementById('cpc-container');
  if (!container) return;

  const totalPosts = blogState.posts.length;
  const scheduledPosts = blogState.posts.filter(p => p.status === 'scheduled').length;
  const publishedPosts = blogState.posts.filter(p => p.status === 'published').length;
  const draftPosts = blogState.posts.filter(p => p.status === 'draft').length;
  const todayPosts = blogState.posts.filter(p => isToday(p.scheduledDate) && p.status !== 'published').length;
  const overduePosts = blogState.posts.filter(p => p.status === 'scheduled' && isOverdue(p.scheduledDate)).length;
  const month = blogState.viewDate.getMonth();
  const year = blogState.viewDate.getFullYear();

  container.innerHTML = `
    <!-- ═══ HEADER ═══ -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:14px;">
      <div>
        <h2 style="font-size:20px;font-weight:600;margin-bottom:2px;">📅 Blogger Scheduler</h2>
        <p style="font-size:12px;color:var(--muted);">
          Planificador de publicaciones · Calendario · Notificaciones · ${totalPosts} posts
          ${todayPosts > 0 ? `<span style="color:var(--info-bright);">· 📌 ${todayPosts} para hoy</span>` : ''}
          ${overduePosts > 0 ? `<span style="color:var(--danger);">· ⚠️ ${overduePosts} vencidos</span>` : ''}
        </p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        <button class="btn btn-sm ${blogState.notificationsEnabled ? 'btn-primary' : 'btn-ghost'}" onclick="toggleBlogNotifications()" style="font-size:10px;" id="blog-notif-btn">
          ${blogState.notificationsEnabled ? '🔔 Notif. ON' : '🔕 Notif. OFF'}
        </button>
        <button class="btn btn-sm btn-ghost" onclick="exportBlogSchedule()" style="font-size:10px;">📥 Export</button>
        <button class="btn btn-sm btn-primary" onclick="openBlogPostForm()" style="font-size:10px;">➕ Nuevo Post</button>
      </div>
    </div>

    <!-- ═══ STATS BAR ═══ -->
    <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:14px;">
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">Total</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--text2);">${totalPosts}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📝 Borradores</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--muted2);">${draftPosts}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📅 Programados</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--info-bright);">${scheduledPosts}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">✅ Publicados</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:var(--success-bright);">${publishedPosts}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;${todayPosts > 0 ? 'border-color:rgba(77,171,247,0.3);' : ''}">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📌 Hoy</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:${todayPosts > 0 ? 'var(--info-bright)' : 'var(--muted2)'};">${todayPosts}</div>
      </div>
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:8px;padding:10px;text-align:center;${overduePosts > 0 ? 'border-color:rgba(224,92,92,0.3);' : ''}">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">⚠️ Vencidos</div>
        <div style="font-size:20px;font-weight:600;font-family:var(--mono);color:${overduePosts > 0 ? 'var(--danger)' : 'var(--muted2)'};">${overduePosts}</div>
      </div>
    </div>

    <!-- ═══ VIEW TABS ═══ -->
    <div style="display:flex;gap:4px;margin-bottom:14px;background:var(--bg3);border-radius:10px;padding:3px;display:inline-flex;">
      <button class="btn btn-xs ${blogState.viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}" onclick="blogState.viewMode='calendar';renderBloggerScheduler();" style="font-size:10px;">📅 Calendario</button>
      <button class="btn btn-xs ${blogState.viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}" onclick="blogState.viewMode='list';renderBloggerScheduler();" style="font-size:10px;">📋 Lista</button>
      <button class="btn btn-xs ${blogState.viewMode === 'today' ? 'btn-primary' : 'btn-ghost'}" onclick="blogState.viewMode='today';renderBloggerScheduler();" style="font-size:10px;">📌 Hoy</button>
      <button class="btn btn-xs ${blogState.viewMode === 'stats' ? 'btn-primary' : 'btn-ghost'}" onclick="blogState.viewMode='stats';renderBloggerScheduler();" style="font-size:10px;">📊 Stats</button>
    </div>

    <!-- ═══ FILTERS ═══ -->
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;align-items:center;">
      <select onchange="blogState.filterStatus=this.value;renderBloggerScheduler();" style="background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:6px 10px;color:var(--text);font-size:10px;font-family:var(--font);outline:none;cursor:pointer;">
        <option value="all">📋 Todos los estados</option>
        ${POST_STATUSES.map(s => `<option value="${s.id}" ${blogState.filterStatus === s.id ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('')}
      </select>
      <select onchange="blogState.filterNiche=this.value;renderBloggerScheduler();" style="background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:6px 10px;color:var(--text);font-size:10px;font-family:var(--font);outline:none;cursor:pointer;">
        <option value="all">🎯 Todos los nichos</option>
        ${getBlogNiches().map(n => `<option value="${n.id}" ${blogState.filterNiche === n.id ? 'selected' : ''}>${n.name}</option>`).join('')}
      </select>
      <span style="font-size:10px;color:var(--muted2);margin-left:4px;">
        ${blogState.posts.filter(p => filterBlogPost(p)).length} posts
      </span>
    </div>

    <!-- ═══ CONTENT ═══ -->
    <div id="blog-content-area">
      ${blogState.viewMode === 'calendar' ? renderBlogCalendar() : ''}
      ${blogState.viewMode === 'list' ? renderBlogListView() : ''}
      ${blogState.viewMode === 'today' ? renderBlogTodayView() : ''}
      ${blogState.viewMode === 'stats' ? renderBlogStats() : ''}
    </div>
  `;

  // Start notification checker
  startBlogNotificationChecker();
}

function filterBlogPost(post) {
  if (blogState.filterStatus !== 'all' && post.status !== blogState.filterStatus) return false;
  if (blogState.filterNiche !== 'all' && (post.niche || '').toLowerCase().replace(/[^a-z]/g,'') !== blogState.filterNiche) return false;
  return true;
}

/* ══════════════════════════════════════════════
   CALENDAR VIEW
   ══════════════════════════════════════════════ */

function renderBlogCalendar() {
  const year = blogState.viewDate.getFullYear();
  const month = blogState.viewDate.getMonth();
  const months = getMonthNames();
  const days = getDayNames();
  const weeks = getMonthDays(year, month);
  const today = new Date();

  let html = `
    <!-- Month Navigation -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <button class="btn btn-xs btn-ghost" onclick="navigateBlogMonth(-1)" style="font-size:12px;">◀</button>
      <div style="font-size:16px;font-weight:600;color:var(--text);">${months[month]} ${year}</div>
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:9px;color:var(--muted2);">🖱️ Arrastra posts para reprogramar</span>
        <button class="btn btn-xs btn-ghost" onclick="navigateBlogMonth(1)" style="font-size:12px;">▶</button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;">
      <!-- Day headers -->
      <div style="display:grid;grid-template-columns:repeat(7,1fr);background:var(--bg3);border-bottom:0.5px solid var(--border);">
        ${days.map(d => `<div style="padding:8px 4px;text-align:center;font-size:10px;color:var(--muted2);text-transform:uppercase;font-weight:500;">${d}</div>`).join('')}
      </div>

      <!-- Weeks -->
      ${weeks.map(week => `
        <div style="display:grid;grid-template-columns:repeat(7,1fr);border-bottom:0.5px solid rgba(255,255,255,0.03);min-height:90px;">
          ${week.map(cell => {
            const posts = getPostsForDate(cell.year, cell.month, cell.day);
            const isToday = cell.day === today.getDate() && cell.month === today.getMonth() && cell.year === today.getFullYear();
            const isCurrentMonth = !cell.other;

            return `
              <div 
                ondragover="event.preventDefault();handleBlogDragOver(this, ${cell.year}, ${cell.month}, ${cell.day})"
                ondragleave="handleBlogDragLeave(this)"
                ondrop="handleBlogDrop(this, ${cell.year}, ${cell.month}, ${cell.day})"
                onclick="${isCurrentMonth ? `openBlogPostForm(${cell.year},${cell.month},${cell.day})` : `navigateBlogToMonth(${cell.month},${cell.year})`}"
                style="padding:4px;border-right:0.5px solid rgba(255,255,255,0.03);min-height:90px;cursor:${isCurrentMonth ? 'pointer' : 'pointer'};${isCurrentMonth ? '' : 'opacity:0.3;'}${isToday ? 'background:rgba(77,171,247,0.06);' : ''}transition:all 0.15s;position:relative;"
                id="blog-cell-${cell.year}-${cell.month}-${cell.day}"
                onmouseover="this.style.background='${isToday ? 'rgba(77,171,247,0.1)' : 'var(--bg3)'}'"
                onmouseout="if(!this.dataset.dragover)this.style.background='${isToday ? 'rgba(77,171,247,0.06)' : 'transparent'}'">
                <div style="font-size:11px;font-weight:${isToday ? '700' : '400'};color:${isToday ? 'var(--info-bright)' : 'var(--text2)'};margin-bottom:2px;">${cell.day}</div>
                ${posts.slice(0, 3).map(p => {
                  const status = POST_STATUSES.find(s => s.id === p.status) || POST_STATUSES[0];
                  const time = formatBlogTime(p.scheduledDate);
                  return `
                    <div draggable="true"
                      ondragstart="handleBlogDragStart(event, '${p.id}')"
                      ondragend="handleBlogDragEnd(event)"
                      onclick="event.stopPropagation();showBlogPostDetail('${p.id}')"
                      style="font-size:8px;padding:1px 3px;margin-bottom:1px;border-radius:2px;background:${status.color}22;color:${status.color};cursor:grab;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;user-select:none;"
                      title="${p.title} — Arrastra para reprogramar"
                      id="blog-chip-${p.id}">
                      ${time} ${p.title.substring(0, 18)}${p.title.length > 18 ? '…' : ''}
                    </div>
                  `;
                }).join('')}
                ${posts.length > 3 ? `<div style="font-size:8px;color:var(--muted2);padding:0 2px;">+${posts.length - 3} más</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      `).join('')}
    </div>
  `;

  return html;
}

function navigateBlogMonth(dir) {
  blogState.viewDate.setMonth(blogState.viewDate.getMonth() + dir);
  renderBloggerScheduler();
}

function navigateBlogToMonth(month, year) {
  blogState.viewDate = new Date(year, month, 1);
  renderBloggerScheduler();
}

/* ══════════════════════════════════════════════
   LIST VIEW
   ══════════════════════════════════════════════ */

function renderBlogListView() {
  let filtered = blogState.posts.filter(p => filterBlogPost(p));
  filtered.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  if (filtered.length === 0) {
    return `<div style="text-align:center;padding:40px;color:var(--muted2);font-size:13px;">📋 No hay posts con ese filtro.</div>`;
  }

  return `
    <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);overflow:hidden;">
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:12px;">
          <thead>
            <tr>
              <th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Título</th>
              <th style="padding:8px 10px;text-align:left;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Nicho</th>
              <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Estado</th>
              <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Fecha</th>
              <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);">Hora</th>
              <th style="padding:8px 10px;text-align:center;font-size:9px;color:var(--muted2);text-transform:uppercase;background:var(--bg3);border-bottom:0.5px solid var(--border);width:80px;">Acción</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const status = POST_STATUSES.find(s => s.id === p.status) || POST_STATUSES[0];
              const d = new Date(p.scheduledDate);
              const overdue = p.status === 'scheduled' && isOverdue(p.scheduledDate);
              return `
                <tr style="border-bottom:0.5px solid rgba(255,255,255,0.03);cursor:pointer;" onclick="showBlogPostDetail('${p.id}')">
                  <td style="padding:8px 10px;">
                    <div style="font-size:12px;font-weight:500;color:var(--text2);">${p.title}</div>
                    <div style="font-size:9px;color:var(--muted2);margin-top:1px;">${p.notes ? p.notes.substring(0, 40) + (p.notes.length > 40 ? '…' : '') : '—'}</div>
                  </td>
                  <td style="padding:8px 10px;"><span style="font-size:10px;color:var(--accent);">${p.niche || '—'}</span></td>
                  <td style="padding:8px 10px;text-align:center;">
                    <span style="font-size:9px;padding:2px 8px;border-radius:4px;background:${status.color}22;color:${status.color};">${status.icon} ${status.label}</span>
                    ${overdue ? '<br><span style="font-size:8px;color:var(--danger);">⚠️ Vencido</span>' : ''}
                  </td>
                  <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:11px;color:${overdue ? 'var(--danger)' : 'var(--text2)'};">${d.toLocaleDateString('es-DO')}</td>
                  <td style="padding:8px 10px;text-align:center;font-family:var(--mono);font-size:11px;color:var(--muted);">${formatBlogTime(p.scheduledDate)}</td>
                  <td style="padding:8px 10px;text-align:center;">
                    <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();editBlogPost('${p.id}')" style="font-size:9px;">✏️</button>
                    <button class="btn btn-xs btn-ghost" onclick="event.stopPropagation();deleteBlogPost('${p.id}')" style="font-size:9px;color:var(--danger);">🗑️</button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   TODAY VIEW
   ══════════════════════════════════════════════ */

function renderBlogTodayView() {
  const today = new Date();
  const todayPosts = blogState.posts.filter(p => {
    const d = new Date(p.scheduledDate);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const upcoming = blogState.posts.filter(p => {
    const d = new Date(p.scheduledDate);
    const diff = (d - today) / 86400000;
    return diff > 0 && diff <= 7 && p.status === 'scheduled';
  }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const overdue = blogState.posts.filter(p => p.status === 'scheduled' && isOverdue(p.scheduledDate) && !isToday(p.scheduledDate))
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <!-- Today's Posts -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:12px;font-weight:500;color:var(--info-bright);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          📌 Hoy — ${formatBlogDate(today)}
          <span style="font-size:10px;color:var(--muted2);font-weight:400;">(${todayPosts.length} posts)</span>
        </div>
        ${todayPosts.length === 0 ? '<div style="font-size:12px;color:var(--muted2);text-align:center;padding:20px;">📅 No hay posts programados para hoy</div>' : ''}
        ${todayPosts.map(p => renderBlogPostCard(p)).join('')}
      </div>

      <!-- This Week -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:12px;font-weight:500;color:var(--accent);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          📅 Próximos 7 días
          <span style="font-size:10px;color:var(--muted2);font-weight:400;">(${upcoming.length} posts)</span>
        </div>
        ${upcoming.length === 0 ? '<div style="font-size:12px;color:var(--muted2);text-align:center;padding:20px;">📅 No hay posts programados para los próximos 7 días</div>' : ''}
        ${upcoming.map(p => renderBlogPostCard(p)).join('')}
      </div>
    </div>

    <!-- Overdue -->
    ${overdue.length > 0 ? `
      <div style="margin-top:14px;background:var(--bg2);border:0.5px solid rgba(224,92,92,0.2);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:12px;font-weight:500;color:var(--danger);margin-bottom:10px;display:flex;align-items:center;gap:6px;">
          ⚠️ Posts Vencidos (${overdue.length})
        </div>
        ${overdue.map(p => renderBlogPostCard(p)).join('')}
      </div>
    ` : ''}
  `;
}

function renderBlogPostCard(post) {
  const status = POST_STATUSES.find(s => s.id === post.status) || POST_STATUSES[0];
  const d = new Date(post.scheduledDate);
  return `
    <div onclick="showBlogPostDetail('${post.id}')" style="padding:8px 10px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);margin-bottom:4px;cursor:pointer;transition:all 0.1s;" onmouseover="this.style.borderColor='var(--border2)'" onmouseout="this.style.borderColor=''">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:6px;">
        <div style="flex:1;min-width:0;">
          <div style="font-size:11px;font-weight:500;color:var(--text2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${post.title}</div>
          <div style="font-size:9px;color:var(--muted2);margin-top:1px;">${d.toLocaleDateString('es-DO')} · ${formatBlogTime(post.scheduledDate)} · ${post.niche || '—'}</div>
        </div>
        <span style="font-size:9px;padding:1px 6px;border-radius:3px;background:${status.color}22;color:${status.color};white-space:nowrap;">${status.icon}</span>
      </div>
    </div>
  `;
}

/* ══════════════════════════════════════════════
   STATS VIEW — Analytics y visualizaciones
   ══════════════════════════════════════════════ */

function renderBlogStats() {
  const posts = blogState.posts;
  if (posts.length === 0) {
    return `<div style="text-align:center;padding:60px 20px;color:var(--muted2);font-size:13px;">📊 No hay datos para mostrar. Crea algunos posts primero.</div>`;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  /* ── Helper: count posts in a month ── */
  function countInMonth(y, m) {
    return posts.filter(p => {
      const d = new Date(p.scheduledDate);
      return d.getFullYear() === y && d.getMonth() === m;
    }).length;
  }

  /* ── Status Distribution ── */
  const statusCounts = POST_STATUSES.map(s => ({
    ...s,
    count: posts.filter(p => p.status === s.id).length,
  })).filter(s => s.count > 0);
  const totalWithStatus = statusCounts.reduce((sum, s) => sum + s.count, 0);

  /* ── Posts by Niche ── */
  const nicheMap = {};
  posts.forEach(p => {
    const n = p.niche || 'Sin nicho';
    nicheMap[n] = (nicheMap[n] || 0) + 1;
  });
  const nicheEntries = Object.entries(nicheMap).sort((a, b) => b[1] - a[1]);
  const topNiche = nicheEntries[0];
  const maxNicheCount = nicheEntries[0]?.[1] || 1;

  /* ── Monthly Activity (last 12 months) ── */
  const monthsList = [];
  for (let i = 11; i >= 0; i--) {
    const adjY = month - i < 0 ? year - 1 : month - i >= 12 ? year + 1 : year;
    const adjM = ((month - i) % 12 + 12) % 12;
    monthsList.push({ year: adjY, month: adjM, count: countInMonth(adjY, adjM) });
  }
  const maxMonthCount = Math.max(...monthsList.map(m => m.count), 1);

  /* ── Weekly Activity (last 8 weeks) ── */
  const weekBuckets = [];
  for (let w = 7; w >= 0; w--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - w * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const count = posts.filter(p => {
      const d = new Date(p.scheduledDate);
      return d >= weekStart && d <= weekEnd;
    }).length;
    weekBuckets.push({ start: new Date(weekStart), end: new Date(weekEnd), count });
  }
  const maxWeekCount = Math.max(...weekBuckets.map(w => w.count), 1);

  /* ── Day-of-week distribution ── */
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];
  posts.forEach(p => {
    dayCounts[new Date(p.scheduledDate).getDay()]++;
  });
  const maxDayCount = Math.max(...dayCounts, 1);
  const bestDayIdx = dayCounts.indexOf(Math.max(...dayCounts));

  /* ── Average frequency ── */
  const oldest = posts.reduce((a, b) => new Date(a.scheduledDate) < new Date(b.scheduledDate) ? a : b);
  const newest = posts.reduce((a, b) => new Date(a.scheduledDate) > new Date(b.scheduledDate) ? a : b);
  const daysSpan = Math.max(1, (new Date(newest.scheduledDate) - new Date(oldest.scheduledDate)) / 86400000);
  const avgPerWeek = ((posts.length / daysSpan) * 7).toFixed(1);

  const months = getMonthNames();

  return `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">

      <!-- ═══ CARD: Status Distribution ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">📊 Distribución por Estado</div>
        ${statusCounts.map(s => {
          const pct = ((s.count / totalWithStatus) * 100).toFixed(1);
          return `
            <div style="margin-bottom:8px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;">
                <span style="color:${s.color};">${s.icon} ${s.label}</span>
                <span style="font-family:var(--mono);color:var(--text2);">${s.count} (${pct}%)</span>
              </div>
              <div style="height:6px;background:var(--bg4);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:${s.color};border-radius:3px;transition:width 0.5s;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ═══ CARD: Posts by Niche ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">🎯 Posts por Nicho</div>
        ${nicheEntries.slice(0, 8).map(([name, count]) => {
          const pct = (count / maxNicheCount) * 100;
          return `
            <div style="margin-bottom:6px;">
              <div style="display:flex;justify-content:space-between;font-size:10px;margin-bottom:1px;">
                <span style="color:var(--text2);">${name}</span>
                <span style="font-family:var(--mono);color:var(--accent);">${count}</span>
              </div>
              <div style="height:5px;background:var(--bg4);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;"></div>
              </div>
            </div>
          `;
        }).join('')}
        ${nicheEntries.length > 8 ? `<div style="font-size:9px;color:var(--muted2);margin-top:4px;">+${nicheEntries.length - 8} nichos más</div>` : ''}
      </div>

      <!-- ═══ CARD: Publicación Timeline (8 weeks) ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">📈 Actividad Semanal (últimas 8 semanas)</div>
        <div style="display:flex;align-items:flex-end;gap:4px;height:80px;padding-bottom:16px;position:relative;">
          ${weekBuckets.map(w => {
            const pct = (w.count / maxWeekCount) * 100;
            const barH = Math.max(4, (pct / 100) * 60);
            const isThisWeek = w.start <= now && w.end >= now;
            return `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
                <div style="font-size:8px;color:var(--muted2);font-family:var(--mono);">${w.count}</div>
                <div style="width:100%;height:${barH}px;background:${isThisWeek ? 'var(--accent)' : 'var(--info-bright)'};border-radius:2px 2px 0 0;opacity:${0.3 + (w.count / maxWeekCount) * 0.7};transition:height 0.3s;"></div>
                <div style="font-size:7px;color:var(--muted2);">${w.start.getDate()}/${w.start.getMonth() + 1}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ═══ CARD: Day of Week Distribution ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">📅 Posts por Día de la Semana</div>
        <div style="display:flex;align-items:flex-end;gap:4px;height:70px;padding-bottom:16px;">
          ${dayCounts.map((count, i) => {
            const pct = (count / maxDayCount) * 100;
            const barH = Math.max(4, (pct / 100) * 50);
            const isBest = i === bestDayIdx;
            return `
              <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;">
                <div style="font-size:8px;color:var(--muted2);font-family:var(--mono);">${count}</div>
                <div style="width:100%;height:${barH}px;background:${isBest ? 'var(--success-bright)' : 'var(--accent)'};border-radius:2px 2px 0 0;opacity:${0.3 + (count / maxDayCount) * 0.7};transition:height 0.3s;"></div>
                <div style="font-size:7px;color:${isBest ? 'var(--success-bright)' : 'var(--muted2)'};">${dayNames[i]}${isBest ? '✨' : ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ═══ CARD: Monthly Activity Heatmap (12 months) ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;grid-column:1/-1;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">🗓️ Actividad Mensual (últimos 12 meses)</div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${monthsList.map(m => {
            const intensity = maxMonthCount > 0 ? (m.count / maxMonthCount) : 0;
            const bgOpacity = 0.1 + intensity * 0.6;
            const isCurrent = m.month === month && m.year === year;
            return `
              <div style="flex:1;min-width:60px;padding:10px 8px;text-align:center;border-radius:var(--radius);background:rgba(201,169,110,${bgOpacity});border:0.5px solid ${isCurrent ? 'var(--accent)' : 'var(--border)'};${isCurrent ? 'box-shadow:0 0 8px rgba(201,169,110,0.2);' : ''}">
                <div style="font-size:9px;color:${isCurrent ? 'var(--accent)' : 'var(--muted2)'};text-transform:uppercase;">${months[m.month].substring(0, 3)}</div>
                <div style="font-size:16px;font-weight:700;font-family:var(--mono);color:${intensity > 0.5 ? 'var(--accent)' : 'var(--text2)'};">${m.count}</div>
                <div style="font-size:8px;color:var(--muted2);">posts</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ═══ CARD: Summary / Key Metrics ═══ -->
      <div style="background:var(--bg2);border:0.5px solid var(--border);border-radius:var(--radius2);padding:14px;grid-column:1/-1;">
        <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:10px;">📋 Resumen de Actividad</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📝 Total Posts</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--accent);">${posts.length}</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📅 Promedio Semanal</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--info-bright);">${avgPerWeek}</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">🎯 Top Nicho</div>
            <div style="font-size:14px;font-weight:600;color:var(--accent);">${topNiche?.[0] || '—'}</div>
            <div style="font-size:9px;color:var(--muted2);">${topNiche?.[1] || 0} posts</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">🏆 Mejor Día</div>
            <div style="font-size:14px;font-weight:600;color:var(--success-bright);">${dayNames[bestDayIdx]}</div>
            <div style="font-size:9px;color:var(--muted2);">${dayCounts[bestDayIdx]} posts</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">🌍 Nichos Distintos</div>
            <div style="font-size:20px;font-weight:700;font-family:var(--mono);color:var(--purple-bright);">${nicheEntries.length}</div>
          </div>
          <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
            <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📆 Período</div>
            <div style="font-size:11px;font-weight:500;color:var(--text2);">${daysSpan} días</div>
            <div style="font-size:8px;color:var(--muted2);">${new Date(oldest.scheduledDate).toLocaleDateString('es-DO')} → ${new Date(newest.scheduledDate).toLocaleDateString('es-DO')}</div>
          </div>
        </div>
      </div>

    </div>
  `;
}

/* ══════════════════════════════════════════════
   POST FORM (MODAL)
   ══════════════════════════════════════════════ */

function openBlogPostForm(year, month, day) {
  const now = new Date();
  const defaultDate = year !== undefined ? new Date(year, month, day) : now;
  const dateStr = defaultDate.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(':').slice(0, 2).join(':');

  const niches = typeof CPC_NICHES !== 'undefined'
    ? [...new Set(CPC_NICHES.map(n => n.cat))].sort()
    : [];

  const bodyHTML = `
    <div style="font-size:13px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📝 Título del Post</label>
          <input type="text" id="blog-form-title" placeholder="Título del artículo..."
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">🎯 Nicho</label>
          <select id="blog-form-niche" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="">Seleccionar nicho...</option>
            ${niches.map(n => `<option value="${n}">${n}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📅 Fecha</label>
          <input type="date" id="blog-form-date" value="${dateStr}"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">⏰ Hora</label>
          <input type="time" id="blog-form-time" value="${timeStr}"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📋 Estado</label>
          <select id="blog-form-status" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            ${POST_STATUSES.map(s => `<option value="${s.id}">${s.icon} ${s.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="margin-bottom:10px;">
        <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📝 Notas</label>
        <textarea id="blog-form-notes" placeholder="Notas, ideas, keywords para este post..." rows="3"
          style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;resize:vertical;"></textarea>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;padding:8px 10px;background:var(--bg3);border:0.5px solid rgba(201,169,110,0.15);border-radius:var(--radius);">
        <input type="checkbox" id="blog-form-auto-seo" checked style="accent-color:var(--accent);width:16px;height:16px;cursor:pointer;">
        <div style="flex:1;">
          <label for="blog-form-auto-seo" style="font-size:11px;color:var(--accent);cursor:pointer;font-weight:500;">✍️ Generar contenido SEO automáticamente</label>
          <div style="font-size:9px;color:var(--muted2);">Al guardar, irá al SEO Content Generator y creará un artículo optimizado para este nicho</div>
        </div>
      </div>
    </div>
  `;

  const footerHTML = `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveBlogPost()">💾 Guardar Post</button>
  `;

  blogState.editingPostId = null;
  openModal('📅 Nueva Publicación', bodyHTML, footerHTML);
}

function saveBlogPost() {
  const title = document.getElementById('blog-form-title')?.value?.trim();
  const niche = document.getElementById('blog-form-niche')?.value;
  const date = document.getElementById('blog-form-date')?.value;
  const time = document.getElementById('blog-form-time')?.value;
  const status = document.getElementById('blog-form-status')?.value || 'draft';
  const notes = document.getElementById('blog-form-notes')?.value?.trim() || '';

  if (!title) { showBlogToast('⚠️ Escribe un título para el post'); return; }
  if (!date) { showBlogToast('⚠️ Selecciona una fecha'); return; }

  const scheduledDate = new Date(`${date}T${time || '12:00'}`);

  if (blogState.editingPostId) {
    const idx = blogState.posts.findIndex(p => p.id === blogState.editingPostId);
    if (idx >= 0) {
      blogState.posts[idx] = { ...blogState.posts[idx], title, niche, scheduledDate: scheduledDate.toISOString(), status, notes };
    }
  } else {
    blogState.posts.push({
      id: getBlogPostId().toString(),
      title,
      niche,
      scheduledDate: scheduledDate.toISOString(),
      status,
      notes,
      createdAt: new Date().toISOString(),
    });
  }

  saveBlogState();
  closeModal();

  // ── Auto-generate SEO content ──
  const autoSeo = document.getElementById('blog-form-auto-seo')?.checked;
  if (!blogState.editingPostId && autoSeo && niche && typeof seoGenState !== 'undefined' && typeof switchCPCTab === 'function') {
    // Find matching CPC_NICHE by category
    const matchedNiche = (typeof CPC_NICHES !== 'undefined')
      ? CPC_NICHES.find(n => n.cat === niche)
      : null;
    if (matchedNiche) {
      showBlogToast(`✅ "${title}" creado · Generando contenido SEO para ${niche}...`);
      seoGenState.activeNiche = matchedNiche.id;
      switchCPCTab('seo');
      // Let DOM render on next tick, then generate
      setTimeout(() => generateSEOContent(), 0);
      return; // Don't render blogger again — we switched to SEO tab
    }
  }

  renderBloggerScheduler();
  showBlogToast(`✅ "${title}" ${blogState.editingPostId ? 'actualizado' : 'creado'}`);
}

function editBlogPost(id) {
  const post = blogState.posts.find(p => p.id === id);
  if (!post) return;

  blogState.editingPostId = id;
  const d = new Date(post.scheduledDate);
  const dateStr = d.toISOString().split('T')[0];
  const timeStr = d.toTimeString().split(':').slice(0, 2).join(':');

  const niches = typeof CPC_NICHES !== 'undefined'
    ? [...new Set(CPC_NICHES.map(n => n.cat))].sort()
    : [];

  const bodyHTML = `
    <div style="font-size:13px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📝 Título</label>
          <input type="text" id="blog-form-title" value="${post.title.replace(/"/g, '&quot;')}"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">🎯 Nicho</label>
          <select id="blog-form-niche" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            <option value="">—</option>
            ${niches.map(n => `<option value="${n}" ${post.niche === n ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:10px;">
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📅 Fecha</label>
          <input type="date" id="blog-form-date" value="${dateStr}"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">⏰ Hora</label>
          <input type="time" id="blog-form-time" value="${timeStr}"
            style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;" />
        </div>
        <div>
          <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📋 Estado</label>
          <select id="blog-form-status" style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;cursor:pointer;">
            ${POST_STATUSES.map(s => `<option value="${s.id}" ${post.status === s.id ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div>
        <label style="font-size:9px;color:var(--muted2);text-transform:uppercase;display:block;margin-bottom:4px;">📝 Notas</label>
        <textarea id="blog-form-notes" rows="3"
          style="width:100%;background:var(--bg3);border:0.5px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-size:12px;font-family:var(--font);outline:none;resize:vertical;">${post.notes || ''}</textarea>
      </div>
    </div>
  `;

  openModal('✏️ Editar Publicación', bodyHTML, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-sm btn-primary" onclick="saveBlogPost()">💾 Guardar Cambios</button>
  `);
}

function deleteBlogPost(id) {
  if (!confirm('¿Eliminar esta publicación?')) return;
  blogState.posts = blogState.posts.filter(p => p.id !== id);
  saveBlogState();
  renderBloggerScheduler();
  showBlogToast('🗑️ Post eliminado');
}

function showBlogPostDetail(id) {
  const post = blogState.posts.find(p => p.id === id);
  if (!post) return;

  const status = POST_STATUSES.find(s => s.id === post.status) || POST_STATUSES[0];
  const d = new Date(post.scheduledDate);
  const overdue = post.status === 'scheduled' && isOverdue(post.scheduledDate);

  // Find SEO content from history if available
  let seoLink = '';
  if (typeof seoGenState !== 'undefined' && seoGenState.generatedHistory) {
    const match = seoGenState.generatedHistory.find(h => h.nicheName === post.niche || h.title === post.title);
    if (match) {
      seoLink = `<button class="btn btn-xs btn-ghost" onclick="closeModal();if(typeof renderSEOGenerator!=='undefined'){seoGenState.activeNiche=match.nicheId;switchCPCTab('seo');}" style="font-size:9px;">✍️ Ver en SEO Generator</button>`;
    }
  }

  const nicheIcon = (typeof CPC_NICHES !== 'undefined')
    ? (CPC_NICHES.find(n => n.cat === post.niche)?.icon || '📁')
    : '📁';

  openModal(`📅 ${post.title}`, `
    <div style="font-size:13px;line-height:1.7;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:0.5px solid var(--border);">
        <div style="width:40px;height:40px;border-radius:10px;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:20px;">${status.icon}</div>
        <div style="flex:1;">
          <div style="font-size:15px;font-weight:600;">${post.title}</div>
          <div style="font-size:10px;color:var(--muted2);">${post.niche || 'Sin nicho'} · Creado: ${new Date(post.createdAt || post.scheduledDate).toLocaleDateString('es-DO')}</div>
        </div>
        <span style="font-size:10px;padding:3px 10px;border-radius:4px;background:${overdue ? 'rgba(224,92,92,0.15)' : status.color + '22'};color:${overdue ? 'var(--danger)' : status.color};">${overdue ? '⚠️ Vencido' : status.icon + ' ' + status.label}</span>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📅 Fecha</div>
          <div style="font-size:14px;font-weight:600;color:var(--text2);">${d.toLocaleDateString('es-DO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;text-align:center;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">⏰ Hora</div>
          <div style="font-size:14px;font-weight:600;color:var(--text2);">${formatBlogTime(post.scheduledDate)}</div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">🎯 Nicho</div>
          <div style="font-size:13px;font-weight:500;color:var(--accent);">${nicheIcon} ${post.niche || '—'}</div>
        </div>
        <div style="background:var(--bg3);border-radius:var(--radius);padding:10px;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;">📋 Estado</div>
          <div style="font-size:13px;font-weight:500;color:${status.color};">${status.icon} ${status.label}</div>
        </div>
      </div>

      ${post.notes ? `
        <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 12px;margin-bottom:12px;">
          <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:4px;">📝 Notas</div>
          <div style="font-size:12px;color:var(--text2);line-height:1.5;">${post.notes}</div>
        </div>
      ` : ''}

      <!-- Quick Stats -->
      <div style="background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px;">
        <div style="font-size:9px;color:var(--muted2);text-transform:uppercase;margin-bottom:6px;">📊 Resumen del Blog</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;color:var(--text2);">
          <div>📝 Total posts: ${blogState.posts.length}</div>
          <div>📅 Pendientes: ${blogState.posts.filter(p => p.status === 'scheduled').length}</div>
          <div>✅ Publicados: ${blogState.posts.filter(p => p.status === 'published').length}</div>
          <div>⚠️ Vencidos: ${blogState.posts.filter(p => p.status === 'scheduled' && isOverdue(p.scheduledDate)).length}</div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-sm btn-ghost" onclick="closeModal()">Cerrar</button>
    ${seoLink}
    <button class="btn btn-sm btn-ghost" onclick="closeModal();editBlogPost('${post.id}')" style="font-size:11px;">✏️ Editar</button>
    <button class="btn btn-sm btn-danger" onclick="closeModal();deleteBlogPost('${post.id}')" style="font-size:11px;">🗑️ Eliminar</button>
  `);
}

/* ══════════════════════════════════════════════
   NOTIFICATIONS
   ══════════════════════════════════════════════ */

function toggleBlogNotifications() {
  if (!('Notification' in window)) {
    showBlogToast('⚠️ Las notificaciones no están soportadas en este navegador');
    return;
  }

  if (blogState.notificationsEnabled) {
    blogState.notificationsEnabled = false;
    if (blogState.checkInterval) {
      clearInterval(blogState.checkInterval);
      blogState.checkInterval = null;
    }
    showBlogToast('🔕 Notificaciones desactivadas');
  } else {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        blogState.notificationsEnabled = true;
        startBlogNotificationChecker();
        showBlogToast('🔔 Notificaciones activadas');
        renderBloggerScheduler();
      } else {
        showBlogToast('⚠️ Permiso de notificaciones denegado');
      }
    });
  }
}

function startBlogNotificationChecker() {
  if (blogState.checkInterval) return;

  // Check every 5 minutes
  blogState.checkInterval = setInterval(() => {
    if (!blogState.notificationsEnabled) return;

    const now = new Date();
    const todayPosts = blogState.posts.filter(p => {
      const d = new Date(p.scheduledDate);
      return d.getFullYear() === now.getFullYear() &&
             d.getMonth() === now.getMonth() &&
             d.getDate() === now.getDate() &&
             p.status === 'scheduled' &&
             Math.abs(d.getTime() - now.getTime()) < 3600000; // within 1 hour
    });

    todayPosts.forEach(p => {
      notifyBlogPost(p.title, `📅 Publicación programada para hoy a las ${formatBlogTime(p.scheduledDate)}`);
    });

    const overdue = blogState.posts.filter(p => p.status === 'scheduled' && isOverdue(p.scheduledDate));
    if (overdue.length > 0) {
      notifyBlogPost('⚠️ Posts Vencidos', `${overdue.length} publicación(es) están vencidas. Revisa tu calendario.`);
    }
  }, 300000); // 5 min
}

function notifyBlogPost(title, body) {
  if (!blogState.notificationsEnabled || !('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    new Notification(`📅 Blogger Scheduler — ${title}`, {
      body,
      icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" rx="20" fill="%23c9a96e"/%3E%3Ctext x="50" y="68" font-size="50" text-anchor="middle" fill="%230d0d0f"%3ENA%3C/text%3E%3C/svg%3E',
    });
  } catch(e) {}
}

/* ══════════════════════════════════════════════
   DRAG & DROP — Reprogramar posts arrastrando
   ══════════════════════════════════════════════ */

function handleBlogDragStart(ev, postId) {
  const post = blogState.posts.find(p => p.id === postId);
  if (!post) return;

  blogDragData.postId = postId;
  blogDragData.sourceDate = post.scheduledDate;
  blogDragData.draggedEl = ev.target;

  ev.dataTransfer.setData('text/plain', postId);
  ev.dataTransfer.effectAllowed = 'move';

  // Visual feedback: add dragging class
  ev.target.style.opacity = '0.4';
  ev.target.style.outline = '1px dashed var(--accent)';

  showBlogToast(`📌 Arrastrando: "${post.title.substring(0, 30)}${post.title.length > 30 ? '…' : ''}" a nueva fecha`);
}

function handleBlogDragOver(cellEl, year, month, day) {
  if (!blogDragData.postId) return;

  const d = new Date(year, month, day);
  const today = new Date();
  const isPast = d < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (isPast) {
    cellEl.style.outline = '1px solid var(--danger)';
    cellEl.dataset.dragover = 'invalid';
    return;
  }

  cellEl.style.outline = '2px solid var(--accent)';
  cellEl.style.background = 'rgba(201, 169, 110, 0.08)';
  cellEl.dataset.dragover = 'valid';
}

function handleBlogDragLeave(cellEl) {
  cellEl.style.outline = '';
  cellEl.dataset.dragover = '';
  if (!cellEl.dataset.originalBg) {
    // Reset will happen on mouseout handler
  }
}

function handleBlogDrop(cellEl, year, month, day) {
  cellEl.style.outline = '';
  cellEl.dataset.dragover = '';

  if (!blogDragData.postId) return;

  const targetDate = new Date(year, month, day);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Prevent dropping on past dates
  if (targetDate < todayStart) {
    showBlogToast('⚠️ No puedes reprogramar a una fecha pasada');
    blogDragData.postId = null;
    blogDragData.draggedEl = null;
    return;
  }

  const post = blogState.posts.find(p => p.id === blogDragData.postId);
  if (!post) {
    blogDragData.postId = null;
    blogDragData.draggedEl = null;
    return;
  }

  // Preserve the original time, only change the date
  const oldDate = new Date(post.scheduledDate);
  const newScheduledDate = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
    oldDate.getHours(),
    oldDate.getMinutes()
  );

  // Check if the date actually changed
  const sameDay = oldDate.getFullYear() === newScheduledDate.getFullYear() &&
                  oldDate.getMonth() === newScheduledDate.getMonth() &&
                  oldDate.getDate() === newScheduledDate.getDate();

  if (sameDay) {
    showBlogToast('📍 Misma fecha — sin cambios');
    blogDragData.postId = null;
    blogDragData.draggedEl = null;
    return;
  }

  const oldDateStr = oldDate.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short' });
  const newDateStr = newScheduledDate.toLocaleDateString('es-DO', { weekday: 'short', day: 'numeric', month: 'short' });

  post.scheduledDate = newScheduledDate.toISOString();
  saveBlogState();
  renderBloggerScheduler();

  showBlogToast(`✅ "${post.title.substring(0, 25)}${post.title.length > 25 ? '…' : ''}" reprogramado: ${oldDateStr} → ${newDateStr}`);

  blogDragData.postId = null;
  blogDragData.draggedEl = null;
}

function handleBlogDragEnd(ev) {
  // Restore visual state on dragged element
  if (ev.target) {
    ev.target.style.opacity = '';
    ev.target.style.outline = '';
  }

  // Clear ALL cell overrides (outline, background, dataset)
  document.querySelectorAll('[id^="blog-cell-"]').forEach(el => {
    el.style.outline = '';
    el.style.background = '';
    el.dataset.dragover = '';
  });

  blogDragData.postId = null;
  blogDragData.draggedEl = null;
}

/* ══════════════════════════════════════════════
   EXPORT
   ══════════════════════════════════════════════ */

function exportBlogSchedule() {
  if (blogState.posts.length === 0) { showBlogToast('⚠️ No hay posts para exportar'); return; }

  const BOM = '\uFEFF';
  const headers = ['Título', 'Nicho', 'Estado', 'Fecha', 'Hora', 'Notas', 'Creado'];
  const rows = blogState.posts.map(p => {
    const d = new Date(p.scheduledDate);
    return [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.niche || ''}"`,
      p.status,
      d.toLocaleDateString('es-DO'),
      formatBlogTime(p.scheduledDate),
      `"${(p.notes || '').replace(/"/g, '""')}"`,
      new Date(p.createdAt || p.scheduledDate).toLocaleDateString('es-DO'),
    ].join(',');
  });

  const csv = BOM + headers.join(',') + '\n' + rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `blog-schedule-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  showBlogToast(`📥 ${blogState.posts.length} posts exportados`);
}

/* ══════════════════════════════════════════════
   TOAST
   ══════════════════════════════════════════════ */

let blogToastTimer = null;

function showBlogToast(msg) {
  let toast = document.getElementById('blog-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'blog-toast';
    toast.style.cssText = 'position:fixed;bottom:20px;right:20px;background:var(--bg3);border:0.5px solid var(--border);border-radius:var(--radius);padding:10px 16px;font-size:12px;color:var(--text);z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,0.4);transition:opacity 0.3s;max-width:320px;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(blogToastTimer);
  blogToastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

console.log('📅 Blogger Scheduler v1.0 loaded');
