import night_club from "./night-club.booking"
import restaurant from "./restaurant.booking"

const booking = {
  namespaced: true,
  modules: {
    restaurant,
    night_club,
  },
}

export default booking
