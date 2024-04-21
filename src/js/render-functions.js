export function createGalleryMarkup(array) {
    return array
        .map(({
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) => `
    <li class="gallery-card">
        <a class="card-link" href="${largeImageURL}">
            <img class="image" src="${webformatURL}" alt="${tags}"></a>
        <ul class="card-description">
            <li><p class="name">Likes</p>
            <p class="value">${likes}</p></liss=>
            <li><p class="name">Views</p>
            <p class="value">${views}</p></li>
            <li><p class="name">Comments</p>
            <p class="value">${comments}</p></li>
            <li><p class="name">Downloads</p>
            <p class="value">${downloads}</p></li>
        </ul>
    </li>
    `)
        .join('');
}
