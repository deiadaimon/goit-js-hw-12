import axios from 'axios';

export function fetchRequest(inputValue, currentPage) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = '43226276-a07a0c17e428cfffb021b9b05';

    const params = new URLSearchParams({
        key: API_KEY,
        q: inputValue,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 15,
        page: currentPage,
    });

    return axios.get(`${BASE_URL}?${params.toString()}`)
        .then(response => {
            if (!response.data) {
                throw new Error(response.status);
            }
            return response.data;
        })
        .catch(error => {
            throw new Error('Request failed with status:' + error.response.status);
        });
}