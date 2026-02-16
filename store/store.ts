import { createStore } from 'tinybase';

const TYPE_OF_DRINKS = [
  'Classic Soda',
  'Zero/Diet',
  'Energy',
  'Sparkling Water',
  'Coffee/Tea',
  'Other'
];

export const UNITS = {
  ML: 'ml',
  OZ: 'oz',
};

const store = createStore();

store.setTablesSchema({
  drinks: {
    date_of_creation: { type: 'string' },
    name: { type: 'string' },
    category_of_drink: { type: 'string' },
    volume_ml: { type: 'number' },
  },
  wraps: {
    period_id: { type: 'string' },
    type: { type: 'string' },         // weekly, monthly, yearly
    total_volume: { type: 'number' },
    top_category: { type: 'string' },
  }
});

store.setValuesSchema({
  unit_preferences: { type: 'string', default: 'ml' },
});



export default store;