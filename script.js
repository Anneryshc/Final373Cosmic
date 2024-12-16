document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('newsGrid');
    const articleModal = document.getElementById('articleModal');
    const closeModal = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    // Determine the category based on the current page
    const pageCategory = document.body.dataset.category;

    // Function to fetch articles from Drupal API and display them in the news section
    function fetchArticlesByCategory(category = '') {
        let url = 'https://api.cosmic-connect.org/jsonapi/node/article?include=field_image';

        // Add category filter if provided
        if (category) {
            url += `&filter[field_category.name]=${category}`;
        }

        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            credentials: 'include' // Include cookies if required
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayArticles(data);
        })
        .catch(error => {
            console.error('Error fetching articles:', error);
            alert('Error fetching articles. Please try again later.');
        });
    }

    // Function to display articles in the news grid
    function displayArticles(data) {
        newsGrid.innerHTML = ''; // Clear existing content

        data.data.forEach(item => {
            // Default placeholder image
            let imageUrl = 'https://via.placeholder.com/400x250';

            // Check if field_image exists in relationships
            if (item.relationships?.field_image?.data) {
                const imageId = item.relationships.field_image.data.id;
                const image = data.included?.find(inc => inc.id === imageId);
                if (image && image.attributes?.uri?.url) {
                    imageUrl = `https://api.cosmic-connect.org${image.attributes.uri.url}`;
                }
            }

            // Create article card
            const articleCard = document.createElement('article');
            articleCard.classList.add('news-card');
            articleCard.innerHTML = `
                <img src="${imageUrl}" alt="${item.attributes.title}">
                <div class="news-content">
                    <h3>${item.attributes.title}</h3>
                    <p>${item.attributes.body?.summary || 'No summary available.'}</p>
                    <a href="article.html?id=${item.id}&imageUrl=${encodeURIComponent(imageUrl)}" class="read-more">Read More</a>
                </div>
            `;
            newsGrid.appendChild(articleCard);
        });
    }

    // Close modal event listener
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            articleModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === articleModal) {
                articleModal.style.display = 'none';
            }
        });
    }

    // Fetch articles only if the current page has a newsGrid element
    if (newsGrid) {
        fetchArticlesByCategory(pageCategory);
    }
});
