document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        document.getElementById('articleBody').innerHTML = '<p>Article not found.</p>';
        return;
    }

    fetch(`https://api.cosmic-connect.org/jsonapi/node/article/${articleId}?include=field_image`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors',
        credentials: 'include'
    })
    
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        displayArticle(data);
    })
    .catch(error => {
        console.error('Error fetching article:', error);
        document.getElementById('articleBody').innerHTML = '<p>Error loading article. Please try again later.</p>';
    });
});

function displayArticle(data) {
    const articleTitle = document.getElementById('articleTitle');
    const articleBody = document.getElementById('articleBody');
    const articleImage = document.getElementById('articleImage');

    // Set article title and body
    articleTitle.textContent = data.data.attributes.title;
    articleBody.innerHTML = data.data.attributes.body?.value || 'No content available.';

    // Check if the article has an image in the relationships
    if (data.data.relationships?.field_image?.data) {
        const imageId = data.data.relationships.field_image.data.id;
        const image = data.included?.find(inc => inc.id === imageId);

        if (image && image.attributes?.uri?.url) {
            const imageUrl = `https://api.cosmic-connect.org${image.attributes.uri.url}`;
            articleImage.src = imageUrl;
            articleImage.style.display = 'block'; // Show the image once it is set
        }
    }
}

