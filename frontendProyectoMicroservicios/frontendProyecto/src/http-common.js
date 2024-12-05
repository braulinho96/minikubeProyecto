import axios from "axios";

const proyectoTingesoServer = import.meta.env.VITE_PROYECTO_TINGESO_SERVER;
const proyectoTingesoPort = import.meta.env.VITE_PROYECTO_TINGESO_PORT;

console.log(proyectoTingesoServer);  
console.log(proyectoTingesoPort);    

export default axios.create({
    baseURL: `http://${proyectoTingesoServer}:${proyectoTingesoPort}`,  
    headers: {
        'Content-Type': 'application/json'
    }
});
