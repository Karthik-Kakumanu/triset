const { readJson, sendJson } = require('../utils/http');
const { readData, writeData, createId } = require('../services/adminDataStore');

function getAuthToken(request) {
  const authHeader = request.headers.authorization || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  return authHeader.slice(7).trim();
}

function isAdminAuthorized(request) {
  return getAuthToken(request) === 'triset-admin-token';
}

function withAdminGuard(request, response, handler) {
  if (!isAdminAuthorized(request)) {
    sendJson(response, 401, { ok: false, error: 'Unauthorized' });
    return false;
  }

  handler();
  return true;
}

async function listBusinessServices(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  sendJson(response, 200, { ok: true, services: data.services || [] });
}

async function createBusinessService(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const service = {
      id: payload.id || createId('service'),
      name: String(payload.name || '').trim(),
      category: String(payload.category || '').trim(),
      shortDescription: String(payload.shortDescription || payload.short_description || '').trim(),
      description: String(payload.description || '').trim(),
      image: String(payload.image || '').trim(),
      active: payload.active !== false,
    };

    if (!service.name || !service.category) {
      sendJson(response, 400, { ok: false, error: 'Service name and category are required.' });
      return;
    }

    data.services.push(service);
    writeData(data);
    sendJson(response, 201, { ok: true, service });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to create service.' });
  }
}

async function updateBusinessService(request, response, serviceId) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const index = data.services.findIndex((item) => String(item.id) === String(serviceId));
    if (index === -1) {
      sendJson(response, 404, { ok: false, error: 'Service not found.' });
      return;
    }

    data.services[index] = {
      ...data.services[index],
      name: payload.name !== undefined ? String(payload.name || '').trim() : data.services[index].name,
      category: payload.category !== undefined ? String(payload.category || '').trim() : data.services[index].category,
      shortDescription: payload.shortDescription !== undefined ? String(payload.shortDescription || '').trim() : data.services[index].shortDescription,
      description: payload.description !== undefined ? String(payload.description || '').trim() : data.services[index].description,
      image: payload.image !== undefined ? String(payload.image || '').trim() : data.services[index].image,
      active: payload.active !== undefined ? Boolean(payload.active) : data.services[index].active,
    };

    writeData(data);
    sendJson(response, 200, { ok: true, service: data.services[index] });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to update service.' });
  }
}

async function deleteBusinessService(request, response, serviceId) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  const before = data.services.length;
  data.services = data.services.filter((item) => String(item.id) !== String(serviceId));
  if (data.services.length === before) {
    sendJson(response, 404, { ok: false, error: 'Service not found.' });
    return;
  }
  writeData(data);
  sendJson(response, 200, { ok: true, deleted: true });
}

async function listBusinessProjects(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  sendJson(response, 200, { ok: true, projects: data.projects || [] });
}

async function createBusinessProject(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const project = {
      id: payload.id || createId('project'),
      title: String(payload.title || '').trim(),
      type: String(payload.type || '').trim(),
      description: String(payload.description || '').trim(),
      image: String(payload.image || '').trim(),
      active: payload.active !== false,
    };

    if (!project.title) {
      sendJson(response, 400, { ok: false, error: 'Project title is required.' });
      return;
    }

    data.projects.push(project);
    writeData(data);
    sendJson(response, 201, { ok: true, project });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to create project.' });
  }
}

async function updateBusinessProject(request, response, projectId) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const index = data.projects.findIndex((item) => String(item.id) === String(projectId));
    if (index === -1) {
      sendJson(response, 404, { ok: false, error: 'Project not found.' });
      return;
    }

    data.projects[index] = {
      ...data.projects[index],
      title: payload.title !== undefined ? String(payload.title || '').trim() : data.projects[index].title,
      type: payload.type !== undefined ? String(payload.type || '').trim() : data.projects[index].type,
      description: payload.description !== undefined ? String(payload.description || '').trim() : data.projects[index].description,
      image: payload.image !== undefined ? String(payload.image || '').trim() : data.projects[index].image,
      active: payload.active !== undefined ? Boolean(payload.active) : data.projects[index].active,
    };

    writeData(data);
    sendJson(response, 200, { ok: true, project: data.projects[index] });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to update project.' });
  }
}

