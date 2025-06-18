import permission from "./permission"
import role from "./role"

const setting = {
  namespaced: true,
  modules: {
    role,
    permission,
  },
}

export default setting
