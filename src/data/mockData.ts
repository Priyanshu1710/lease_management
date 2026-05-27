import type { Property, Tenant, Lease, Invoice, MaintenanceTicket, Document, Notification } from '../types';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Apex Plaza',
    address: '452 Geary St, San Francisco, CA 94102',
    type: 'commercial',
    totalFloors: 10,
    totalUnits: 12,
    occupancyRate: 83.3,
    parkingAvailable: true,
    amenities: ['24/7 Security', 'Fiber Optic Internet', 'Underground Parking', 'Conference Rooms', 'Rooftop Terrace'],
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A state-of-the-art grade-A commercial office space located in the heart of downtown San Francisco. Custom building automation systems, panoramic city views, and certified energy-efficient layout.',
    units: [
      { id: 'unit-101', propertyId: 'prop-1', unitNumber: '101', floorNumber: 1, area: 4500, rentAmount: 9500, occupancyStatus: 'occupied', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc' },
      { id: 'unit-102', propertyId: 'prop-1', unitNumber: '102', floorNumber: 1, area: 3800, rentAmount: 8200, occupancyStatus: 'occupied', tenantId: 'tenant-2', tenantName: 'Acme Logistics' },
      { id: 'unit-201', propertyId: 'prop-1', unitNumber: '201', floorNumber: 2, area: 6000, rentAmount: 12500, occupancyStatus: 'occupied', tenantId: 'tenant-3', tenantName: 'Nova FinTech' },
      { id: 'unit-202', propertyId: 'prop-1', unitNumber: '202', floorNumber: 2, area: 5500, rentAmount: 11000, occupancyStatus: 'vacant' },
      { id: 'unit-301', propertyId: 'prop-1', unitNumber: '301', floorNumber: 3, area: 12000, rentAmount: 25000, occupancyStatus: 'occupied', tenantId: 'tenant-4', tenantName: 'Global Retail Corp' },
      { id: 'unit-401', propertyId: 'prop-1', unitNumber: '401', floorNumber: 4, area: 12000, rentAmount: 25000, occupancyStatus: 'occupied', tenantId: 'tenant-5', tenantName: 'BioVanguard Labs' },
      { id: 'unit-501', propertyId: 'prop-1', unitNumber: '501', floorNumber: 5, area: 12000, rentAmount: 26000, occupancyStatus: 'occupied', tenantId: 'tenant-6', tenantName: 'Sentinel Legal Group' },
      { id: 'unit-601', propertyId: 'prop-1', unitNumber: '601', floorNumber: 6, area: 12000, rentAmount: 26500, occupancyStatus: 'occupied', tenantId: 'tenant-7', tenantName: 'Vortex Media' },
      { id: 'unit-701', propertyId: 'prop-1', unitNumber: '701', floorNumber: 7, area: 12000, rentAmount: 27000, occupancyStatus: 'vacant' },
      { id: 'unit-801', propertyId: 'prop-1', unitNumber: '801', floorNumber: 8, area: 12000, rentAmount: 27500, occupancyStatus: 'occupied', tenantId: 'tenant-8', tenantName: 'Peak Venture Capital' },
      { id: 'unit-901', propertyId: 'prop-1', unitNumber: '901', floorNumber: 9, area: 12000, rentAmount: 28000, occupancyStatus: 'occupied', tenantId: 'tenant-9', tenantName: 'Apex Co-Working Space' },
      { id: 'unit-1001', propertyId: 'prop-1', unitNumber: '1001', floorNumber: 10, area: 10000, rentAmount: 30000, occupancyStatus: 'occupied', tenantId: 'tenant-10', tenantName: 'Founder Hub' }
    ]
  },
  {
    id: 'prop-2',
    name: 'Greenwood Residences',
    address: '1024 Elm Blvd, Seattle, WA 98101',
    type: 'residential',
    totalFloors: 5,
    totalUnits: 10,
    occupancyRate: 80.0,
    parkingAvailable: true,
    amenities: ['Fitness Center', 'Pet Friendly Spa', 'Smart Locks', 'Shared Courtyard', 'Bicycle Storage Room'],
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Modern mid-rise residential community incorporating eco-friendly materials, heat-pump ventilation, private balconies, and proximity to major tech campuses in downtown Seattle.',
    units: [
      { id: 'unit-g10', propertyId: 'prop-2', unitNumber: '10A', floorNumber: 1, area: 850, rentAmount: 2200, occupancyStatus: 'occupied', tenantId: 'tenant-11', tenantName: 'Sarah Jenkins' },
      { id: 'unit-g10b', propertyId: 'prop-2', unitNumber: '10B', floorNumber: 1, area: 900, rentAmount: 2350, occupancyStatus: 'occupied', tenantId: 'tenant-12', tenantName: 'Marcus Aurelius' },
      { id: 'unit-g20', propertyId: 'prop-2', unitNumber: '20A', floorNumber: 2, area: 1100, rentAmount: 2800, occupancyStatus: 'occupied', tenantId: 'tenant-13', tenantName: 'Clara Oswald' },
      { id: 'unit-g20b', propertyId: 'prop-2', unitNumber: '20B', floorNumber: 2, area: 1050, rentAmount: 2750, occupancyStatus: 'vacant' },
      { id: 'unit-g30', propertyId: 'prop-2', unitNumber: '30A', floorNumber: 3, area: 1100, rentAmount: 2900, occupancyStatus: 'occupied', tenantId: 'tenant-14', tenantName: 'David Tennant' },
      { id: 'unit-g30b', propertyId: 'prop-2', unitNumber: '30B', floorNumber: 3, area: 1150, rentAmount: 2950, occupancyStatus: 'occupied', tenantId: 'tenant-15', tenantName: 'Elena Rostova' },
      { id: 'unit-g40', propertyId: 'prop-2', unitNumber: '40A', floorNumber: 4, area: 1200, rentAmount: 3100, occupancyStatus: 'occupied', tenantId: 'tenant-16', tenantName: 'Robert Langdon' },
      { id: 'unit-g40b', propertyId: 'prop-2', unitNumber: '40B', floorNumber: 4, area: 1200, rentAmount: 3100, occupancyStatus: 'vacant' },
      { id: 'unit-g50', propertyId: 'prop-2', unitNumber: '50A', floorNumber: 5, area: 1600, rentAmount: 4200, occupancyStatus: 'occupied', tenantId: 'tenant-17', tenantName: 'Arthur Dent' },
      { id: 'unit-g50b', propertyId: 'prop-2', unitNumber: '50B', floorNumber: 5, area: 1550, rentAmount: 4100, occupancyStatus: 'occupied', tenantId: 'tenant-18', tenantName: 'Bruce Wayne' }
    ]
  },
  {
    id: 'prop-3',
    name: 'Windsor Manor Apartments',
    address: '782 Peachtree St NE, Atlanta, GA 30308',
    type: 'residential',
    totalFloors: 3,
    totalUnits: 6,
    occupancyRate: 66.6,
    parkingAvailable: false,
    amenities: ['Historic Architecture', 'High Ceilings', 'Hardwood Floors', 'Laundry Room', 'Communal Garden'],
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Charming historic building constructed in 1928, fully retrofitted with modern plumbing and electrical fixtures. Boasts solid brick construction and excellent natural lighting.',
    units: [
      { id: 'unit-w101', propertyId: 'prop-3', unitNumber: '101', floorNumber: 1, area: 950, rentAmount: 1800, occupancyStatus: 'occupied', tenantId: 'tenant-19', tenantName: 'Selina Kyle' },
      { id: 'unit-w102', propertyId: 'prop-3', unitNumber: '102', floorNumber: 1, area: 950, rentAmount: 1800, occupancyStatus: 'vacant' },
      { id: 'unit-w201', propertyId: 'prop-3', unitNumber: '201', floorNumber: 2, area: 1000, rentAmount: 1950, occupancyStatus: 'occupied', tenantId: 'tenant-20', tenantName: 'Peter Parker' },
      { id: 'unit-w202', propertyId: 'prop-3', unitNumber: '202', floorNumber: 2, area: 1000, rentAmount: 1950, occupancyStatus: 'occupied', tenantId: 'tenant-21', tenantName: 'Gwen Stacy' },
      { id: 'unit-w301', propertyId: 'prop-3', unitNumber: '301', floorNumber: 3, area: 1300, rentAmount: 2400, occupancyStatus: 'vacant' },
      { id: 'unit-w302', propertyId: 'prop-3', unitNumber: '302', floorNumber: 3, area: 1300, rentAmount: 2400, occupancyStatus: 'occupied', tenantId: 'tenant-22', tenantName: 'Clark Kent' }
    ]
  },
  {
    id: 'prop-4',
    name: 'Starlight Luxury Towers',
    address: '890 Ocean Dr, Miami Beach, FL 33139',
    type: 'residential',
    totalFloors: 15,
    totalUnits: 8,
    occupancyRate: 87.5,
    parkingAvailable: true,
    amenities: ['Infinity Pool', 'Private Beach Access', 'Valet Parking', 'Concierge Service', 'In-Unit Elevator'],
    images: [
      'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-exclusive residential high-rise with premium bespoke finishes, private elevators, and expansive ocean-front balconies. Offers absolute privacy and security.',
    units: [
      { id: 'unit-s501', propertyId: 'prop-4', unitNumber: '501', floorNumber: 5, area: 2200, rentAmount: 6500, occupancyStatus: 'occupied', tenantId: 'tenant-23', tenantName: 'Tony Stark' },
      { id: 'unit-s601', propertyId: 'prop-4', unitNumber: '601', floorNumber: 6, area: 2200, rentAmount: 6700, occupancyStatus: 'occupied', tenantId: 'tenant-24', tenantName: 'Natasha Romanoff' },
      { id: 'unit-s701', propertyId: 'prop-4', unitNumber: '701', floorNumber: 7, area: 2200, rentAmount: 6900, occupancyStatus: 'occupied', tenantId: 'tenant-25', tenantName: 'Wanda Maximoff' },
      { id: 'unit-s801', propertyId: 'prop-4', unitNumber: '801', floorNumber: 8, area: 2200, rentAmount: 7100, occupancyStatus: 'vacant' },
      { id: 'unit-s901', propertyId: 'prop-4', unitNumber: '901', floorNumber: 9, area: 2200, rentAmount: 7300, occupancyStatus: 'occupied', tenantId: 'tenant-26', tenantName: 'Diana Prince' },
      { id: 'unit-s1001', propertyId: 'prop-4', unitNumber: '1001', floorNumber: 10, area: 3200, rentAmount: 9800, occupancyStatus: 'occupied', tenantId: 'tenant-27', tenantName: 'Steve Rogers' },
      { id: 'unit-s1101', propertyId: 'prop-4', unitNumber: '1101', floorNumber: 11, area: 3200, rentAmount: 10200, occupancyStatus: 'occupied', tenantId: 'tenant-28', tenantName: 'Carol Danvers' },
      { id: 'unit-s1201', propertyId: 'prop-4', unitNumber: '1201', floorNumber: 12, area: 4500, rentAmount: 15000, occupancyStatus: 'occupied', tenantId: 'tenant-29', tenantName: 'Hal Jordan' }
    ]
  },
  {
    id: 'prop-5',
    name: 'Metropolitan Logistics Center',
    address: '2200 Industrial Pkwy, Chicago, IL 60608',
    type: 'commercial',
    totalFloors: 2,
    totalUnits: 4,
    occupancyRate: 75.0,
    parkingAvailable: true,
    amenities: ['Loading Docks', 'Heavy Power Supply', '18ft Clear Heights', 'Fenced Yard', 'Office Suites'],
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Industrial warehouse and distribution center situated close to major highways and transport lines. Includes modern office annexes and flexible loading solutions.',
    units: [
      { id: 'unit-m1', propertyId: 'prop-5', unitNumber: 'Suite A', floorNumber: 1, area: 25000, rentAmount: 18000, occupancyStatus: 'occupied', tenantId: 'tenant-30', tenantName: 'Speedy Delivery Services' },
      { id: 'unit-m2', propertyId: 'prop-5', unitNumber: 'Suite B', floorNumber: 1, area: 20000, rentAmount: 15000, occupancyStatus: 'occupied', tenantId: 'tenant-31', tenantName: 'Apex Manufacturing' },
      { id: 'unit-m3', propertyId: 'prop-5', unitNumber: 'Suite C', floorNumber: 2, area: 15000, rentAmount: 11500, occupancyStatus: 'occupied', tenantId: 'tenant-32', tenantName: 'Central Cold Storage' },
      { id: 'unit-m4', propertyId: 'prop-5', unitNumber: 'Suite D', floorNumber: 2, area: 10000, rentAmount: 8000, occupancyStatus: 'vacant' }
    ]
  }
];

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'TechSynergy Inc',
    email: 'info@techsynergy.io',
    phone: '+1 (555) 124-7890',
    companyName: 'TechSynergy Software solutions',
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1998-05-12', kycStatus: 'verified', emergencyContactName: 'Devin Cole', emergencyContactPhone: '+1 (555) 881-2290' }
  },
  {
    id: 'tenant-2',
    name: 'Acme Logistics',
    email: 'ops@acmelogistics.com',
    phone: '+1 (555) 321-4560',
    companyName: 'Acme Logistics Group',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'overdue',
    personalDetails: { dob: '1990-11-20', kycStatus: 'verified', emergencyContactName: 'Marsha Brady', emergencyContactPhone: '+1 (555) 992-0012' }
  },
  {
    id: 'tenant-3',
    name: 'Nova FinTech',
    email: 'billing@novafintech.co',
    phone: '+1 (555) 609-3400',
    companyName: 'Nova Capital & FinTech Ltd',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1985-02-15', kycStatus: 'verified', emergencyContactName: 'Edward Elric', emergencyContactPhone: '+1 (555) 231-1313' }
  },
  {
    id: 'tenant-4',
    name: 'Global Retail Corp',
    email: 'contact@globalretail.com',
    phone: '+1 (555) 789-0123',
    companyName: 'Global Retail Corporation',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'pending',
    personalDetails: { dob: '1976-08-08', kycStatus: 'verified', emergencyContactName: 'Alfred Pennyworth', emergencyContactPhone: '+1 (555) 123-4567' }
  },
  {
    id: 'tenant-5',
    name: 'BioVanguard Labs',
    email: 'admin@biovanguard.org',
    phone: '+1 (555) 456-7890',
    companyName: 'BioVanguard Research Laboratories',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1988-03-30', kycStatus: 'verified', emergencyContactName: 'Reed Richards', emergencyContactPhone: '+1 (555) 443-3221' }
  },
  {
    id: 'tenant-6',
    name: 'Sentinel Legal Group',
    email: 'accounts@sentinellegal.com',
    phone: '+1 (555) 901-2345',
    companyName: 'Sentinel Legal Associates',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1972-10-12', kycStatus: 'verified', emergencyContactName: 'Matt Murdock', emergencyContactPhone: '+1 (555) 987-6543' }
  },
  {
    id: 'tenant-7',
    name: 'Vortex Media',
    email: 'hello@vortexmedia.com',
    phone: '+1 (555) 890-1234',
    companyName: 'Vortex Advertising and Media LLC',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1993-01-25', kycStatus: 'verified', emergencyContactName: 'Karen Page', emergencyContactPhone: '+1 (555) 765-4321' }
  },
  {
    id: 'tenant-8',
    name: 'Peak Venture Capital',
    email: 'deals@peakvc.com',
    phone: '+1 (555) 234-5678',
    companyName: 'Peak VC Management',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1981-06-14', kycStatus: 'verified', emergencyContactName: 'Harvey Specter', emergencyContactPhone: '+1 (555) 333-4444' }
  },
  {
    id: 'tenant-9',
    name: 'Apex Co-Working Space',
    email: 'hq@apexspaces.com',
    phone: '+1 (555) 345-6789',
    companyName: 'Apex Coworking Hubs LLC',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1987-12-05', kycStatus: 'verified', emergencyContactName: 'Mike Ross', emergencyContactPhone: '+1 (555) 555-0101' }
  },
  {
    id: 'tenant-10',
    name: 'Founder Hub',
    email: 'incubate@founderhub.net',
    phone: '+1 (555) 456-0192',
    companyName: 'Founder Hub Incubators Inc',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'overdue',
    personalDetails: { dob: '1995-09-17', kycStatus: 'verified', emergencyContactName: 'Louis Litt', emergencyContactPhone: '+1 (555) 777-8888' }
  },
  // Residential Tenants (Greenwood Residences)
  {
    id: 'tenant-11',
    name: 'Sarah Jenkins',
    email: 'sarah.j@outlook.com',
    phone: '+1 (555) 671-9821',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1994-04-18', kycStatus: 'verified', emergencyContactName: 'Robert Jenkins', emergencyContactPhone: '+1 (555) 671-9800' }
  },
  {
    id: 'tenant-12',
    name: 'Marcus Aurelius',
    email: 'philosophy.king@rome.org',
    phone: '+1 (555) 120-1200',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1961-04-26', kycStatus: 'verified', emergencyContactName: 'Commodus', emergencyContactPhone: '+1 (555) 911-9111' }
  },
  {
    id: 'tenant-13',
    name: 'Clara Oswald',
    email: 'impossible.girl@tardis.co.uk',
    phone: '+1 (555) 909-0909',
    avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1989-11-23', kycStatus: 'verified', emergencyContactName: 'Danny Pink', emergencyContactPhone: '+1 (555) 111-2222' }
  },
  {
    id: 'tenant-14',
    name: 'David Tennant',
    email: 'doctor.ten@bbc.co.uk',
    phone: '+1 (555) 101-1010',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1971-04-18', kycStatus: 'verified', emergencyContactName: 'Rose Tyler', emergencyContactPhone: '+1 (555) 202-2020' }
  },
  {
    id: 'tenant-15',
    name: 'Elena Rostova',
    email: 'elena.rost@yandex.ru',
    phone: '+1 (555) 441-2099',
    avatarUrl: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'pending',
    personalDetails: { dob: '1992-07-09', kycStatus: 'pending', emergencyContactName: 'Nikolai Rostov', emergencyContactPhone: '+1 (555) 991-3044' }
  },
  {
    id: 'tenant-16',
    name: 'Robert Langdon',
    email: 'langdon@harvard.edu',
    phone: '+1 (555) 303-4040',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1964-06-22', kycStatus: 'verified', emergencyContactName: 'Sophie Neveu', emergencyContactPhone: '+1 (555) 505-6060' }
  },
  {
    id: 'tenant-17',
    name: 'Arthur Dent',
    email: 'adent@hitchhiker.galaxy',
    phone: '+1 (555) 424-2424',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1979-10-12', kycStatus: 'verified', emergencyContactName: 'Ford Prefect', emergencyContactPhone: '+1 (555) 424-4242' }
  },
  {
    id: 'tenant-18',
    name: 'Bruce Wayne',
    email: 'bruce@wayneenterprises.com',
    phone: '+1 (555) 777-9999',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1975-02-19', kycStatus: 'verified', emergencyContactName: 'Alfred Pennyworth', emergencyContactPhone: '+1 (555) 111-1212' }
  },
  // Windsor Manor
  {
    id: 'tenant-19',
    name: 'Selina Kyle',
    email: 'cat@gotham.city',
    phone: '+1 (555) 911-3333',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1988-03-14', kycStatus: 'verified', emergencyContactName: 'Holly Robinson', emergencyContactPhone: '+1 (555) 991-3000' }
  },
  {
    id: 'tenant-20',
    name: 'Peter Parker',
    email: 'web@dailybugle.com',
    phone: '+1 (555) 823-9321',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'overdue',
    personalDetails: { dob: '2001-08-10', kycStatus: 'pending', emergencyContactName: 'May Parker', emergencyContactPhone: '+1 (555) 823-1111' }
  },
  {
    id: 'tenant-21',
    name: 'Gwen Stacy',
    email: 'gstacy@empirestate.edu',
    phone: '+1 (555) 922-8321',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '2001-12-02', kycStatus: 'verified', emergencyContactName: 'George Stacy', emergencyContactPhone: '+1 (555) 922-0000' }
  },
  {
    id: 'tenant-22',
    name: 'Clark Kent',
    email: 'ckent@dailyplanet.com',
    phone: '+1 (555) 323-9999',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1979-06-18', kycStatus: 'verified', emergencyContactName: 'Martha Kent', emergencyContactPhone: '+1 (555) 323-1111' }
  },
  // Starlight Towers
  {
    id: 'tenant-23',
    name: 'Tony Stark',
    email: 'tony@starkindustries.com',
    phone: '+1 (555) 300-3000',
    companyName: 'Stark Industries',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1970-05-29', kycStatus: 'verified', emergencyContactName: 'Pepper Potts', emergencyContactPhone: '+1 (555) 300-3001' }
  },
  {
    id: 'tenant-24',
    name: 'Natasha Romanoff',
    email: 'natasha@shield.gov',
    phone: '+1 (555) 999-0007',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1984-11-22', kycStatus: 'verified', emergencyContactName: 'Clint Barton', emergencyContactPhone: '+1 (555) 999-0008' }
  },
  {
    id: 'tenant-25',
    name: 'Wanda Maximoff',
    email: 'wanda@avengers.org',
    phone: '+1 (555) 444-5555',
    avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1989-02-10', kycStatus: 'verified', emergencyContactName: 'Vision', emergencyContactPhone: '+1 (555) 444-5556' }
  },
  {
    id: 'tenant-26',
    name: 'Diana Prince',
    email: 'diana@louvre.museum',
    phone: '+1 (555) 121-1212',
    avatarUrl: 'https://images.unsplash.com/photo-1558203728-00f45181dd84?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1918-11-11', kycStatus: 'verified', emergencyContactName: 'Steve Trevor', emergencyContactPhone: '+1 (555) 121-0000' }
  },
  {
    id: 'tenant-27',
    name: 'Steve Rogers',
    email: 'cap@avengers.org',
    phone: '+1 (555) 194-1945',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1918-07-04', kycStatus: 'verified', emergencyContactName: 'Bucky Barnes', emergencyContactPhone: '+1 (555) 194-1946' }
  },
  {
    id: 'tenant-28',
    name: 'Carol Danvers',
    email: 'carol@nasa.gov',
    phone: '+1 (555) 888-8888',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1968-04-22', kycStatus: 'verified', emergencyContactName: 'Maria Rambeau', emergencyContactPhone: '+1 (555) 888-8889' }
  },
  {
    id: 'tenant-29',
    name: 'Hal Jordan',
    email: 'hjordan@ferrisair.com',
    phone: '+1 (555) 555-5555',
    companyName: 'Ferris Aircraft Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1978-08-20', kycStatus: 'verified', emergencyContactName: 'Carol Ferris', emergencyContactPhone: '+1 (555) 555-5556' }
  },
  // Industrial Tenants
  {
    id: 'tenant-30',
    name: 'Speedy Delivery Services',
    email: 'fleet@speedydeliver.com',
    phone: '+1 (555) 909-1200',
    companyName: 'Speedy Delivery Logistics Ltd',
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1984-09-09', kycStatus: 'verified', emergencyContactName: 'John Fast', emergencyContactPhone: '+1 (555) 909-1222' }
  },
  {
    id: 'tenant-31',
    name: 'Apex Manufacturing',
    email: 'facilities@apexmfg.com',
    phone: '+1 (555) 880-1200',
    companyName: 'Apex Industrial Parts & Mfg Corp',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1979-05-18', kycStatus: 'verified', emergencyContactName: 'Sam Weld', emergencyContactPhone: '+1 (555) 880-1222' }
  },
  {
    id: 'tenant-32',
    name: 'Central Cold Storage',
    email: 'storage@centralcold.com',
    phone: '+1 (555) 770-1200',
    companyName: 'Central Cold Storage & Logistics Group',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    leaseStatus: 'active',
    paymentStatus: 'paid',
    personalDetails: { dob: '1982-12-12', kycStatus: 'verified', emergencyContactName: 'Ice Box Manager', emergencyContactPhone: '+1 (555) 770-1222' }
  }
];

