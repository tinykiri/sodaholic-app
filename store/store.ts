import { createStore } from 'tinybase';


const store = createStore();

store.setTablesSchema({
  drinks: {
    name: { type: 'string' }
  },
})


export default store;