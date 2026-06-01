const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const User = require('../models/User');
const Society = require('../models/Society');
const Event = require('../models/Event');
const News = require('../models/News');
const Membership = require('../models/Membership');
const RSVP = require('../models/RSVP');
const Attendance = require('../models/Attendance');

// Load environment variables
dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rumi_house_hub';
    console.log(`📡 Seeding data to: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('🔌 Connected to database for seeding...');

    // 1. Wipe all existing collections
    console.log('🧹 Wiping existing collections...');
    await User.deleteMany({});
    await Society.deleteMany({});
    await Event.deleteMany({});
    await News.deleteMany({});
    await Membership.deleteMany({});
    await RSVP.deleteMany({});
    await Attendance.deleteMany({});
    console.log('🧹 Database collections cleared.');

    // 2. Hash demo user passwords
    console.log('🔑 Generating cryptographically pre-hashed passwords...');
    const salt = await bcrypt.genSalt(10);
    const hashStudent = await bcrypt.hash('student123', salt);
    const hashExecutive = await bcrypt.hash('executive123', salt);
    const hashAdmin = await bcrypt.hash('admin123', salt);

    // 3. Insert academic demo users
    console.log('👥 Creating default role accounts...');
    const studentUser = await User.create({
      name: 'Abu Bakar (Student)',
      email: 'student@namal.edu.pk',
      registrationNumber: 'NUM-BSCS-2022-41',
      role: 'student',
      department: 'Computer Science',
      batch: '2022',
      passwordHash: hashStudent
    });

    const executiveUser = await User.create({
      name: 'Ali Raza (Executive)',
      email: 'executive@namal.edu.pk',
      registrationNumber: 'NUM-BSEE-2021-12',
      role: 'executive',
      department: 'Electrical Engineering',
      batch: '2021',
      passwordHash: hashExecutive
    });

    const adminUser = await User.create({
      name: 'Admin Chief (Rumi)',
      email: 'admin@namal.edu.pk',
      registrationNumber: 'NUM-BSCS-2020-01',
      role: 'admin',
      department: 'Computer Science',
      batch: '2020',
      passwordHash: hashAdmin
    });

    console.log(`✅ Seeded Users: \n- Student: student@namal.edu.pk\n- Executive: executive@namal.edu.pk\n- Admin: admin@namal.edu.pk`);

    // 4. Seed societies list, mapping executiveUser as position lead
    console.log('🏢 Seeding societies directory...');
    const societiesData = [
      {
        name: "Rumi Debating Club",
        category: "literary",
        description: "Fosters public speaking, structured argument development, and eloquence among house members through regular internal debates and regional simulations.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 42
      },
      {
        name: "Rumi Art & Calligraphy Club",
        category: "arts",
        description: "Nurtures artistic expression, classical calligraphy skills, and hands-on visual arts projects to represent the house in design challenges.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 31
      },
      {
        name: "Rumi Reading Club",
        category: "literary",
        description: "Creates a community of readers dedicated to deep textual analysis, weekly book reviews, and intellectual group discussions on classic literature.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 27
      },
      {
        name: "Rumi Décor Club",
        category: "arts",
        description: "Enlivens the living spaces and community lobbies of Rumi House, executing creative interior designs and setting up layouts for all our house events.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 24
      },
      {
        name: "Rumi Writing Club",
        category: "literary",
        description: "Empowers aspiring writers, essayists, and poets within Rumi House, conducting collaborative peer reviews, workshops, and publishing our house newsletter.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 35
      },
      {
        name: "Namal Environmental Club (NEC)",
        category: "social",
        description: "Spearheads environmental awareness campaigns, massive tree plantation drives, recycling initiatives, and cleaning actions supporting a sustainable Green Namal campus.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 85
      },
      {
        name: "Namal Idea Club (NIC)",
        category: "technical",
        description: "Cultivates design thinking, technological entrepreneurship, and inventive problem-solving among students, helping turn ideas into viable tech prototypes.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 73
      },
      {
        name: "Namal Society for Social Impact (NSSI)",
        category: "social",
        description: "Champions community welfare, blood donation camps, local school volunteering, and social development programs targeting the uplift of underprivileged areas around Mianwali.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 94
      },
      {
        name: "Namal Literary & Debating Society (LDS)",
        category: "literary",
        description: "Organizes university-wide parliamentary debating competitions, creative writing contests, poetry recitals, and classical Urdu and English literary workshops.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 110
      },
      {
        name: "Namal Sports & Adventure Club (NSAC)",
        category: "sports",
        description: "Promotes physical well-being, competitive sportsmanship, and outdoor adventure activities, including trekking trips and inter-house leagues.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 150
      },
      {
        name: "Namal Dramatic Club (NDC)",
        category: "arts",
        description: "Inspires stage acting, theatrical production, playwriting, and cultural performances, organizing annual campus dramas and hosting theater festivals.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 58
      }
    ];

    const seededSocieties = await Society.create(societiesData);
    console.log(`✅ Seeded ${seededSocieties.length} societies successfully.`);

    // Helper to find seeded society ID by name
    const findSocietyId = (name) => {
      const found = seededSocieties.find(s => s.name === name);
      return found ? found._id : null;
    };

    // 5. Seed events, mapping relational hosting society ID
    console.log('📅 Seeding event calendar...');
    const eventsData = [
      {
        societyId: findSocietyId("Namal Sports & Adventure Club (NSAC)"),
        title: "Inter-House Sports Gala",
        type: "sports",
        status: "approved",
        location: "Namal Sports Complex",
        startDateTime: new Date("2026-06-15T09:00:00"),
        endDateTime: new Date("2026-06-15T18:00:00"),
        capacity: 100,
        registered: 1, // Will seed studentUser RSVP
        description: "The ultimate sports competition where all university houses compete in cricket, football, basketball, and track events. Join to represent Rumi House and claim the championship shield!",
        qrCodeToken: "rumi_secure_token_sports_gala_101",
        createdBy: executiveUser._id
      },
      {
        societyId: findSocietyId("Rumi Debating Club"),
        title: "Rumi Debate Workshop",
        type: "workshop",
        status: "approved",
        location: "Rumi House Study Lounge",
        startDateTime: new Date("2026-06-05T16:30:00"),
        endDateTime: new Date("2026-06-05T18:30:00"),
        capacity: 40,
        registered: 0,
        description: "An interactive masterclass on debate structures, motion analysis, and arguments building, led by veteran senior speakers. Excellent preparation for upcoming inter-university declamations.",
        qrCodeToken: "rumi_secure_token_debate_102",
        createdBy: executiveUser._id
      },
      {
        societyId: findSocietyId("Namal Literary & Debating Society (LDS)"),
        title: "Poetry & Literary Night",
        type: "competition",
        status: "approved",
        location: "Main Auditorium",
        startDateTime: new Date("2026-06-20T19:00:00"),
        endDateTime: new Date("2026-06-20T22:30:00"),
        capacity: 200,
        registered: 0,
        description: "An evening of poetry recitations, literary discussions, and musical performances celebrating Eastern and Western classical literature.",
        qrCodeToken: "rumi_secure_token_poetry_103",
        createdBy: executiveUser._id
      },
      {
        societyId: findSocietyId("Namal Environmental Club (NEC)"),
        title: "Green Campus Tree Plantation",
        type: "workshop",
        status: "approved",
        location: "Namal Botanical Garden",
        startDateTime: new Date("2026-06-08T08:00:00"),
        endDateTime: new Date("2026-06-08T12:00:00"),
        capacity: 80,
        registered: 0,
        description: "A hands-on volunteer action to plant 200 native saplings across campus grounds. Let's act collectively to reduce carbon footprint and build a lush, sustainable environment.",
        qrCodeToken: "rumi_secure_token_eco_104",
        createdBy: executiveUser._id
      },
      {
        societyId: findSocietyId("Namal Idea Club (NIC)"),
        title: "Annual Alumni Homecoming Meetup",
        type: "seminar",
        status: "pendingApproval", // proposed, needs admin approval
        location: "Executive Seminar Room",
        startDateTime: new Date("2026-06-25T14:00:00"),
        endDateTime: new Date("2026-06-25T17:00:00"),
        capacity: 120,
        registered: 0,
        description: "A prestigious networking and seminar session featuring Namal university alumni sharing industry experiences, startup journeys, and career development roadmaps.",
        qrCodeToken: "rumi_secure_token_nic_105",
        createdBy: executiveUser._id
      }
    ];

    const seededEvents = await Event.create(eventsData);
    console.log(`✅ Seeded ${seededEvents.length} events successfully.`);

    // 6. Seed a sample RSVP relation to establish relational data
    const sportsEvent = seededEvents.find(e => e.title === "Inter-House Sports Gala");
    if (sportsEvent) {
      await RSVP.create({
        eventId: sportsEvent._id,
        userId: studentUser._id,
        status: 'going'
      });
      console.log('🎟️ Seeded relational student RSVP for Sports Gala.');
    }

    // 7. Seed news articles publishing references
    console.log('📰 Seeding news bulletins...');
    const newsData = [
      {
        title: "Rumi House Newsletter: Spring Edition 2026",
        category: "newsletter",
        summary: "Our seasonal publication celebrating Rumi House academic achievements, sports gala triumphs, co-curricular awards, and student-council services.",
        content: "We are extremely proud to launch the Spring Edition 2026 of the Rumi House Newsletter. This term has witnessed remarkable milestones for our house members. Our athletic teams performed exceptionally well in the regional sports championships, securing gold medals in cricket and table tennis. On the academic front, over fifteen Rumi members made it to the Dean's Honor List with high CGPAs.",
        publishedBy: adminUser._id,
        status: 'published'
      },
      {
        title: "Sports Gala Special Bulletin",
        category: "alert",
        summary: "Official declaration regarding the schedule of matches, team registrations, house jerseys, and mandatory practice sessions for the upcoming Inter-House Sports Gala.",
        content: "Attention all Rumi House residents! The team registrations for the upcoming Inter-House Sports Gala (E101) are officially open. All team captains are directed to submit their final player lists to the sports coordinator by June 3rd. Let's bring the championship trophy back to Rumi House!",
        publishedBy: adminUser._id,
        status: 'published'
      },
      {
        title: "Social Impact Annual Outreach Review",
        category: "visit",
        summary: "An extensive review of the annual village uplift projects, school restoration efforts, and welfare drives successfully executed by Namalites this year.",
        content: "Namalites have once again demonstrated their commitment to society. Under this initiative, our student teams visited three neighboring rural schools to establish mini science laboratories and library shelves, donating over 300 books.",
        publishedBy: adminUser._id,
        status: 'published'
      }
    ];

    await News.create(newsData);
    console.log('✅ Seeded news bulletins successfully.');

    console.log('🎉 Data migration & database seeding completed successfully!');
    mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('💥 Data Seeding Failed:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

// Only run if file is executed directly
if (require.main === module) {
  seedDB();
}