export const mockLeases: Lease[] = [
  {
    id: 'lease-101',
    tenantId: 'tenant-1',
    tenantName: 'TechSynergy Inc',
    tenantAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-1',
    propertyName: 'Apex Plaza',
    unitId: 'unit-101',
    unitNumber: '101',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    depositAmount: 19000,
    monthlyRent: 9500,
    status: 'active',
    renewalStatus: 'auto-renew',
    terms: 'The tenant is responsible for minor operational maintenance within office unit 101. Landlord provides central HVAC and structural maintenance. High-bandwidth fiber connection is dedicated. Early termination requires 3 months notice.',
    documentIds: ['doc-101', 'doc-102'],
    timeline: [
      { id: 't-1', date: '2023-11-15', title: 'Lease Drafted', description: 'Initial draft of lease prepared by Sentinel Legal Group.', type: 'created' },
      { id: 't-2', date: '2023-12-01', title: 'Lease Signed', description: 'Lease agreement signed by both landlord and CEO of TechSynergy.', type: 'signed' },
      { id: 't-3', date: '2024-01-01', title: 'Lease Started', description: 'Tenant moved into office suite 101. Initial deposit paid.', type: 'payment' }
    ]
  },
  {
    id: 'lease-102',
    tenantId: 'tenant-2',
    tenantName: 'Acme Logistics',
    tenantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-1',
    propertyName: 'Apex Plaza',
    unitId: 'unit-102',
    unitNumber: '102',
    startDate: '2023-06-01',
    endDate: '2026-05-31',
    depositAmount: 16400,
    monthlyRent: 8200,
    status: 'active',
    renewalStatus: 'under-review',
    terms: 'Commercial logistics depot usage rights. Loading zone access permitted during standard operating hours. Subletting strictly prohibited.',
    documentIds: ['doc-103'],
    timeline: [
      { id: 't-4', date: '2023-05-10', title: 'Draft Initiated', description: 'Standard warehouse office draft formulated.', type: 'created' },
      { id: 't-5', date: '2023-05-20', title: 'Agreement Signed', description: 'Signed copy filed under documents directory.', type: 'signed' },
      { id: 't-6', date: '2026-04-01', title: 'Renewal Warning', description: 'Lease expires soon. Sent renewal offer.', type: 'renewal_alert' }
    ]
  },
  {
    id: 'lease-201',
    tenantId: 'tenant-3',
    tenantName: 'Nova FinTech',
    tenantAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-1',
    propertyName: 'Apex Plaza',
    unitId: 'unit-201',
    unitNumber: '201',
    startDate: '2024-03-01',
    endDate: '2027-02-28',
    depositAmount: 25000,
    monthlyRent: 12500,
    status: 'active',
    renewalStatus: 'auto-renew',
    terms: 'Financial institution compliance layout. Raised flooring installation permitted at tenant cost. High security vaults must remain within unit guidelines.',
    documentIds: ['doc-104'],
    timeline: [
      { id: 't-7', date: '2024-02-10', title: 'Draft Finalized', description: 'Lease finalized with credit checks completed.', type: 'created' },
      { id: 't-8', date: '2024-02-22', title: 'Agreement Execution', description: 'Deposit received. Access keys handed over.', type: 'signed' }
    ]
  },
  {
    id: 'lease-11',
    tenantId: 'tenant-11',
    tenantName: 'Sarah Jenkins',
    tenantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-2',
    propertyName: 'Greenwood Residences',
    unitId: 'unit-g10',
    unitNumber: '10A',
    startDate: '2025-05-01',
    endDate: '2026-04-30',
    depositAmount: 4400,
    monthlyRent: 2200,
    status: 'active',
    renewalStatus: 'not-renewing',
    terms: 'Residential apartment lease. Pet policy: 1 cat allowed. Subletting via Airbnb or other third party systems is strictly forbidden and grounds for immediate eviction. Tenancy laws of Washington state apply.',
    documentIds: ['doc-201'],
    timeline: [
      { id: 't-9', date: '2025-04-12', title: 'Lease Initiated', description: 'Residential contract finalized.', type: 'created' },
      { id: 't-10', date: '2025-04-18', title: 'Agreement Executed', description: 'Signed electronically via docu-sign.', type: 'signed' },
      { id: 't-11', date: '2026-03-15', title: 'Move Out Alert', description: 'Tenant submitted notice. Moving out on end date.', type: 'renewal_alert' }
    ]
  },
  {
    id: 'lease-12',
    tenantId: 'tenant-12',
    tenantName: 'Marcus Aurelius',
    tenantAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-2',
    propertyName: 'Greenwood Residences',
    unitId: 'unit-g10b',
    unitNumber: '10B',
    startDate: '2024-09-01',
    endDate: '2026-08-31',
    depositAmount: 4700,
    monthlyRent: 2350,
    status: 'active',
    renewalStatus: 'manual-renew',
    terms: 'Residential lease. High speed internet package included. Quiet hours must be observed between 10:00 PM and 7:00 AM daily.',
    documentIds: ['doc-202'],
    timeline: [
      { id: 't-12', date: '2024-08-15', title: 'Lease Created', description: 'Draft generated and approved.', type: 'created' },
      { id: 't-13', date: '2024-08-20', title: 'Lease Finalized', description: 'Signatures obtained. Deposit cleared.', type: 'signed' }
    ]
  },
  {
    id: 'lease-19',
    tenantId: 'tenant-19',
    tenantName: 'Selina Kyle',
    tenantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-3',
    propertyName: 'Windsor Manor Apartments',
    unitId: 'unit-w101',
    unitNumber: '101',
    startDate: '2025-06-01',
    endDate: '2026-05-31',
    depositAmount: 3600,
    monthlyRent: 1800,
    status: 'active',
    renewalStatus: 'under-review',
    terms: 'Historic preservation guidelines apply. No structural alterations or painting allowed without landlord board consent. Pet policy active.',
    documentIds: ['doc-203'],
    timeline: [
      { id: 't-14', date: '2025-05-15', title: 'Lease Created', description: 'Standard historical preservation lease drafted.', type: 'created' },
      { id: 't-15', date: '2025-05-22', title: 'Lease Signed', description: 'Signed and first month rent received.', type: 'signed' },
      { id: 't-16', date: '2026-04-01', title: 'Renewal Reminder', description: 'Standard automated lease renewal notification generated.', type: 'renewal_alert' }
    ]
  },
  {
    id: 'lease-23',
    tenantId: 'tenant-23',
    tenantName: 'Tony Stark',
    tenantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-4',
    propertyName: 'Starlight Luxury Towers',
    unitId: 'unit-s501',
    unitNumber: '501',
    startDate: '2025-01-01',
    endDate: '2027-12-31',
    depositAmount: 13000,
    monthlyRent: 6500,
    status: 'active',
    renewalStatus: 'auto-renew',
    terms: 'High-load laboratory grid power approved for penthouse suite 501. Sound insulation verified. Smart house systems integrated and linked.',
    documentIds: ['doc-204'],
    timeline: [
      { id: 't-17', date: '2024-12-10', title: 'Bespoke Draft Created', description: 'Draft formulated incorporating specific power requirements.', type: 'created' },
      { id: 't-18', date: '2024-12-18', title: 'Lease Executed', description: 'Deposit wired and keys registered.', type: 'signed' }
    ]
  },
  {
    id: 'lease-30',
    tenantId: 'tenant-30',
    tenantName: 'Speedy Delivery Services',
    tenantAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    propertyId: 'prop-5',
    propertyName: 'Metropolitan Logistics Center',
    unitId: 'unit-m1',
    unitNumber: 'Suite A',
    startDate: '2023-11-01',
    endDate: '2028-10-31',
    depositAmount: 36000,
    monthlyRent: 18000,
    status: 'active',
    renewalStatus: 'auto-renew',
    terms: 'Heavy logistics warehouse usage. Tenant responsible for maintaining loading dock levelers and rollup doors. Operating hours 24/7. Hazardous material storage restricted unless pre-permitted.',
    documentIds: ['doc-301'],
    timeline: [
      { id: 't-19', date: '2023-09-15', title: 'Warehouse Lease Created', description: 'Logistics center standard lease prepared.', type: 'created' },
      { id: 't-20', date: '2023-10-02', title: 'Agreement Signed', description: 'Signatures finalized and keys dispatched.', type: 'signed' }
    ]
  }
];