async function deleteBusinessProject(request, response, projectId) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  const before = data.projects.length;
  data.projects = data.projects.filter((item) => String(item.id) !== String(projectId));
  if (data.projects.length === before) {
    sendJson(response, 404, { ok: false, error: 'Project not found.' });
    return;
  }
  writeData(data);
  sendJson(response, 200, { ok: true, deleted: true });
}

async function listBusinessTeam(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  sendJson(response, 200, { ok: true, team: data.team || [] });
}

async function createBusinessTeamMember(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const member = {
      id: payload.id || createId('member'),
      name: String(payload.name || '').trim(),
      role: String(payload.role || '').trim(),
      experience: String(payload.experience || '').trim(),
      active: payload.active !== false,
    };

    if (!member.name || !member.role) {
      sendJson(response, 400, { ok: false, error: 'Team member name and role are required.' });
      return;
    }

    data.team.push(member);
    writeData(data);
    sendJson(response, 201, { ok: true, member });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to create team member.' });
  }
}

async function updateBusinessTeamMember(request, response, memberId) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    const index = data.team.findIndex((item) => String(item.id) === String(memberId));
    if (index === -1) {
      sendJson(response, 404, { ok: false, error: 'Team member not found.' });
      return;
    }

    data.team[index] = {
      ...data.team[index],
      name: payload.name !== undefined ? String(payload.name || '').trim() : data.team[index].name,
      role: payload.role !== undefined ? String(payload.role || '').trim() : data.team[index].role,
      experience: payload.experience !== undefined ? String(payload.experience || '').trim() : data.team[index].experience,
      active: payload.active !== undefined ? Boolean(payload.active) : data.team[index].active,
    };

    writeData(data);
    sendJson(response, 200, { ok: true, member: data.team[index] });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to update team member.' });
  }
}

async function deleteBusinessTeamMember(request, response, memberId) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  const before = data.team.length;
  data.team = data.team.filter((item) => String(item.id) !== String(memberId));
  if (data.team.length === before) {
    sendJson(response, 404, { ok: false, error: 'Team member not found.' });
    return;
  }
  writeData(data);
  sendJson(response, 200, { ok: true, deleted: true });
}

async function getCompanyProfile(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  const data = readData();
  sendJson(response, 200, { ok: true, company: data.company });
}

async function updateCompanyProfile(request, response) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const data = readData();
    data.company = {
      ...data.company,
      name: payload.name !== undefined ? String(payload.name || '').trim() : data.company.name,
      legalName: payload.legalName !== undefined ? String(payload.legalName || '').trim() : data.company.legalName,
      email: payload.email !== undefined ? String(payload.email || '').trim() : data.company.email,
      phone: payload.phone !== undefined ? String(payload.phone || '').trim() : data.company.phone,
      location: payload.location !== undefined ? String(payload.location || '').trim() : data.company.location,
      tagline: payload.tagline !== undefined ? String(payload.tagline || '').trim() : data.company.tagline,
      story: payload.story !== undefined ? String(payload.story || '').trim() : data.company.story,
    };
    writeData(data);
    sendJson(response, 200, { ok: true, company: data.company });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to update company profile.' });
  }
}

async function updateInquiryStatus(request, response, inquiryId) {
  if (!withAdminGuard(request, response, () => {})) return;
  try {
    const payload = await readJson(request, 128 * 1024);
    const submissions = require('../services/contactStore').readContactSubmissions();
    const index = submissions.findIndex((item) => String(item.id) === String(inquiryId));
    if (index === -1) {
      sendJson(response, 404, { ok: false, error: 'Inquiry not found.' });
      return;
    }

    submissions[index] = {
      ...submissions[index],
      status: payload.status || submissions[index].status || 'New',
      updatedAt: new Date().toISOString(),
    };

    const fs = require('fs');
    const path = require('path');
    const { storageDir } = require('../config/paths');
    const file = path.join(storageDir, 'contact-submissions.jsonl');

    fs.writeFileSync(file, submissions.map((item) => JSON.stringify(item)).join('\n') + '\n', 'utf8');
    sendJson(response, 200, { ok: true, inquiry: submissions[index] });
  } catch (error) {
    sendJson(response, error.statusCode || 500, { ok: false, error: error.message || 'Unable to update inquiry status.' });
  }
}

module.exports = {
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
};
