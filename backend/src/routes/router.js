const fs = require('fs');
const path = require('path');
const { rootDir } = require('../config/paths');
const { setSecurityHeaders } = require('../middleware/security');
const { sendJson } = require('../utils/http');
const { createContact, listContactSubmissions, getAdminOverview } = require('../controllers/contactController');
const { listSiteContent, listServices, getService, listProjects, getProject, getCompany } = require('../controllers/contentController');
const {
  listJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  adminLogin,
} = require('../controllers/jobController');
const {
  listBusinessServices,
  createBusinessService,
  updateBusinessService,
  deleteBusinessService,
  listBusinessProjects,
  createBusinessProject,
  updateBusinessProject,
  deleteBusinessProject,
  listBusinessTeam,
  createBusinessTeamMember,
  updateBusinessTeamMember,
  deleteBusinessTeamMember,
  getCompanyProfile,
  updateCompanyProfile,
  updateInquiryStatus,
} = require('../controllers/adminBusinessController');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const routeFiles = new Map([
  ['/', 'index.html'],
  ['/about', 'about.html'],
  ['/services', 'services.html'],
  ['/solutions', 'solutions.html'],
  ['/work', 'projects.html'],
  ['/projects', 'projects.html'],
  ['/careers', 'careers.html'],
  ['/admin', 'admin.html'],
  ['/contact', 'contact.html'],
  ['/privacy', 'privacy.html'],
  ['/terms', 'terms.html'],
  ['/404', '404.html'],
]);

const legacyRedirects = new Map([
  ['/web_development_service.php', '/services#web-development'],
  ['/app-development_service.php', '/services#app-development'],
  ['/e-commerce_service.php', '/services#e-commerce'],
  ['/digital-marketing_service.php', '/services#digital-marketing'],
  ['/data-entry_service.php', '/services#data-entry'],
  ['/photogrammetry_service.php', '/services#photogrammetry'],
  ['/gis_service.php', '/services#gis'],
  ['/lidar.php', '/services#lidar'],
  ['/bim_service.php', '/services#bim'],
  ['/drone.php', '/services#drone'],
  ['/dem_service.php', '/services#dem'],
  ['/orthophoto.php', '/services#orthophoto'],
  ['/2d_3d.php', '/services#cartography'],
  ['/3d.php', '/services#3d-services'],
]);

