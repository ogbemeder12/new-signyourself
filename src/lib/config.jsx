
export const siteConfig = {
  enabledSections: {
    rewards: true,
    sweepstakes: true,
    waitingList: true,
    admin: true
  },
  pointsSystem: {
    signupBonus: 100,
    referralBonus: 150,
    socialShare: {
      facebook: 25,
      twitter: 25,
      instagram: 25
    },
    productReview: 50,
    dailyLogin: 10,
    purchasePoints: 0.1, // per dollar spent
    birthdayBonus: 250,
    monthlyEngagement: 100
  },
  adminConfig: {
    leadSegments: {
      hot: { minScore: 30, color: "red" },
      warm: { minScore: 15, color: "yellow" },
      cold: { maxScore: 15, color: "blue" }
    },
    analytics: {
      refreshInterval: 300000, // 5 minutes
      defaultDateRange: 30, // days
      metrics: ["conversion", "engagement", "activity"]
    }
  }
};

export const rewardTiers = [
  {
    level: "Bronze",
    points: 0,
    rewards: [
      { name: "Welcome Bonus", value: "100 points" },
      { name: "Birthday Reward", value: "Double points" },
      { name: "Newsletter Access", value: "Exclusive content" }
    ]
  },
  {
    level: "Silver",
    points: 500,
    rewards: [
      { name: "Early Access Sales", value: "24h early" },
      { name: "Free Shipping", value: "First order" },
      { name: "Special Discounts", value: "5% off" }
    ]
  },
  {
    level: "Gold",
    points: 1000,
    rewards: [
      { name: "Double Points Days", value: "Selected days" },
      { name: "Priority Support", value: "24/7 access" },
      { name: "Event Invitations", value: "VIP events" }
    ]
  },
  {
    level: "Platinum",
    points: 2500,
    rewards: [
      { name: "VIP Concierge", value: "Personal service" },
      { name: "Product Previews", value: "Early access" },
      { name: "Anniversary Bonus", value: "500 points" }
    ]
  },
  {
    level: "Diamond",
    points: 5000,
    rewards: [
      { name: "Personal Shopper", value: "Dedicated assistant" },
      { name: "Custom Products", value: "Special requests" },
      { name: "Lifetime VIP", value: "Premium status" }
    ]
  }
];

export const waitingListConfig = {
  referralBonus: {
    points: 150,
    discountValue: 15
  },
  socialBonus: {
    points: 25,
    discountValue: 5
  },
  earlyAccess: {
    maxPositions: 1000,
    perDayInvites: 50
  },
  notifications: {
    email: true,
    sms: true,
    push: false
  }
};
