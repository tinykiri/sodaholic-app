import { createMergeableStore } from 'tinybase';
import { createWsSynchronizer } from 'tinybase/synchronizers/synchronizer-ws-client';

export const TYPE_OF_DRINKS = [
  { label: 'Classic Soda', value: 'Classic Soda' },
  { label: 'Zero/Diet', value: 'Zero/Diet' },
  { label: 'Energy', value: 'Energy' },
  { label: 'Sparkling Water', value: 'Sparkling Water' },
  { label: 'Coffee/Tea', value: 'Coffee/Tea' },
  { label: 'Other', value: 'Other' },
];

export const UNITS = {
  ML: 'ml',
  OZ: 'oz',
};

const store = createMergeableStore();

const WS_URL = process.env.EXPO_PUBLIC_WS_URL as string;

store.setTablesSchema({
  drinks: {
    date_of_creation: { type: 'string', default: new Date().toISOString() },
    name: { type: 'string' },
    category_of_drink: { type: 'string', default: TYPE_OF_DRINKS[0].value },
    volume_ml: { type: 'number', default: 500 },
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
  name: { type: 'string' },
  volume_ml: { type: 'number', default: 500 },
  category_of_drink: { type: 'string', default: TYPE_OF_DRINKS[0].value },
});

async function startSyncing() {
  try {
    const ws = new WebSocket(WS_URL);
    const synchronizer = await createWsSynchronizer(store, ws);

    await synchronizer.startSync();
    console.log('Syncing started successfully');
  } catch (error) {
    console.error('Failed to start syncing:', error);
  }
}

startSyncing();


export default store;