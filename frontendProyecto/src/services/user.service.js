import httpClient from "../http-common"; 

const create = (user) => {
    return httpClient.post('/register/', user); 
};

const login = async (rut, password) => {
    try {
        const response = await httpClient.post('/register/login', null, {
            params: { rut, password },
        });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
};

export default { create, login };
