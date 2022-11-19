const input = document.querySelector('#search-form input')
const imgsContainer = document.querySelector('ul')
// parametr do wyszukiwania obrazów po słowie kluczowym
let query = ''
// numer strony
let page = 1
// ostatnia grafika potrzebna do obserwatora
let lastImg = ''

// wywołanie wyszukiwania grafik po zdarzeniu input
input.addEventListener('input', (e) => {
    imgsContainer.innerHTML = ''
    page = 1
    query = e.target.value
    if (query) {
        getPageWithPhotos(query)
    }
})

// funkcja pobierająca zwrotkę z API Pixabay
async function getPageWithPhotos(query) {
    const response = await fetch(
        `https://pixabay.com/api/?key=${config.API_KEY}&q=${query}&image_type=photo&page=${page}`, { method: 'GET' }
    );
    const data = await response.json();
    // jeśli zwrócona tablica nie jest pusta wyświetlamy zdjęcia oraz obserwujemy ostatni element do niekończącego się scrolla
    if (data.hits.length) {
        showPhotos(data)
        observeLastImg()
    }
}

// generowanie grafik na stronie
const showPhotos = ({ hits }) => {
    for (let hit of hits) {
        const { webformatURL, largeImageURL, tags } = hit
        const li = document.createElement('li')
        const a = document.createElement('a')
        const img = document.createElement('img')
        a.setAttribute('href', largeImageURL)
        img.setAttribute('src', webformatURL)
        img.setAttribute('data-source', largeImageURL)
        img.setAttribute('alt', tags)
        // dodanie nasłuchiwania na kliknięcie w celu wyświetlenia modala
        addModalEvent(img)
        a.append(img)
        li.append(a)
        imgsContainer.append(li)
    }
}

// obserwator na ostatni element
const observeLastImg = () => {
    lastImg = document.querySelector('li:last-child')
    const lastImgObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            page += 1
            getPageWithPhotos(query)
            lastImgObserver.unobserve(lastImg)
        }
    })
    lastImgObserver.observe(lastImg)
}

// dodanie nasłuchiwania na klik
const addModalEvent = (img) => {
    img.addEventListener('click', (e) => {
        e.preventDefault()
        openModal(img.getAttribute('data-source'))
    })
}

// wyświetlenie modala
const openModal = (src) => {
    const instance = basicLightbox.create(`
        <img src="${src} height="600px" width="800px">
    `)
    instance.show()
}
