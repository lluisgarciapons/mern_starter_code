import { useState, useEffect } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

function UserAPI(token) {
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    // const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const response = await axios.get('api/auth/myUser', {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    setIsLogged(true);
                    setAuthToken(token);
                    setUser(response.data.user);
                    // res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
                } catch (err) {
                    // TODO gestionar quan dona error
                    alert(err.response.data.message);
                }
            };
            getUser();
        }
        setLoading(false);
    }, [token]);

    return {
        loading: [loading, setLoading],
        isLogged: [isLogged, setIsLogged],
        user: [user, setUser]
        // isAdmin: [isAdmin, setIsAdmin],
    };
}

export default UserAPI;