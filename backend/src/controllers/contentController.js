const { sendJson } = require('../utils/http');
const { readData } = require('../services/adminDataStore');

function getSiteContent() {
  const data = readData();
  return {
    company: data.company,
    services: (data.services || []).filter((item) => item.active !== false),
    projects: (data.projects || []).filter((item) => item.active !== false),
    team: (data.team || []).filter((item) => item.active !== false),
  };
}

function listSiteContent(_request, response) {
  sendJson(response, 200, { ok: true, content: getSiteContent() });
}

function listServices(_request, response) {
  sendJson(response, 200, { ok: true, services: getSiteContent().services });
}

function getService(_request, response, slug) {
  const service = getSiteContent().services.find((item) => item.slug === slug || item.id === slug);
  if (!service) {
    sendJson(response, 404, { ok: false, error: 'Service not found' });
    return;
  }
  sendJson(response, 200, { ok: true, service });
}

function listProjects(_request, response) {
  sendJson(response, 200, { ok: true, projects: getSiteContent().projects });
}

function getProject(_request, response, slug) {
  const project = getSiteContent().projects.find((item) => item.slug === slug || item.id === slug);
  if (!project) {
    sendJson(response, 404, { ok: false, error: 'Project not found' });
    return;
  }
  sendJson(response, 200, { ok: true, project });
}

function getCompany(_request, response) {
  sendJson(response, 200, { ok: true, company: getSiteContent().company });
}

module.exports = { listSiteContent, listServices, getService, listProjects, getProject, getCompany };
