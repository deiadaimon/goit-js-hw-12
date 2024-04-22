import axios from 'axios';

export async function fetchRequest(inputValue, currentPage) {
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

    try {
        const response = await axios.get(`${BASE_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw new Error('Request failed with status:' + error.response.status);
    };
}