window.siteData = {
  company: {
    name: 'TRISET Solutions',
    legalName: 'TRISET SOLUTIONS INDIA PVT LTD',
    tagline: 'Precise. Powerful. Professional.',
    email: 'info@trisetsolutions.com',
    phone: '+91 738 281 9292',
    hours: 'Mon-Sat 6:30-22:30, Sunday CLOSED',
    location: 'Hyderabad, India',
    story: 'TRISET Solutions India Private Limited is a Hyderabad-based company delivering geospatial and digital solutions. The journey began in 2018 as Aero Geospatial Services, later expanding into TRISET Solutions to serve clients with broader technical capability.'
  },
  services: [
    {
      id: 'web-development',
      category: 'Digital Solutions',
      name: 'Web Development',
      image: 'assets/web_development.webp',
      shortDescription: 'Custom websites, APIs, UI/UX, chatbot-enabled experiences and cloud-ready web platforms.',
      description: 'TRISET builds responsive, maintainable web experiences shaped around clear information, practical workflows and reliable delivery.',
      capabilities: ['Custom Development', 'API Development', 'UI/UX Design', 'ChatBot', 'Cloud Integration'],
      subservices: ['Custom Development', 'API Development', 'UI/UX Design', 'ChatBot', 'Cloud Integration'],
      relatedServices: ['App Development', 'E-Commerce', 'Digital Marketing'],
      cta: 'Discuss a web project'
    },
    {
      id: 'app-development',
      category: 'Digital Solutions',
      name: 'App Development',
      image: 'assets/app-development.webp',
      shortDescription: 'Scalable mobile applications with strong design, integrations, cross-platform delivery and support.',
      description: 'Application work is planned around performance, usable interfaces, integration needs and long-term support.',
      capabilities: ['Mobile App Development', 'UI/UX Design', 'App Integration', 'White Label Apps', 'Cross-Platform Development', 'App Maintenance and Support'],
      subservices: ['Mobile App Development', 'UI/UX Design', 'App Integration', 'White Label Apps', 'Cross-Platform Development', 'App Maintenance and Support'],
      relatedServices: ['Web Development', 'E-Commerce', 'Digital Marketing'],
      cta: 'Plan an app'
    },
    {
      id: 'e-commerce',
      category: 'Digital Solutions',
      name: 'E-Commerce',
      image: 'assets/e-commerce.webp',
      shortDescription: 'Online store setup, theme development, migrations, marketplaces, PWA/AMP and support.',
      description: 'TRISET supports e-commerce teams with practical storefront structure, platform-aware development and conversion-focused presentation.',
      capabilities: ['Store Setup and Upgrade', 'Theme Development', 'UI/UX Design', 'Mobile Apps', 'PWA and AMP', 'Migration', 'Marketplaces', 'ChatBot', 'Support and Maintenance'],
      subservices: ['Store Setup and Upgrade', 'Theme Development', 'UI/UX Design', 'Mobile Apps', 'PWA and AMP', 'Migration', 'Marketplaces', 'ChatBot', 'Support and Maintenance'],
      relatedServices: ['Web Development', 'Digital Marketing', 'App Development'],
      cta: 'Improve a store'
    },
    {
      id: 'digital-marketing',
      category: 'Digital Solutions',
      name: 'Digital Marketing',
      image: 'assets/digital_market.webp',
      shortDescription: 'SEO, local SEO, paid ads, social media, app marketing, email, content and e-commerce marketing.',
      description: 'Marketing support focuses on discoverability, clear messaging and coordinated digital channels that connect back to business goals.',
      capabilities: ['SEO and Local SEO', 'Paid Ads', 'Social Media', 'App Marketing', 'Email Marketing', 'Content Marketing', 'E-Commerce SEO'],
      subservices: ['SEO and Local SEO', 'Paid Ads', 'Social Media Marketing', 'App Marketing', 'Email Marketing', 'Content Marketing', 'E-Commerce Marketing'],
      relatedServices: ['Web Development', 'E-Commerce', 'Data Entry'],
      cta: 'Shape a campaign'
    },
    {
      id: 'data-entry',
      category: 'Digital Solutions',
      name: 'Data Entry',
      image: 'assets/dataentry.webp',
      shortDescription: 'Data entry, processing, conversion, cleansing and structured digital records support.',
      description: 'TRISET helps teams turn scattered information into cleaner, structured records that are easier to use and maintain.',
      capabilities: ['Data Entry Services', 'Data Processing', 'Data Conversion'],
      subservices: ['Data Entry Services', 'Data Processing', 'Data Conversion'],
      relatedServices: ['Digital Marketing', 'Web Development'],
      cta: 'Organize data'
    },
    {
      id: 'photogrammetry',
      category: 'Geo-Spatial Solutions',
      name: 'Photogrammetry',
      image: 'assets/2d_3d.webp',
      shortDescription: 'High-accuracy mapping, visualization, geospatial extraction and photogrammetry support.',
      description: 'Photogrammetry work supports mapping, measurement, visualization and inspection-ready spatial outputs.',
      capabilities: ['Image Analysis', '3D Modeling', 'Mapping Solutions', '2D/3D Cartography', 'DEM', 'Orthophoto and Mosaicing', 'LiDAR', 'GIS Services / Remote Sensing', 'BIM', 'Drone Services'],
      subservices: ['Image Analysis', '3D Modeling', 'Mapping Solutions', '2D/3D Cartography', 'DEM', 'Orthophoto and Mosaicing', 'LiDAR', 'GIS Services / Remote Sensing', 'BIM', 'Drone Services'],
      relatedServices: ['Drone Services', 'Orthophoto and Mosaicing', 'DEM'],
      cta: 'Scope mapping work'
    },
    {
      id: 'gis',
      category: 'Geo-Spatial Solutions',
      name: 'GIS Services / Remote Sensing',
      image: 'assets/gis.jpg',
      shortDescription: 'GIS mapping, remote sensing workflows, spatial analysis and data-driven geospatial outputs.',
      description: 'GIS and remote sensing support helps teams interpret places, assets and patterns through structured spatial data.',
      capabilities: ['GIS Mapping', 'Remote Sensing', 'Spatial Data', 'Mapping Outputs'],
      subservices: ['GIS Mapping', 'Remote Sensing', 'Spatial Data', 'Mapping Outputs'],
      relatedServices: ['Photogrammetry', 'LiDAR', '2D/3D Cartography'],
      cta: 'Map the workflow'
    },
    {
      id: 'lidar',
      category: 'Geo-Spatial Solutions',
      name: 'LiDAR',
      image: 'assets/lidar.webp',
      shortDescription: 'LiDAR data services for terrain, asset and high-density spatial mapping workflows.',
      description: 'LiDAR workflows support dense point-cloud data, terrain detail and technical spatial interpretation.',
      capabilities: ['Point Cloud Support', 'Terrain Data', 'Asset Mapping', 'Spatial Mapping'],
      subservices: ['Point Cloud Support', 'Terrain Data', 'Asset Mapping', 'Spatial Mapping'],
      relatedServices: ['DEM', 'BIM', 'GIS Services / Remote Sensing'],
      cta: 'Review point-cloud needs'
    },
    {
      id: 'bim',
      category: 'Geo-Spatial Solutions',
      name: 'BIM',
      image: 'assets/bim.webp',
      shortDescription: 'Building Information Modeling support for structured, coordinated 3D project information.',
      description: 'BIM support organizes project information into coordinated model-based outputs for technical teams.',
      capabilities: ['Building Information Modeling', 'Model Coordination', 'Digital Building Information', 'Visualization'],
      subservices: ['Building Information Modeling', 'Model Coordination', 'Digital Building Information', 'Visualization'],
      relatedServices: ['LiDAR', '2D/3D Cartography', '3D Services'],
      cta: 'Coordinate a model'
    },
    {
      id: 'drone',
      category: 'Geo-Spatial Solutions',
      name: 'Drone Services',
      image: 'assets/drone.webp',
      shortDescription: 'Drone-based data acquisition support for mapping, monitoring and geospatial projects.',
      description: 'Drone capture provides timely aerial context for mapping, documentation, monitoring and project review.',
      capabilities: ['Drone Data Acquisition', 'Aerial Mapping', 'Survey Support', 'Monitoring'],
      subservices: ['Drone Data Acquisition', 'Aerial Mapping', 'Survey Support', 'Monitoring'],
      relatedServices: ['Photogrammetry', 'Orthophoto and Mosaicing', 'GIS Services / Remote Sensing'],
      cta: 'Plan aerial capture'
    },
    {
      id: 'dem',
      category: 'Geo-Spatial Solutions',
      name: 'DEM',
      image: 'assets/DEM.jpg',
      shortDescription: 'Digital Elevation Model services for terrain analysis and geospatial visualization.',
      description: 'DEM outputs help represent terrain and elevation for analysis, planning and visualization.',
      capabilities: ['Elevation Modeling', 'Terrain Analysis', 'Mapping Data'],
      subservices: ['Elevation Modeling', 'Terrain Analysis', 'Mapping Data'],
      relatedServices: ['Photogrammetry', 'LiDAR', 'Orthophoto and Mosaicing'],
      cta: 'Discuss terrain data'
    },
    {
      id: 'orthophoto',
      category: 'Geo-Spatial Solutions',
      name: 'Orthophoto and Mosaicing',
      image: 'assets/Orthophoto_&_Mosaicing.jpeg',
      shortDescription: 'Orthophoto processing and mosaicing for accurate, inspection-ready mapped imagery.',
      description: 'Orthophoto and mosaicing work turns captured imagery into aligned, useful visual mapping outputs.',
      capabilities: ['Orthophoto Processing', 'Mosaicing', 'Image Alignment'],
      subservices: ['Orthophoto Processing', 'Mosaicing', 'Image Alignment'],
      relatedServices: ['Photogrammetry', 'Drone Services', 'DEM'],
      cta: 'Process imagery'
    },
    {
      id: 'cartography',
      category: 'Geo-Spatial Solutions',
      name: '2D/3D Cartography',
      image: 'assets/2d_3d.webp',
      shortDescription: '2D and 3D cartography services for precise visual mapping and spatial interpretation.',
      description: 'Cartographic outputs make spatial information easier to inspect, communicate and act on.',
      capabilities: ['2D Mapping', '3D Visualization', 'Cartographic Outputs'],
      subservices: ['2D Mapping', '3D Visualization', 'Cartographic Outputs'],
      relatedServices: ['GIS Services / Remote Sensing', 'BIM', '3D Services'],
      cta: 'Create map outputs'
    },
    {
      id: '3d-services',
      category: 'Geo-Spatial Solutions',
      name: '3D Services',
      image: 'assets/2d_3d.webp',
      shortDescription: '3D visualization and model-based outputs supporting technical and geospatial communication.',
      description: '3D services help teams present spatial information, model outputs and project context in a clearer visual format.',
      capabilities: ['3D Visualization', 'Model Outputs', 'Project Presentation'],
      subservices: ['3D Visualization', 'Model Outputs', 'Project Presentation'],
      relatedServices: ['2D/3D Cartography', 'BIM', 'Photogrammetry'],
      cta: 'Discuss 3D outputs'
    }
  ],
  process: [
    ['01', 'Project Onboarding', 'Align goals, constraints, data sources and outcomes before the work starts.'],
    ['02', 'Requirement Analysis', 'Turn business and technical needs into a practical delivery blueprint.'],
    ['03', 'Proposal and Quotation', 'Clarify scope, milestones, timeline and cost before execution.'],
    ['04', 'Agreement and Kickoff', 'Set up communication, tools and responsibilities for a clear start.'],
    ['05', 'Execution and Updates', 'Deliver steadily with progress updates and practical review points.'],
    ['06', 'Timely Delivery', 'Hand over complete outputs with the documentation needed to keep moving.']
  ],
  projects: [
    {
      title: 'Saraswathi Academy',
      type: 'Verified digital project',
      image: 'assets/saraswathiac_web.webp',
      description: 'A web presence for a music institute, retained as the clearest project asset found in the source material.'
    },
    {
      title: 'Aerial Mapping Workflow',
      type: 'Geospatial capability',
      image: 'assets/drone.webp',
      description: 'A representative workflow combining drone capture, photogrammetry and structured mapping outputs.'
    },
    {
      title: 'Spatial Data Coordination',
      type: 'GIS and LiDAR capability',
      image: 'assets/lidar.webp',
      description: 'A technical data workflow for organizing mapping information into usable spatial outputs.'
    }
  ],
  team: [
    ['Ramu Tiruveedula', 'Photogrammetry', 'Over 15 years of experience'],
    ['Bhanu Chennamsetty', 'Data Entry', 'Over 6 years of experience'],
    ['Karthik Kakumanu', 'Web Developer', 'Over 5 years of experience'],
    ['Poonam Purohit', 'App Developer', 'Over 3 years of experience'],
    ['Sowjanya Yenuganti', 'Digital Marketing', 'Over 3 years of experience'],
    ['Karthik Kakumanu', 'E-Commerce', 'Over 3 years of experience']
  ]
};

(async function hydrateSiteDataFromBackend() {
  try {
    const response = await fetch('/api/site-content', { cache: 'no-store' });
    if (!response.ok) return;
    const payload = await response.json();
    if (!payload || !payload.ok || !payload.content) return;
    const { company, services, projects, team } = payload.content;
    if (company) window.siteData.company = company;
    if (Array.isArray(services)) window.siteData.services = services;
    if (Array.isArray(projects)) window.siteData.projects = projects;
    if (Array.isArray(team)) window.siteData.team = team;
  } catch (error) {
    // Use the bundled content if the server is unavailable.
  }
})();
