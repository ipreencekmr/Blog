import axios from 'axios';

export default ({ req }) => {
    if (typeof window === 'undefined') {
        //we are on the server
        // replace this base url if project is deployed on production
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        //we must be on the browser
        return axios.create({
            baseURL: '/'
        });
    }
};