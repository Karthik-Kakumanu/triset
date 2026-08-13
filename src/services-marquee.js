(function () {
  'use strict';

  var root = document.querySelector('[data-services-marquee]');
  if (!root) return;

  var categories = [
    {
      label: '01 // Digital & Software',
      title: 'Digital & Software',
      direction: 'left',
      variant: 'dark',
      topDuration: 40,
      bottomDuration: 60,
      rows: [
        ['Custom Software', 'Web Development', 'UI / UX', 'Mobile Apps', 'Cloud', 'Cybersecurity', 'Custom Software', 'Web Development', 'UI / UX', 'Mobile Apps', 'Cloud', 'Cybersecurity'],
        ['Workflow Systems', 'SaaS', 'CRM', 'ERP', 'Automation', 'Integrations', 'Workflow Systems', 'SaaS', 'CRM', 'ERP', 'Automation', 'Integrations']
      ]
    },
    {
      label: '02 // Geospatial',
      title: 'Geospatial',
      direction: 'right',
      variant: 'soft',
      topDuration: 40,
      bottomDuration: 64,
      rows: [
        ['GIS Mapping', 'Remote Sensing', 'LiDAR', 'Drone Surveying', 'Photogrammetry', 'WebGIS', 'GIS Mapping', 'Remote Sensing', 'LiDAR', 'Drone Surveying', 'Photogrammetry', 'WebGIS'],
        ['Spatial Analysis', 'Terrain Models', 'Orthophotos', '3D Mapping', 'Location Intelligence', 'Satellite Data', 'Spatial Analysis', 'Terrain Models', 'Orthophotos', '3D Mapping', 'Location Intelligence', 'Satellite Data']
      ]
    },
    {
      label: '03 // Digital Marketing',
      title: 'Digital Marketing',
      direction: 'left',
      variant: 'warm',
      topDuration: 40,
      bottomDuration: 68,
      rows: [
        ['SEO', 'PPC', 'Social Media', 'Content', 'Email', 'Analytics', 'SEO', 'PPC', 'Social Media', 'Content', 'Email', 'Analytics'],
        ['Growth Strategy', 'Demand Generation', 'Brand Reach', 'Lead Nurture', 'Conversion', 'Campaign Systems', 'Growth Strategy', 'Demand Generation', 'Brand Reach', 'Lead Nurture', 'Conversion', 'Campaign Systems']
      ]
    },
    {
      label: '04 // Data Processing',
      title: 'Data Processing',
      direction: 'right',
      variant: 'lilac',
      topDuration: 40,
      bottomDuration: 70,
      rows: [
        ['Data Entry', 'Data Cleaning', 'Validation', 'Migration', 'Reporting', 'Dashboards', 'Data Entry', 'Data Cleaning', 'Validation', 'Migration', 'Reporting', 'Dashboards'],
        ['Spreadsheet Ops', 'Database Handling', 'ETL', 'Document Digitization', 'Data Quality', 'Operations', 'Spreadsheet Ops', 'Database Handling', 'ETL', 'Document Digitization', 'Data Quality', 'Operations']
      ]
    }
  ];

  function createRow(items, reverse, duration) {
    var track = document.createElement('div');
    track.className = 'marquee-track' + (reverse ? ' marquee-row--reverse' : '');
    track.style.setProperty('--duration', duration.toFixed(2) + 's');

    var firstSet = document.createElement('div');
    firstSet.className = 'marquee-set';
    firstSet.style.display = 'flex';

    var secondSet = document.createElement('div');
    secondSet.className = 'marquee-set';
    secondSet.style.display = 'flex';

    items.forEach(function (item, index) {
      var span = document.createElement('span');
      span.className = 'marquee-item' + ((index % 2 === 0) ? ' is-muted' : '') + ((index % 3 === 0) ? ' is-outline' : '');
      span.textContent = item;
      firstSet.appendChild(span);
      secondSet.appendChild(span.cloneNode(true));
    });

    track.appendChild(firstSet);
    track.appendChild(secondSet);
    return track;
  }

  function buildCategory(category) {
    var section = document.createElement('section');
    section.className = 'kinetic-category ' + category.variant;
    section.id = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    var header = document.createElement('div');
    header.className = 'kinetic-category-header';

    var label = document.createElement('span');
    label.textContent = category.label;

    var title = document.createElement('h2');
    title.textContent = category.title;

    header.appendChild(label);
    header.appendChild(title);
    section.appendChild(header);

    category.rows.forEach(function (rowItems, rowIndex) {
      var row = document.createElement('div');
      row.className = 'marquee-row' + (category.direction === 'right' ? ' marquee-row--reverse' : '');
      // Top row (index 0) is the fast one, and its speed varies category to
      // category. Bottom row (index 1) is always the slow, steady one.
      var duration = rowIndex === 0
        ? category.topDuration
        : category.bottomDuration;
      var track = createRow(rowItems, category.direction === 'right', duration);
      row.appendChild(track);
      section.appendChild(row);
    });

    return section;
  }

  categories.forEach(function (category) {
    root.appendChild(buildCategory(category));
  });
})();