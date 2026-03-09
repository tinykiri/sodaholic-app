import { createMergeableStore } from 'tinybase';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';

export const TYPE_OF_DRINKS = [
  { label: 'Classic Soda', value: 'Classic Soda' },
  { label: 'Zero/Diet', value: 'Zero/Diet' },
  { label: 'Energy', value: 'Energy' },
  { label: 'Sparkling Water', value: 'Sparkling Water' },
  { label: 'Other', value: 'Other' },
];

export const CATEGORY_COLORS: Record<string, string> = {
  'Classic Soda': '#E74C3C',
  'Zero/Diet': '#A8A9AD',
  'Energy': '#00C853',
  'Sparkling Water': '#00CED1',
  'Other': '#F39C12',
};

export const CATEGORY_TITLES: Record<string, string[]> = {
  'Classic Soda': [
    'Sugar Baby', 'Cavity Commander', 'Insulin Insurgent', 'Fizz Fiend', 'Sugar Rush CEO',
    'Corn Syrup Connoisseur', "Dentist's Nightmare", 'Glucose Goblin', 'Sweet Tooth Tyrant',
    'Sugar Sipper Supreme', 'Carbonation Addict', 'Pop Royalty', 'Soda Soul',
    'Full Sugar Full Send', 'Liquid Candy Lover', 'Caramel Color Stan', 'The Original Sinner',
    'Sugar Stream', 'Fizzy Maximalist', 'Old School Bubbler', 'Classic & Chaotic',
    'Sweetness Overlord', 'Syrup Slurper', 'Pancreas Punisher', 'No Diet No Regrets',
    'Unapologetically Sweet', 'Sugar Bomber', 'Vintage Fizz Freak', 'Soda Purist',
    'The Real Deal Sipper', 'Can Crusher', 'Sugar Demon', 'The Unsweetened? Never.',
    'Peak Glucose Mode', 'Full Calorie Warrior', 'Soda Cult Leader',
    'Uncut Unfiltered Unhinged', 'Sweet & Shameless', 'Flavor Maximalist', 'Retro Refresher',
  ],
  'Zero/Diet': [
    'Chemical Connoisseur', 'Aspartame Aristocrat', 'Zero Sugar Zero Fun?',
    'Fake Sweet & Fabulous', 'Diet Delulu', 'The Calorie Dodger', 'Guilt-Free Guzzler',
    'Sweet Little Liar', 'Zero Sugar Zero Chill', 'Lab-Made Flavor Fan',
    'Artificial & Proud', 'Skinny Sip Royalty', 'The Compromise Queen', 'Technically Healthy',
    'Diet Cope Expert', 'Zero Everything Except Vibes', 'Phantom Sweetness Enjoyer',
    'Healthy-ish Icon', 'Plot Twist: Still Addicted', 'The Bargain Sipper',
    'Label Reader Supreme', '"It\'s Basically Water"', 'Clean-ish Consumer', 'Stevia Soldier',
    'Splenda Defender', 'Sucralose Supremacist', 'Zero Calorie Chaos',
    'Metabolic Confusion Agent', 'Health Halo Haver', 'Flavor Without Consequences',
    'The Great Pretender', 'Sugar Ghosting Pro', 'Nutritional Loophole Finder',
    'Diet Loyalist', 'Science Experiment Sipper', 'No Sugar All Sass',
    'Guilt Dodging Champion', 'Light & Unhinged', 'Zero & Proud', 'The Illusion of Health',
  ],
  'Energy': [
    'Energy Drink Boss', 'Caffeine Criminal', 'Heart Palpitation Hobbyist',
    'Sleep Is For The Weak', 'Liquid Lightning Addict', 'Taurine Terrorist',
    'Monster Mode Activated', 'Cardiac Chaos Agent', 'Jitter Juice Junkie',
    '3am Deadline Demon', 'Adrenaline Alchemist', 'Cracked Out Creator', 'Legally Wired',
    'Caffeine Blood Type', '200mg Personality', 'Turbo Mode Permanent',
    'Crash Landing Specialist', 'Battery Acid Enjoyer', "Can't Stop Won't Sleep",
    'Corporate Fuel Tank', 'Productivity Potion Drinker', 'Pre-Workout Personality',
    'Neon Green Blood', 'Main Character Energy (Literally)', 'Wired & Tired',
    'Stimulant Sommelier', 'Heart Rate: Concerning', 'Sleep Schedule? Deleted.',
    'Coded By Caffeine', 'Vibrating At All Times', 'Overcaffeinated & Underpaid',
    'Two Cans Deep By Noon', 'ER Visit Foreshadowing', 'Gas Station Gourmet',
    'Voltage Vampire', 'Chaos In A Can', 'Neurological Speedrun',
    'Shaky Hands Sharp Mind', 'The Human Espresso Shot', 'Built Different (Medically Concerning)',
  ],
  'Sparkling Water': [
    'Spicy Water Enthusiast', 'TV Static Drinker', 'Angry Water Lover',
    'Disciplined & Boring', 'Bubble Monk', 'La Croix Loyalist', 'Flavor? Barely.',
    'Hydration Elitist', 'Hint Of Hint Of Flavor', 'Reformed Soda Addict',
    'Sparkling Personality (Literally)', 'Fizz Without The Fun', 'Adult Water Drinker',
    'The Evolved One', 'Carbonated Minimalist', 'Pain Is The Flavor',
    'Bougie Bubble Sipper', 'Water+ Subscriber', "Soda's Sober Cousin",
    'Aesthetic Over Taste', 'Topo Chico Truther', 'Perrier Personality', 'Crispy Water Fan',
    'Still Water Is Boring', 'Acquired Taste Achieved', 'Wellness Era Unlocked',
    'Aggressively Hydrated', 'Dry January Every Month', 'Clear Liquid Supremacist',
    'The One Who Changed', 'Seltzer Soul', 'Mineral Water Militant',
    'Fizzy But Make It Sad', 'Sophisticated Sipper', 'Post-Soda Enlightenment',
    'Water With Anxiety', 'Grew Up & Got Bubbles', 'Sparkling Cope',
    'Clean Living Propaganda', 'Effervescent & Empty',
  ],
  'Other': [
    'Wildcard Sipper', 'Flavor Roulette Player', 'Unclassifiable Drinker',
    'Genre-Fluid Guzzler', 'Off-Menu Menace', 'Chaotic Beverage Neutral',
    'The Unpredictable One', 'Kombucha Curious', 'Drink Menu Anarchist', 'Category Breaker',
    'Beverage Nonconformist', "Whatever's Cold Drinker", 'Fridge Surprise Enjoyer',
    'NPC Drink Chooser', 'Mystery Flavor Main', 'Vending Machine Gambler',
    "Can't Be Labeled", 'Drink Identity Crisis', 'Liquid Wildcard', 'The Unboxable',
    'Flavor Frontier Explorer', 'Side Quest Sipper', 'Third Option Thinker',
    'Main Character Drink Energy', 'Convenience Store Adventurer', 'Random & Refreshed',
    'Niche Drink Nerd', 'Import Aisle Regular', 'The Outlier', 'Beverage Free Spirit',
    'Undefined & Unbothered', 'No Loyalty All Vibes', 'Eclectic Sip Collector',
    'Gas Station Sommelier', 'Limited Edition Hunter', 'Rare Flavor Chaser',
    'Try Everything Twice', 'Beverage Chaos Agent', 'The Experimental One',
    'Too Cool To Categorize',
  ],
};

export const ML_PER_OZ = 29.5735;

const store = createMergeableStore();

const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

store.setTablesSchema({
  drinks: {
    date_of_creation: { type: 'string', default: '' },
    name: { type: 'string' },
    category_of_drink: { type: 'string', default: TYPE_OF_DRINKS[0].value },
    volume_ml: { type: 'number', default: 500 },
  },
});

store.setValuesSchema({
  unit_preferences: { type: 'string', default: 'ml' },
  volume_ml: { type: 'number', default: 500 },
  category_of_drink: { type: 'string', default: TYPE_OF_DRINKS[0].value },
  wrap_seen_weekly: { type: 'string', default: '' },
  wrap_seen_monthly: { type: 'string', default: '' },
  wrap_seen_yearly: { type: 'string', default: '' },
});

if (WS_URL) {
  (async () => {
    try {
      const ws = new WebSocket(WS_URL);
      const synchronizer = await createWsSynchronizer(store, ws);
      await synchronizer.startSync();
      console.log('Syncing started successfully');
    } catch (error) {
      console.error('Failed to start syncing:', error);
    }
  })();
}

export default store;
