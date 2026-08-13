const fs = require('fs');
const path = require('path');
const { storageDir } = require('../config/paths');

const filePath = path.join(storageDir, 'admin-content.json');

const defaultData = {
  services: [
    {
      id: 'web-development',
      slug: 'web-development',
      name: 'Web Development',
      category: 'Digital Solutions',
      shortDescription: 'Custom websites, APIs, UI/UX, chatbot-enabled experiences and cloud-ready web platforms.',
      description: 'TRISET builds responsive, maintainable web experiences shaped around clear information, practical workflows and reliable delivery.',
      image: 'assets/web_development.webp',
      capabilities: ['Custom Development', 'API Development', 'UI/UX Design', 'ChatBot', 'Cloud Integration'],
      subservices: ['Custom Development', 'API Development', 'UI/UX Design', 'ChatBot', 'Cloud Integration'],
      relatedServices: ['App Development', 'E-Commerce', 'Digital Marketing'],
      cta: 'Discuss a web project',
      active: true,
    },
    {
      id: 'app-development',
      slug: 'app-development',
      name: 'App Development',
      category: 'Digital Solutions',
      shortDescription: 'Scalable mobile applications with strong design, integrations and support.',
      description: 'Application work is planned around performance, usable interfaces and long-term support.',
      image: 'assets/app-development.webp',
      capabilities: ['Mobile App Development', 'UI/UX Design', 'App Integration', 'White Label Apps', 'Cross-Platform Development', 'App Maintenance and Support'],
      subservices: ['Mobile App Development', 'UI/UX Design', 'App Integration', 'White Label Apps', 'Cross-Platform Development', 'App Maintenance and Support'],
      relatedServices: ['Web Development', 'E-Commerce', 'Digital Marketing'],
      cta: 'Plan an app',
      active: true,
    },
    {
      id: 'e-commerce',
      slug: 'e-commerce',
      name: 'E-Commerce',
      category: 'Digital Solutions',
      shortDescription: 'Online store setup, theme development and conversion-focused storefront workflows.',
      description: 'TRISET supports e-commerce teams with practical storefront structure, platform-aware development and conversion-focused presentation.',
      image: 'assets/e-commerce.webp',
      capabilities: ['Store Setup and Upgrade', 'Theme Development', 'UI/UX Design', 'PWA and AMP', 'Marketplace Setup'],
      subservices: ['Store Setup and Upgrade', 'Theme Development', 'UI/UX Design', 'PWA and AMP', 'Marketplace Setup'],
      relatedServices: ['Web Development', 'Digital Marketing', 'App Development'],
      cta: 'Improve a store',
      active: true,
    }
  ],
  projects: [
    {
      id: 'saraswathi-academy',
      slug: 'saraswathi-academy',
      title: 'Saraswathi Academy',
      type: 'Verified digital project',
      description: 'A web presence for a music institute, retained as the clearest project asset found in the source material.',
      image: 'assets/saraswathiac_web.webp',
      active: true,
    },
    {
      id: 'aerial-mapping-workflow',
      slug: 'aerial-mapping-workflow',
      title: 'Aerial Mapping Workflow',
      type: 'Geospatial capability',
      description: 'A representative workflow combining drone capture, photogrammetry and structured mapping outputs.',
      image: 'assets/drone.webp',
      active: true,
    }
  ],
  team: [
    {
      id: 'team-ramu',
      name: 'Ramu Tiruveedula',
      role: 'Photogrammetry',
      experience: 'Over 15 years of experience',
      active: true,
    },
    {
      id: 'team-bhanu',
      name: 'Bhanu Chennamsetty',
      role: 'Data Entry',
      experience: 'Over 6 years of experience',
      active: true,
    }
  ],
  company: {
    name: 'TRISET Solutions',
    legalName: 'TRISET SOLUTIONS INDIA PVT LTD',
    email: 'info@trisetsolutions.com',
    phone: '+91 738 281 9292',
    location: 'Hyderabad, India',
    tagline: 'Precise. Powerful. Professional.',
    story: 'TRISET Solutions India Private Limited is a Hyderabad-based company delivering geospatial and digital solutions.',
  },
};

function ensureStorage() {
  fs.mkdirSync(storageDir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

function normalizeSlug(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

function normalizeService(item, fallbackIndex = 0) {
  const name = String(item.name || item.title || `Service ${fallbackIndex + 1}`).trim();
  const slug = item.slug || item.id || normalizeSlug(name);
  return {
    ...item,
    id: item.id || slug,
    slug,
    name,
    category: item.category || 'Digital Solutions',
    shortDescription: item.shortDescription || item.description || 'Professional service delivery.',
    description: item.description || item.shortDescription || 'Professional service delivery.',
    image: item.image || '',
    capabilities: Array.isArray(item.capabilities) && item.capabilities.length ? item.capabilities : (Array.isArray(item.subservices) ? item.subservices : [name]),
    subservices: Array.isArray(item.subservices) && item.subservices.length ? item.subservices : (Array.isArray(item.capabilities) ? item.capabilities : [name]),
    relatedServices: Array.isArray(item.relatedServices) ? item.relatedServices : [],
    cta: item.cta || 'Discuss a project',
    active: item.active !== false,
  };
}

function normalizeProject(item, fallbackIndex = 0) {
  const title = String(item.title || `Project ${fallbackIndex + 1}`).trim();
  const slug = item.slug || item.id || normalizeSlug(title);
  return {
    ...item,
    id: item.id || slug,
    slug,
    title,
    type: item.type || 'Project',
    description: item.description || 'Project showcase.',
    image: item.image || '',
    active: item.active !== false,
  };
}

function normalizeTeam(item, fallbackIndex = 0) {
  const name = String(item.name || `Team Member ${fallbackIndex + 1}`).trim();
  const slug = item.slug || item.id || normalizeSlug(name);
  return {
    ...item,
    id: item.id || slug,
    slug,
    name,
    role: item.role || 'Team Member',
    experience: item.experience || 'Professional',
    active: item.active !== false,
  };
}

function readData() {
  ensureStorage();
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    const services = Array.isArray(parsed.services) ? parsed.services.map((item, index) => normalizeService(item, index)) : [...defaultData.services];
    const projects = Array.isArray(parsed.projects) ? parsed.projects.map((item, index) => normalizeProject(item, index)) : [...defaultData.projects];
    const team = Array.isArray(parsed.team) ? parsed.team.map((item, index) => normalizeTeam(item, index)) : [...defaultData.team];
    return {
      services,
      projects,
      team,
      company: { ...defaultData.company, ...(parsed.company || {}) },
    };
  } catch (error) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function writeData(data) {
  ensureStorage();
  const serialized = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, serialized, 'utf8');
  return data;
}

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

module.exports = {
  defaultData,
  readData,
  writeData,
  createId,
};
