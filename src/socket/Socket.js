import {io} from "socket.io-client"

const common_socket = io(process.env.REACT_APP_SERVER_URL)

export default common_socket