export const mockInvoices: Invoice[] = [
  { id: 'inv-1001', leaseId: 'lease-101', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc', propertyName: 'Apex Plaza', unitNumber: '101', amount: 9500, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-04-28', paymentMethod: 'bank_transfer', billingPeriod: 'May 2026' },
  { id: 'inv-1002', leaseId: 'lease-101', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc', propertyName: 'Apex Plaza', unitNumber: '101', amount: 9500, dueDate: '2026-06-01', status: 'pending', billingPeriod: 'June 2026' },
  
  { id: 'inv-1003', leaseId: 'lease-102', tenantId: 'tenant-2', tenantName: 'Acme Logistics', propertyName: 'Apex Plaza', unitNumber: '102', amount: 8200, dueDate: '2026-04-01', status: 'overdue', billingPeriod: 'April 2026' },
  { id: 'inv-1004', leaseId: 'lease-102', tenantId: 'tenant-2', tenantName: 'Acme Logistics', propertyName: 'Apex Plaza', unitNumber: '102', amount: 8200, dueDate: '2026-05-01', status: 'overdue', billingPeriod: 'May 2026' },
  { id: 'inv-1005', leaseId: 'lease-102', tenantId: 'tenant-2', tenantName: 'Acme Logistics', propertyName: 'Apex Plaza', unitNumber: '102', amount: 8200, dueDate: '2026-06-01', status: 'pending', billingPeriod: 'June 2026' },
  
  { id: 'inv-1006', leaseId: 'lease-201', tenantId: 'tenant-3', tenantName: 'Nova FinTech', propertyName: 'Apex Plaza', unitNumber: '201', amount: 12500, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-04-30', paymentMethod: 'bank_transfer', billingPeriod: 'May 2026' },
  { id: 'inv-1007', leaseId: 'lease-201', tenantId: 'tenant-3', tenantName: 'Nova FinTech', propertyName: 'Apex Plaza', unitNumber: '201', amount: 12500, dueDate: '2026-06-01', status: 'pending', billingPeriod: 'June 2026' },
  
  { id: 'inv-1008', leaseId: 'lease-11', tenantId: 'tenant-11', tenantName: 'Sarah Jenkins', propertyName: 'Greenwood Residences', unitNumber: '10A', amount: 2200, dueDate: '2026-04-01', status: 'paid', paidDate: '2026-04-01', paymentMethod: 'credit_card', billingPeriod: 'April 2026' },
  { id: 'inv-1009', leaseId: 'lease-11', tenantId: 'tenant-11', tenantName: 'Sarah Jenkins', propertyName: 'Greenwood Residences', unitNumber: '10A', amount: 2200, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-05-02', paymentMethod: 'credit_card', billingPeriod: 'May 2026' },
  
  { id: 'inv-1010', leaseId: 'lease-12', tenantId: 'tenant-12', tenantName: 'Marcus Aurelius', propertyName: 'Greenwood Residences', unitNumber: '10B', amount: 2350, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-04-29', paymentMethod: 'bank_transfer', billingPeriod: 'May 2026' },
  { id: 'inv-1011', leaseId: 'lease-12', tenantId: 'tenant-12', tenantName: 'Marcus Aurelius', propertyName: 'Greenwood Residences', unitNumber: '10B', amount: 2350, dueDate: '2026-06-01', status: 'pending', billingPeriod: 'June 2026' },
  
  { id: 'inv-1012', leaseId: 'lease-19', tenantId: 'tenant-19', tenantName: 'Selina Kyle', propertyName: 'Windsor Manor Apartments', unitNumber: '101', amount: 1800, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-05-01', paymentMethod: 'cash', billingPeriod: 'May 2026' },
  
  { id: 'inv-1013', leaseId: 'lease-23', tenantId: 'tenant-23', tenantName: 'Tony Stark', propertyName: 'Starlight Luxury Towers', unitNumber: '501', amount: 6500, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-04-25', paymentMethod: 'bank_transfer', billingPeriod: 'May 2026' },
  
  { id: 'inv-1014', leaseId: 'lease-30', tenantId: 'tenant-30', tenantName: 'Speedy Delivery Services', propertyName: 'Metropolitan Logistics Center', unitNumber: 'Suite A', amount: 18000, dueDate: '2026-05-01', status: 'paid', paidDate: '2026-04-30', paymentMethod: 'bank_transfer', billingPeriod: 'May 2026' },
  
  { id: 'inv-1015', leaseId: 'lease-101', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc', propertyName: 'Apex Plaza', unitNumber: '101', amount: 9500, dueDate: '2026-04-01', status: 'paid', paidDate: '2026-03-29', paymentMethod: 'bank_transfer', billingPeriod: 'April 2026' }
];

export const mockMaintenanceTickets: MaintenanceTicket[] = [
  {
    id: 'tkt-201',
    propertyId: 'prop-1',
    propertyName: 'Apex Plaza',
    unitId: 'unit-101',
    unitNumber: '101',
    tenantId: 'tenant-1',
    tenantName: 'TechSynergy Inc',
    tenantAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
    category: 'hvac',
    title: 'AC cooling unit blowing warm air',
    description: 'The primary AC ventilation duct in the main developers row is blowing warm air. Technicians checked thermostat settings but room temperature is rising past 78 degrees. Requesting urgent repair as servers are heat-sensitive.',
    status: 'in_progress',
    priority: 'high',
    assignedStaff: 'James Carter (HVAC Specialist)',
    images: [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&w=400&q=80'
    ],
    createdAt: '2026-05-25',
    timeline: [
      { id: 'tk-t1', date: '2026-05-25 09:30', status: 'new', description: 'Ticket created by TechSynergy manager.' },
      { id: 'tk-t2', date: '2026-05-25 11:00', status: 'assigned', description: 'Assigned to HVAC department, lead technician James Carter.' },
      { id: 'tk-t3', date: '2026-05-26 14:00', status: 'in_progress', description: 'James arrived at building, diagnosed compressor condenser coil leak. Parts ordered.' }
    ],
    notes: [
      { id: 'note-1', author: 'James Carter', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80', note: 'Replacement coil ordered. Will arrive on site tomorrow morning for assembly.', date: '2026-05-26 14:15' },
      { id: 'note-2', author: 'TechSynergy Admin', avatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=80&q=80', note: 'Appreciate the update. Server room portable fans deployed temporarily.', date: '2026-05-26 14:30' }
    ]
  },
  {
    id: 'tkt-202',
    propertyId: 'prop-2',
    propertyName: 'Greenwood Residences',
    unitId: 'unit-g10',
    unitNumber: '10A',
    tenantId: 'tenant-11',
    tenantName: 'Sarah Jenkins',
    tenantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    category: 'plumbing',
    title: 'Kitchen sink drain leaking',
    description: 'Noticed water pooling under the kitchen sink cupboard. It seems the U-bend pipe is slightly cracked or has a loose fitting. Slow leak but starting to smell damp.',
    status: 'assigned',
    priority: 'medium',
    assignedStaff: 'Robert Miller (Plumber)',
    images: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80'
    ],
    createdAt: '2026-05-26',
    timeline: [
      { id: 'tk-t4', date: '2026-05-26 18:00', status: 'new', description: 'Ticket created by Sarah Jenkins.' },
      { id: 'tk-t5', date: '2026-05-27 08:30', status: 'assigned', description: 'Assigned to Robert Miller.' }
    ],
    notes: []
  },
  {
    id: 'tkt-203',
    propertyId: 'prop-3',
    propertyName: 'Windsor Manor Apartments',
    unitId: 'unit-w101',
    unitNumber: '101',
    tenantId: 'tenant-19',
    tenantName: 'Selina Kyle',
    tenantAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    category: 'electrical',
    title: 'Circuit breaker trips in kitchen area',
    description: 'Whenever the toaster and coffee maker are used simultaneously, the kitchen circuit breaker trips. Requires electrical load review and possibly replacing old breaker switch.',
    status: 'new',
    priority: 'medium',
    images: [],
    createdAt: '2026-05-27',
    timeline: [
      { id: 'tk-t6', date: '2026-05-27 10:15', status: 'new', description: 'Ticket created by Selina Kyle.' }
    ],
    notes: []
  },
  {
    id: 'tkt-204',
    propertyId: 'prop-1',
    propertyName: 'Apex Plaza',
    unitId: 'unit-102',
    unitNumber: '102',
    tenantId: 'tenant-2',
    tenantName: 'Acme Logistics',
    tenantAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
    category: 'structural',
    title: 'Loading dock rollup door stuck half-way',
    description: 'Rollup garage gate door number 2 is stuck half-way. The electric motor hums but does not lift the roller. We cannot load or unload two containers today.',
    status: 'resolved',
    priority: 'high',
    assignedStaff: 'Max Kowalski (Garage Door Technician)',
    images: [],
    createdAt: '2026-05-20',
    timeline: [
      { id: 'tk-t7', date: '2026-05-20 07:00', status: 'new', description: 'Ticket created.' },
      { id: 'tk-t8', date: '2026-05-20 08:30', status: 'assigned', description: 'Assigned to Max Kowalski.' },
      { id: 'tk-t9', date: '2026-05-20 10:00', status: 'in_progress', description: 'Max arrived. Replaced faulty limit switch and greased tracks.' },
      { id: 'tk-t10', date: '2026-05-20 12:00', status: 'resolved', description: 'Tested cycles, door operational. Ticket marked resolved.' }
    ],
    notes: [
      { id: 'note-3', author: 'Max Kowalski', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&q=80', note: 'Replaced roller hinges as well. Recommend annual lubrication checks.', date: '2026-05-20 11:55' }
    ]
  }
];

export const mockDocuments: Document[] = [
  { id: 'doc-101', name: 'LeaseAgreement_TechSynergy_Apex101.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '2.4 MB', uploadDate: '2023-12-01', fileUrl: '#', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc', propertyId: 'prop-1', propertyName: 'Apex Plaza' },
  { id: 'doc-102', name: 'Incorporation_KYC_TechSynergy.pdf', category: 'kyc_document', fileType: 'pdf', fileSize: '4.8 MB', uploadDate: '2023-11-20', fileUrl: '#', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc' },
  { id: 'doc-103', name: 'LeaseAgreement_AcmeLogistics_Apex102.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '1.9 MB', uploadDate: '2023-05-20', fileUrl: '#', tenantId: 'tenant-2', tenantName: 'Acme Logistics', propertyId: 'prop-1', propertyName: 'Apex Plaza' },
  { id: 'doc-104', name: 'LeaseAgreement_NovaFinTech_Apex201.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '3.1 MB', uploadDate: '2024-02-22', fileUrl: '#', tenantId: 'tenant-3', tenantName: 'Nova FinTech', propertyId: 'prop-1', propertyName: 'Apex Plaza' },
  
  { id: 'doc-201', name: 'LeaseAgreement_SarahJenkins_Green10A.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '1.2 MB', uploadDate: '2025-04-18', fileUrl: '#', tenantId: 'tenant-11', tenantName: 'Sarah Jenkins', propertyId: 'prop-2', propertyName: 'Greenwood Residences' },
  { id: 'doc-202', name: 'LeaseAgreement_MarcusAurelius_Green10B.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '1.4 MB', uploadDate: '2024-08-20', fileUrl: '#', tenantId: 'tenant-12', tenantName: 'Marcus Aurelius', propertyId: 'prop-2', propertyName: 'Greenwood Residences' },
  { id: 'doc-203', name: 'LeaseAgreement_SelinaKyle_Windsor101.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '1.1 MB', uploadDate: '2025-05-22', fileUrl: '#', tenantId: 'tenant-19', tenantName: 'Selina Kyle', propertyId: 'prop-3', propertyName: 'Windsor Manor Apartments' },
  { id: 'doc-204', name: 'LeaseAgreement_TonyStark_Starlight501.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '5.2 MB', uploadDate: '2024-12-18', fileUrl: '#', tenantId: 'tenant-23', tenantName: 'Tony Stark', propertyId: 'prop-4', propertyName: 'Starlight Luxury Towers' },
  
  { id: 'doc-301', name: 'LeaseAgreement_SpeedyDelivery_WarehouseA.pdf', category: 'lease_agreement', fileType: 'pdf', fileSize: '4.5 MB', uploadDate: '2023-10-02', fileUrl: '#', tenantId: 'tenant-30', tenantName: 'Speedy Delivery Services', propertyId: 'prop-5', propertyName: 'Metropolitan Logistics Center' },
  
  { id: 'doc-401', name: 'ApexPlaza_BuildingBlueprint_2020.pdf', category: 'property_document', fileType: 'pdf', fileSize: '18.2 MB', uploadDate: '2020-05-12', fileUrl: '#', propertyId: 'prop-1', propertyName: 'Apex Plaza' },
  { id: 'doc-402', name: 'ApexPlaza_SafetyInspection_2025.pdf', category: 'property_document', fileType: 'pdf', fileSize: '3.6 MB', uploadDate: '2025-08-11', fileUrl: '#', propertyId: 'prop-1', propertyName: 'Apex Plaza' },
  { id: 'doc-403', name: 'Greenwood_FireDrillLog_2025.xlsx', category: 'property_document', fileType: 'xlsx', fileSize: '520 KB', uploadDate: '2025-12-15', fileUrl: '#', propertyId: 'prop-2', propertyName: 'Greenwood Residences' },
  
  { id: 'doc-501', name: 'Receipt_Inv1001_TechSynergy.pdf', category: 'payment_receipt', fileType: 'pdf', fileSize: '120 KB', uploadDate: '2026-04-28', fileUrl: '#', tenantId: 'tenant-1', tenantName: 'TechSynergy Inc' },
  { id: 'doc-502', name: 'Receipt_Inv1006_NovaFinTech.pdf', category: 'payment_receipt', fileType: 'pdf', fileSize: '124 KB', uploadDate: '2026-04-30', fileUrl: '#', tenantId: 'tenant-3', tenantName: 'Nova FinTech' },
  { id: 'doc-503', name: 'Receipt_Inv1010_MarcusAurelius.pdf', category: 'payment_receipt', fileType: 'pdf', fileSize: '115 KB', uploadDate: '2026-04-29', fileUrl: '#', tenantId: 'tenant-12', tenantName: 'Marcus Aurelius' }
];

export const mockNotifications: Notification[] = [
  { id: 'nt-1', title: 'Lease expiring soon', message: 'Lease lease-102 for Acme Logistics at Apex Plaza (102) expires on 2026-05-31.', date: '2026-05-24', read: false, type: 'lease_expiry', severity: 'warning', link: '/leases/lease-102' },
  { id: 'nt-2', title: 'Payment Overdue', message: 'Acme Logistics is overdue by $8,200 for April rent on Apex Plaza 102.', date: '2026-05-15', read: false, type: 'payment_overdue', severity: 'error', link: '/payments' },
  { id: 'nt-3', title: 'New Maintenance Request', message: 'Tony Stark created a ticket for HVAC issue at Starlight Towers.', date: '2026-05-27', read: false, type: 'maintenance_update', severity: 'info', link: '/maintenance' },
  { id: 'nt-4', title: 'KYC Verification Pending', message: 'Elena Rostova uploaded identity documents. Verification required.', date: '2026-05-25', read: true, type: 'document_expiry', severity: 'warning', link: '/tenants/tenant-15' },
  { id: 'nt-5', title: 'Payment Overdue', message: 'Acme Logistics is overdue by $8,200 for May rent on Apex Plaza 102.', date: '2026-05-20', read: false, type: 'payment_overdue', severity: 'error', link: '/payments' }
];

export const mockAnalyticsData = {
  monthlyRevenue: [
    { name: 'Jan', actual: 85000, target: 90000, collections: 82000 },
    { name: 'Feb', actual: 95000, target: 95000, collections: 95000 },
    { name: 'Mar', actual: 110000, target: 105000, collections: 108000 },
    { name: 'Apr', actual: 115000, target: 110000, collections: 106800 },
    { name: 'May', actual: 122100, target: 125000, collections: 105700 }, // some overdue this month (Acme)
  ],
  occupancyTrends: [
    { name: 'Jan', rate: 75.0 },
    { name: 'Feb', rate: 75.0 },
    { name: 'Mar', rate: 78.5 },
    { name: 'Apr', rate: 81.0 },
    { name: 'May', rate: 83.3 }, // Apex Placa + Greenwood + Windsor occupancy rate weighted average
  ],
  propertyPerformance: [
    { name: 'Apex Plaza', revenue: 154200, occupancy: 83.3, maintenance: 2 },
    { name: 'Greenwood Residences', revenue: 22450, occupancy: 80.0, maintenance: 1 },
    { name: 'Windsor Manor', revenue: 5700, occupancy: 66.6, maintenance: 1 },
    { name: 'Starlight Towers', revenue: 53100, occupancy: 87.5, maintenance: 0 },
    { name: 'Metropolitan Logistics', revenue: 44500, occupancy: 75.0, maintenance: 0 }
  ],
  maintenanceCategoryDistribution: [
    { name: 'HVAC', value: 3 },
    { name: 'Plumbing', value: 2 },
    { name: 'Electrical', value: 2 },
    { name: 'Structural', value: 1 },
    { name: 'Appliance', value: 1 },
    { name: 'Other', value: 0 }
  ]
};
