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
        name: "Namal Environmental Club (NEC)",
        category: "social",
        description: "Preserves the Green Namal vision by conducting plantation drives, green recycling initiatives, campus clean-ups, and environmental awareness seminars in the Salt Range.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 85,
        imageUrl: "/societies/nec_banner.png"
      },
      {
        name: "Namal Idea Club (NIC)",
        category: "technical",
        description: "Draws out students' entrepreneurial proficiency, providing business, digital marketing, and stock insights, and supporting student startups via the ICON incubation centre.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 73,
        imageUrl: "/societies/nic_banner.png"
      },
      {
        name: "Namal Society for Social Impact (NSSI)",
        category: "social",
        description: "Champions community welfare, student financial support, blood donation drives with local sargodha foundations, and social educational initiatives in Mianwali.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 94,
        imageUrl: "/societies/nssi_banner.png"
      },
      {
        name: "Namal Literary & Debating Society (LDS)",
        category: "literary",
        description: "Pioneer student society for literature, debating, creative writing, and open-mics, maintaining classical discourse and competitive speech skills.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 110,
        imageUrl: "/societies/lds_banner.png"
      },
      {
        name: "Namal Sports & Adventure Club (NSAC)",
        category: "sports",
        description: "Ensures students participate in physical drills, recreational games on and off campus, Sports Gala campaigns, and inter-house football leagues near Namal Lake.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 150,
        imageUrl: "/societies/nsac_banner.png"
      },
      {
        name: "Namal Dramatic Club (NDC)",
        category: "arts",
        description: "Provides a brilliant platform for stage plays, theatrical expression, playwriting, annual campus dramas, and music ensembles.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 58,
        imageUrl: "/societies/ndc_banner.png"
      },
      {
        name: "Namal Media Club (VoN)",
        category: "arts",
        description: "Known as the 'Eyes and ears of Namal'. Captures, logs, and promotes university events, photography courses, and student digital newsletters.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 48,
        imageUrl: "/societies/von_banner.png"
      },
      {
        name: "Skills Development Society (SDS)",
        category: "literary",
        description: "Provides language proficiency assistance, soft skills development, presentation courses, and career readiness training.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 65,
        imageUrl: "/societies/sds_banner.png"
      },
      {
        name: "Open Source Society (OSS)",
        category: "technical",
        description: "Promotes open-source software contributions, digital tech talks, modern code versioning, and collective coding sprints.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 52,
        imageUrl: "/societies/oss_banner.png"
      },
      {
        name: "Namal Computing Society (NCS)",
        category: "technical",
        description: "Drives competitive coding championships, technical programming sprints, neural network workshops, and tech expos inside the Huawei Lab.",
        patronName: "Faculty Patron",
        facultyCoordinator: "Society Coordinator",
        executiveBody: [{ userId: executiveUser._id, position: "Executive Lead" }],
        memberCount: 80,
        imageUrl: "/societies/ncs_banner.png"
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
        title: "Namal Sports Gala 2026",
        type: "sports",
        status: "approved",
        location: "Namal Sports Facility",
        startDateTime: new Date("2026-06-15T09:00:00"),
        endDateTime: new Date("2026-06-15T18:00:00"),
        capacity: 150,
        registered: 1, // Will seed studentUser RSVP
        description: "The premier athletic league of Namal University where house teams compete fiercely in athletics, cricket, football, and badminton near Namal Lake.",
        qrCodeToken: "rumi_secure_token_sports_gala_101",
        createdBy: executiveUser._id,
        imageUrl: "/events/sports_gala_2026.png"
      },
      {
        societyId: findSocietyId("Namal Society for Social Impact (NSSI)"),
        title: "Blood Donation Drive (Sundas Foundation)",
        type: "seminar",
        status: "approved",
        location: "Academic Block",
        startDateTime: new Date("2026-06-08T10:00:00"),
        endDateTime: new Date("2026-06-08T16:00:00"),
        capacity: 100,
        registered: 0,
        description: "Namal Society for Social Impact in collaboration with Sundas Foundation is organizing a voluntary blood donation drive. Come forward and save a life!",
        qrCodeToken: "rumi_secure_token_blood_drive_102",
        createdBy: executiveUser._id,
        imageUrl: "/events/blood_drive.png"
      },
      {
        societyId: findSocietyId("Namal Idea Club (NIC)"),
        title: "NAMAL Ideathon & Innovation Expo 2026",
        type: "competition",
        status: "approved",
        location: "Main Building",
        startDateTime: new Date("2026-06-22T09:00:00"),
        endDateTime: new Date("2026-06-22T17:00:00"),
        capacity: 120,
        registered: 0,
        description: "Showcase your entrepreneurial ideas and creative startups. Compete for seed funding, pitch in front of industry leaders, and win attractive cash prizes at the annual expo.",
        qrCodeToken: "rumi_secure_token_ideathon_103",
        createdBy: executiveUser._id,
        imageUrl: "/events/ideathon_2026.png"
      },
      {
        societyId: findSocietyId("Namal Computing Society (NCS)"),
        title: "NCS LLM & Generative AI Workshop",
        type: "workshop",
        status: "approved",
        location: "Huawei Lab",
        startDateTime: new Date("2026-06-05T14:30:00"),
        endDateTime: new Date("2026-06-05T17:30:00"),
        capacity: 60,
        registered: 0,
        description: "A comprehensive, hands-on workshop on Large Language Models, prompt engineering, and building agentic AI applications inside the Huawei Lab.",
        qrCodeToken: "rumi_secure_token_ai_workshop_104",
        createdBy: executiveUser._id,
        imageUrl: "/events/ai_workshop.png"
      },
      {
        societyId: findSocietyId("Namal Computing Society (NCS)"),
        title: "Namal Mathematics Carnival 4.0",
        type: "competition",
        status: "approved",
        location: "Academic Block Auditorium",
        startDateTime: new Date("2026-06-18T10:00:00"),
        endDateTime: new Date("2026-06-18T15:00:00"),
        capacity: 80,
        registered: 0,
        description: "Challenge your analytical capabilities in Namal's signature mathematics carnival featuring speed math, logic puzzles, and team quizzes.",
        qrCodeToken: "rumi_secure_token_math_carnival_105",
        createdBy: executiveUser._id,
        imageUrl: "/events/math_carnival.png"
      },
      {
        societyId: findSocietyId("Namal Sports & Adventure Club (NSAC)"),
        title: "Inter-House Football Tournament",
        type: "sports",
        status: "pendingApproval",
        location: "Namal Sports Facility",
        startDateTime: new Date("2026-06-28T16:00:00"),
        endDateTime: new Date("2026-06-28T19:30:00"),
        capacity: 100,
        registered: 0,
        description: "Rumi House and other houses clash on the football pitch for the prestigious inter-house championship shield. Register as a player or join to support your house!",
        qrCodeToken: "rumi_secure_token_football_106",
        createdBy: executiveUser._id,
        imageUrl: "/events/football_tournament.png"
      }
    ];

    const seededEvents = await Event.create(eventsData);
    console.log(`✅ Seeded ${seededEvents.length} events successfully.`);

    // 6. Seed a sample RSVP relation to establish relational data
    const sportsEvent = seededEvents.find(e => e.title === "Namal Sports Gala 2026");
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
        title: "Namal University Mianwali Convocation, Class of 2023",
        category: "newsletter",
        summary: "Celebrating the success, perseverance, and achievements of our graduates at the 11th Convocation Ceremony of Namal University.",
        content: "Namal University held its landmark Convocation ceremony, awarding degrees to the graduating Class of 2023. Families, faculty, and distinguished guests gathered at the Mianwali campus to witness the crowning achievements of our talented scholars, engineers, and future business leaders.",
        publishedBy: adminUser._id,
        status: 'published',
        imageUrl: "/news/convocation_2023.png"
      },
      {
        title: "Step Into Excellence | Admissions 2026",
        category: "alert",
        summary: "Namal University's undergraduate admissions are officially open. Apply online for BS Computer Science, BS Software Engineering, BS EE, and BBA programs.",
        content: "Become part of Pakistan's premier rural development initiative and high-tech academic landscape. Admissions for Fall 2026 are now open. With over 90% of students receiving financial support or scholarships, Namal remains committed to bringing world-class education within reach.",
        publishedBy: adminUser._id,
        status: 'published',
        imageUrl: "/news/admissions_2026.png"
      },
      {
        title: "NUST NET (Series-4) Valid for Admission at Namal University",
        category: "alert",
        summary: "Great news for prospective engineering and computing students! Namal University will accept NUST NET Series-4 scores for undergraduate admissions.",
        content: "To facilitate prospective students from across Pakistan, Namal University is pleased to announce that candidates with valid NUST NET Series-4 test scores can directly apply for admission into our BS CS, BS SE, and BS EE programs for Fall 2026. Submit your scores through the online admission portal before the deadline.",
        publishedBy: adminUser._id,
        status: 'published',
        imageUrl: "/news/net_admission.png"
      },
      {
        title: "Embracing the Spirit of Ramzan | Ehtram-e-Ramzan",
        category: "newsletter",
        summary: "Namal Society for Social Impact hosted a campus-wide Iftar for local community members and campus support staff.",
        content: "In the true spirit of empathy and inclusivity, the Namal community gathered for a grand Iftar hosted by student volunteers. The event fostered dialogue, shared blessings, and recognized the contributions of our dedicated administrative and security staff.",
        publishedBy: adminUser._id,
        status: 'published',
        imageUrl: "/news/ramzan_iftar.png"
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
