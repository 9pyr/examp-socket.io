import axios from 'axios'

export const socketApi = async (param) => {
  return await axios.post('/api/socket', param)
}
