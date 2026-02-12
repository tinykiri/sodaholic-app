import { createStore } from 'tinybase';


const store = createStore().setTables({
  pets: { fido: { species: 'dog' } },
  species: { dog: { price: 5 } },
});

const listenerId = store.addTablesListener(() =>
  console.log('Tables changed!'),
);

store.setCell('pets', 'fido', 'species', 'dog');

export default store;