async function handleRequest(request, response) {
  setSecurityHeaders(response);
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (request.method === 'OPTIONS' && pathname.startsWith('/api/')) {
    response.writeHead(204, { Allow: 'GET,POST,OPTIONS' });
    response.end();
    return;
  }

  if (pathname === '/api/health' && request.method === 'GET') {
    sendJson(response, 200, { ok: true, service: 'triset-website', time: new Date().toISOString() });
    return;
  }

  if (pathname === '/api/contact' && request.method === 'POST') {
    await createContact(request, response);
    return;
  }

  if (pathname === '/api/site-content' && request.method === 'GET') {
    await listSiteContent(request, response);
    return;
  }

  if (pathname === '/api/company' && request.method === 'GET') {
    await getCompany(request, response);
    return;
  }

  if (pathname === '/api/admin/inquiries' && request.method === 'GET') {
    await listContactSubmissions(request, response);
    return;
  }

  if (pathname === '/api/admin/overview' && request.method === 'GET') {
    await getAdminOverview(request, response);
    return;
  }

  if (pathname === '/api/admin/login' && request.method === 'POST') {
    await adminLogin(request, response);
    return;
  }

  if (pathname === '/api/admin/services' && request.method === 'GET') {
    await listBusinessServices(request, response);
    return;
  }

  if (pathname === '/api/admin/services' && request.method === 'POST') {
    await createBusinessService(request, response);
    return;
  }

  if (pathname.startsWith('/api/admin/services/') && request.method === 'PUT') {
    await updateBusinessService(request, response, pathname.replace('/api/admin/services/', ''));
    return;
  }

  if (pathname.startsWith('/api/admin/services/') && request.method === 'DELETE') {
    await deleteBusinessService(request, response, pathname.replace('/api/admin/services/', ''));
    return;
  }

  if (pathname === '/api/admin/projects' && request.method === 'GET') {
    await listBusinessProjects(request, response);
    return;
  }

  if (pathname === '/api/admin/projects' && request.method === 'POST') {
    await createBusinessProject(request, response);
    return;
  }

  if (pathname.startsWith('/api/admin/projects/') && request.method === 'PUT') {
    await updateBusinessProject(request, response, pathname.replace('/api/admin/projects/', ''));
    return;
  }

  if (pathname.startsWith('/api/admin/projects/') && request.method === 'DELETE') {
    await deleteBusinessProject(request, response, pathname.replace('/api/admin/projects/', ''));
    return;
  }

  if (pathname === '/api/admin/team' && request.method === 'GET') {
    await listBusinessTeam(request, response);
    return;
  }

  if (pathname === '/api/admin/team' && request.method === 'POST') {
    await createBusinessTeamMember(request, response);
    return;
  }

  if (pathname.startsWith('/api/admin/team/') && request.method === 'PUT') {
    await updateBusinessTeamMember(request, response, pathname.replace('/api/admin/team/', ''));
    return;
  }

  if (pathname.startsWith('/api/admin/team/') && request.method === 'DELETE') {
    await deleteBusinessTeamMember(request, response, pathname.replace('/api/admin/team/', ''));
    return;
  }

  if (pathname === '/api/admin/company' && request.method === 'GET') {
    await getCompanyProfile(request, response);
    return;
  }

  if (pathname === '/api/admin/company' && request.method === 'PUT') {
    await updateCompanyProfile(request, response);
    return;
  }

  if (pathname.startsWith('/api/admin/inquiries/') && request.method === 'PATCH') {
    await updateInquiryStatus(request, response, pathname.replace('/api/admin/inquiries/', ''));
    return;
  }

  if (pathname === '/api/jobs' && request.method === 'GET') {
    await listJobs(request, response);
    return;
  }

  if (pathname === '/api/jobs' && request.method === 'POST') {
    await createJob(request, response);
    return;
  }

  if (pathname.startsWith('/api/jobs/') && request.method === 'GET') {
    await getJob(request, response, pathname.replace('/api/jobs/', ''));
    return;
  }

  if (pathname.startsWith('/api/jobs/') && request.method === 'PUT') {
    await updateJob(request, response, pathname.replace('/api/jobs/', ''));
    return;
  }

  if (pathname.startsWith('/api/jobs/') && request.method === 'DELETE') {
    await deleteJob(request, response, pathname.replace('/api/jobs/', ''));
    return;
  }

  if (pathname === '/api/services' && request.method === 'GET') {
    listServices(request, response);
    return;
  }

  if (pathname.startsWith('/api/services/') && request.method === 'GET') {
    getService(request, response, pathname.replace('/api/services/', ''));
    return;
  }

  if (pathname === '/api/projects' && request.method === 'GET') {
    listProjects(request, response);
    return;
  }

  if (pathname.startsWith('/api/projects/') && request.method === 'GET') {
    getProject(request, response, pathname.replace('/api/projects/', ''));
    return;
  }

  if (pathname.startsWith('/api/')) {
    sendJson(response, 404, { ok: false, error: 'API route not found' });
    return;
  }

  if (legacyRedirects.has(pathname)) {
    response.writeHead(301, { Location: legacyRedirects.get(pathname) });
    response.end();
    return;
  }

  const file = routeFiles.get(pathname) || (pathname.endsWith('.html') ? pathname.slice(1) : pathname.slice(1));
  const safePath = path.normalize(path.join(rootDir, file));
  if (!safePath.startsWith(rootDir)) {
    serve404(response);
    return;
  }

  if (fs.existsSync(safePath) && fs.statSync(safePath).isFile()) {
    serveFile(response, safePath, 200);
    return;
  }

  serve404(response);
}

function serveFile(response, filePath, statusCode) {
  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(statusCode, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(response);
}

function serve404(response) {
  const filePath = path.join(rootDir, '404.html');
  if (fs.existsSync(filePath)) {
    serveFile(response, filePath, 404);
    return;
  }
  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found');
}

module.exports = { handleRequest };
