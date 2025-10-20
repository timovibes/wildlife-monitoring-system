const db = require('../models');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Sync database
    await db.sequelize.sync({ force: true });
    console.log('✅ Database synchronized');

    // Create users
    const users = await db.User.bulkCreate([
      {
        name: 'Admin User',
        email: 'admin@wildlife.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'Admin'
      },
      {
        name: 'Park Ranger',
        email: 'ranger@wildlife.com',
        password: await bcrypt.hash('ranger123', 10),
        role: 'Ranger'
      },
      {
        name: 'Research Scientist',
        email: 'researcher@wildlife.com',
        password: await bcrypt.hash('researcher123', 10),
        role: 'Researcher'
      }
    ]);
    console.log('✅ Users created');

    // Create species
    const species = await db.Species.bulkCreate([
      {
        commonName: 'African Elephant',
        scientificName: 'Loxodonta africana',
        category: 'Mammal',
        conservationStatus: 'EN',
        habitat: 'Savanna, Forest',
        population: 415000,
        description: 'Largest land animal, known for intelligence and social behavior'
      },
      {
        commonName: 'Black Rhinoceros',
        scientificName: 'Diceros bicornis',
        category: 'Mammal',
        conservationStatus: 'CR',
        habitat: 'Grassland, Savanna',
        population: 5500,
        description: 'Critically endangered due to poaching for horns'
      },
      {
        commonName: 'Lion',
        scientificName: 'Panthera leo',
        category: 'Mammal',
        conservationStatus: 'VU',
        habitat: 'Grassland, Savanna',
        population: 23000,
        description: 'Apex predator, living in social groups called prides'
      },
      {
        commonName: 'Cheetah',
        scientificName: 'Acinonyx jubatus',
        category: 'Mammal',
        conservationStatus: 'VU',
        habitat: 'Grassland',
        population: 7100,
        description: 'Fastest land animal, capable of speeds up to 70 mph'
      },
      {
        commonName: 'Mountain Gorilla',
        scientificName: 'Gorilla beringei beringei',
        category: 'Mammal',
        conservationStatus: 'EN',
        habitat: 'Mountain Forest',
        population: 1063,
        description: 'Gentle giants living in high-altitude forests'
      },
      {
        commonName: 'Grey Crowned Crane',
        scientificName: 'Balearica regulorum',
        category: 'Bird',
        conservationStatus: 'EN',
        habitat: 'Wetlands, Grassland',
        population: 58000,
        description: 'Elegant bird with distinctive golden crown'
      },
      {
        commonName: 'African Wild Dog',
        scientificName: 'Lycaon pictus',
        category: 'Mammal',
        conservationStatus: 'EN',
        habitat: 'Savanna, Woodland',
        population: 6600,
        description: 'Highly social carnivore with unique coat patterns'
      },
      {
        commonName: 'Pangolin',
        scientificName: 'Manis',
        category: 'Mammal',
        conservationStatus: 'CR',
        habitat: 'Forest, Savanna',
        population: 0,
        description: 'Most trafficked mammal in the world, covered in scales'
      },
      {
        commonName: 'Secretary Bird',
        scientificName: 'Sagittarius serpentarius',
        category: 'Bird',
        conservationStatus: 'EN',
        habitat: 'Grassland',
        population: 67000,
        description: 'Large bird of prey known for stomping on snakes'
      },
      {
        commonName: 'Leopard',
        scientificName: 'Panthera pardus',
        category: 'Mammal',
        conservationStatus: 'VU',
        habitat: 'Forest, Savanna',
        population: 700000,
        description: 'Solitary and adaptable big cat found across Africa and Asia'
      }
    ]);
    console.log('✅ Species created');

    // Create sightings
    const sightings = [];
    for (let i = 0; i < 20; i++) {
      sightings.push({
        speciesId: species[Math.floor(Math.random() * species.length)].id,
        userId: users[Math.floor(Math.random() * users.length)].id,
        latitude: -1.2921 + (Math.random() - 0.5) * 2,
        longitude: 36.8219 + (Math.random() - 0.5) * 2,
        count: Math.floor(Math.random() * 10) + 1,
        behavior: ['Feeding', 'Resting', 'Moving', 'Playing', 'Hunting'][Math.floor(Math.random() * 5)],
        notes: 'Regular monitoring observation',
        sightingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    await db.Sighting.bulkCreate(sightings);
    console.log('✅ Sightings created');

    // Create incidents
    const incidents = [];
    for (let i = 0; i < 10; i++) {
      incidents.push({
        type: ['Poaching', 'Human-Wildlife Conflict', 'Habitat Destruction', 'Illegal Logging'][Math.floor(Math.random() * 4)],
        severity: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)],
        latitude: -1.2921 + (Math.random() - 0.5) * 2,
        longitude: 36.8219 + (Math.random() - 0.5) * 2,
        description: 'Incident reported during routine patrol',
        status: ['Reported', 'Investigating', 'Resolved'][Math.floor(Math.random() * 3)],
        reportedBy: users[Math.floor(Math.random() * users.length)].id,
        incidentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }
    await db.Incident.bulkCreate(incidents);
    console.log('✅ Incidents created');

    console.log('🎉 Database seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@wildlife.com / admin123');
    console.log('Ranger: ranger@wildlife.com / ranger123');
    console.log('Researcher: researcher@wildlife.com / researcher123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();