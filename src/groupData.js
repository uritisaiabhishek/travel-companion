const groupData = [
  {
    groupId: '1',
    groupName: 'Hiking Enthusiasts',
    users: ['user1', 'user2', 'user3'],
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp1',
        expenseName: 'Travel Gear',
        expenseDescription: 'Hiking boots, backpacks, and trekking poles',
        expenseCost: 200,
        expenseSpentBy: 'user1',
        peopleIncluded: ['user1', 'user2']
      },
      {
        expenseId: 'exp2',
        expenseName: 'Accommodation',
        expenseDescription: 'Mountain cabin rental for two nights',
        expenseCost: 300,
        expenseSpentBy: 'user2',
        peopleIncluded: ['user1', 'user3']
      }
    ]
  },
  {
    groupId: '2',
    groupName: 'Book Club',
    users: ['user4', 'user5', 'user6'],
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],expenses: [
      {
        expenseId: 'exp3',
        expenseName: 'Books Purchase',
        expenseDescription: 'Buying books for the next discussion',
        expenseCost: 100,
        expenseSpentBy: 'user5',
        peopleIncluded: ['user4', 'user5']
      },
      {
        expenseId: 'exp4',
        expenseName: 'Cafe Meetup',
        expenseDescription: 'Snacks and beverages at the book club meeting',
        expenseCost: 50,
        expenseSpentBy: 'user6',
        peopleIncluded: ['user5', 'user6']
      }
    ]
  },
  {
    groupId: '3',
    groupName: 'Photography Lovers',
    users: ['user7', 'user8', 'user9'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp5',
        expenseName: 'Camera Accessories',
        expenseDescription: 'Tripod, extra memory card, and lens filters',
        expenseCost: 150,
        expenseSpentBy: 'user7',
        peopleIncluded: ['user7', 'user8']
      },
      {
        expenseId: 'exp6',
        expenseName: 'Editing Software',
        expenseDescription: 'Subscription for Adobe Lightroom',
        expenseCost: 80,
        expenseSpentBy: 'user9',
        peopleIncluded: ['user8', 'user9']
      }
    ]
  },
  {
    groupId: '4',
    groupName: 'Yoga & Wellness',
    users: ['user10', 'user11', 'user12'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp7',
        expenseName: 'Yoga Mats',
        expenseDescription: 'Buying new yoga mats for the group',
        expenseCost: 60,
        expenseSpentBy: 'user11',
        peopleIncluded: ['user10', 'user12']
      },
      {
        expenseId: 'exp8',
        expenseName: 'Wellness Retreat',
        expenseDescription: 'Weekend retreat for yoga and meditation',
        expenseCost: 400,
        expenseSpentBy: 'user12',
        peopleIncluded: ['user11', 'user12']
      }
    ]
  },
  {
    groupId: '5',
    groupName: 'Travel Buddies',
    users: ['user13', 'user14', 'user15'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp9',
        expenseName: 'Flight Tickets',
        expenseDescription: 'Round-trip tickets to Paris',
        expenseCost: 600,
        expenseSpentBy: 'user13',
        peopleIncluded: ['user13', 'user14']
      },
      {
        expenseId: 'exp10',
        expenseName: 'Hotel Booking',
        expenseDescription: 'Accommodation in a 4-star hotel',
        expenseCost: 200,
        expenseSpentBy: 'user14',
        peopleIncluded: ['user14', 'user15']
      }
    ]
  },
  {
    groupId: '6',
    groupName: 'Music Jammers',
    users: ['user16', 'user17', 'user18'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp11',
        expenseName: 'Studio Rental',
        expenseDescription: 'Renting the studio for jamming sessions',
        expenseCost: 150,
        expenseSpentBy: 'user16',
        peopleIncluded: ['user16', 'user17']
      },
      {
        expenseId: 'exp12',
        expenseName: 'Music Instruments',
        expenseDescription: 'Buying a new guitar and drumsticks',
        expenseCost: 200,
        expenseSpentBy: 'user18',
        peopleIncluded: ['user17', 'user18']
      }
    ]
  },
  {
    groupId: '7',
    groupName: 'Coding Geeks',
    users: ['user19', 'user20', 'user21'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp13',
        expenseName: 'Online Courses',
        expenseDescription: 'Subscription for coding tutorials',
        expenseCost: 100,
        expenseSpentBy: 'user19',
        peopleIncluded: ['user19', 'user20']
      },
      {
        expenseId: 'exp14',
        expenseName: 'Hackathon Fee',
        expenseDescription: 'Registration fee for the hackathon event',
        expenseCost: 50,
        expenseSpentBy: 'user21',
        peopleIncluded: ['user20', 'user21']
      }
    ]
  },
  {
    groupId: '8',
    groupName: 'Art & Crafts',
    users: ['user22', 'user23', 'user24'],
    
    checkList: [
      { name: 'Mount Everest', checked: false },
      { name: 'Himalayas', checked: false },
      { name: 'Rocky Mountains', checked: false },
    ],
    expenses: [
      {
        expenseId: 'exp15',
        expenseName: 'Art Supplies',
        expenseDescription: 'Paints, brushes, and canvases',
        expenseCost: 80,
        expenseSpentBy: 'user22',
        peopleIncluded: ['user22', 'user23']
      },
      {
        expenseId: 'exp16',
        expenseName: 'Museum Tickets',
        expenseDescription: 'Tickets for the group to visit the art museum',
        expenseCost: 40,
        expenseSpentBy: 'user24',
        peopleIncluded: ['user23', 'user24']
      }
    ]
  }
];

export default groupData;
