import guest from "./guest.database"

const database = {
  namespaced: true,
  modules: {
    guest,
  },
}

export default database
