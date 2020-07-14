window.onload = function(e) {
    if (e.target.location.href !== e.srcElement.referrer) { e.target.location.href = e.srcElement.referrer };

    contentReplace('#preview');

    history.pushState({ page: 'start' }, null, "");
};

const btnAddNewFilm = document.querySelector('#add-new'),
    btnMovies = document.querySelector('.nav-link'),
    searchInput = document.querySelector('.form-control'),
    btnSearch = document.querySelector('.search'),
    content = document.querySelector('#content'),
    STORAGE_KEY = 'MOVIES',
    movieList = loadMovies();

let movieID = 1;

class Movie {
    constructor(title, originTitle, imgSRC, year, country, tagline, director, creators, IMDb, description, actors) {
        this.id = movieID++,
            this.countMinus = 0,
            this.countPlus = 0,
            this.title = title,
            this.originTitle = originTitle,
            this.imgSRC = imgSRC,
            this.year = year,
            this.country = country,
            this.tagline = tagline,
            this.director = director,
            this.creators = creators,
            this.IMDb = IMDb,
            this.description = description,
            this.actors = actors;
    }
};

const movies = [new Movie('Гори, гори ясно', 'Brightburn', 'https://st.kp.yandex.net/images/film_iphone/iphone360_1199596.jpg', '2019',
        'США', '«Imagine What He Could Become»', 'Дэвид Яровески', [{
                id: 1,
                role: 'сценарий',
                name: 'Брайан Ганн, Марк Ганн'
            },
            {
                id: 2,
                role: 'продюссер',
                name: 'Джеймс Ганн, Брайан Ганн, Марк Ганн'
            },
            {
                id: 3,
                role: 'оператор',
                name: 'Майкл Даллаторре',
            },
            {
                id: 4,
                role: 'композитор',
                name: 'Тим Уильямс'
            }
        ],
        '6.60 (6688)',
        'Что, если потерпевший крушение на Земле инопланетный ребенок со сверхспособностями вместо того, чтобы стать героем для человечества, окажется чем-то гораздо более зловещим?', [
            'Элизабет Бэнкс',
            'Дэвид Денман',
            'Джексон А. Данн',
            'Абрахам Клинкскейлз',
            'Кристиан Финлейсон',
            'Дженнифер Холлэнд',
            'Эмми Хантер',
            'Мэтт Джонс',
            'Мередит Хагнер',
            'Бекки Уолстром'
        ]),
    new Movie('Гори, гори', 'Brightburn', 'https://st.kp.yandex.net/images/film_iphone/iphone360_1199596.jpg', '2019',
        'США', '«Imagine What He Could Become»', 'Дэвид Яровески', [{
                id: 1,
                role: 'сценарий',
                name: 'Брайан Ганн'
            },
            {
                id: 2,
                role: 'продюссер',
                name: 'Джеймс Ганн'
            },
            {
                id: 3,
                role: 'оператор',
                name: 'Майкл Даллаторре',
            },
            {
                id: 4,
                role: 'композитор',
                name: 'Тим Уильямс'
            },
            {
                id: 5,
                role: 'композитор',
                name: 'Тим Уильямс'
            },
            {
                id: 6,
                role: 'композитор',
                name: 'Тим Уильямс'
            }
        ],
        '6.60 (6688)',
        'Что, если потерпевший крушение на Земле инопланетный ребенок со сверхспособностями вместо того, чтобы стать героем для человечества, окажется чем-то гораздо более зловещим?', [
            'Элизабет Бэнкс',
            'Дэвид Денман',
            'Джексон А. Данн',
            'Абрахам Клинкскейлз',
            'Кристиан Финлейсон',
            'Дженнифер Холлэнд',
            'Эмми Хантер',
            'Мэтт Джонс',
            'Мередит Хагнер',
            'Бекки Уолстром'
        ])
];

// enable this func before using, for save first movies in localStorage

// window.onload = function() {
//     saveMovies(movies);
// };

const contentReplace = function(selector, temp) {
    let template = document.querySelector(selector).innerHTML,
        compiled = _.template(template);
    $('#content').append(compiled({ data: temp }));
};

function saveMovies(movies) {
    const data = JSON.stringify(movies);
    localStorage.setItem(STORAGE_KEY, data)
};

function loadMovies() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return JSON.parse(data)
    } catch (e) {
        console.log(e);
        return null
    }
};

function addField(cb) {
    let btnAddField = document.querySelector('.btn-add-field'),
        extraField = document.querySelector('.extra-field'),
        fieldIndex = 1;

    btnAddField.addEventListener('click', () => {
        let newField = document.createElement('div');
        newField.classList.add('form-group', 'row', 'extra-field', 'new-field');
        newField.setAttribute('id', `field${fieldIndex++}`);
        newField.innerHTML = extraField.innerHTML;

        let inputs = newField.querySelectorAll('input');
        inputs.forEach(el => el.value = '')
        document.querySelector('fieldset.form-group').append(newField);
        cb()
    });
};

function deleteField() {
    let btnRemoveField = document.querySelectorAll('.btn-remove-field');
    btnRemoveField.forEach(el => {
        el.addEventListener('click', () => {
            if (el.parentNode.parentNode.classList.contains('new-field')) el.parentNode.parentNode.remove()
        });
    });
};

function drawList(list) {
    content.innerHTML = '';
    list.forEach(el => contentReplace('#card', el));
    let btnMore = document.querySelectorAll('.more'),
        btnEdit = document.querySelectorAll('.btn-edit'),
        btnDelete = document.querySelectorAll('.btn-delete');

    btnMore.forEach(el => el.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();

        let movie = list.find(item => item.id == event.target.attributes.id.value);
        history.pushState({ page: movie.id }, null, `#list-${movie.id}`);

        content.innerHTML = '';

        contentReplace('#movie-list', movie);

        let btnPlusRating = document.querySelector('.btn-plus'),
            btnMinusRating = document.querySelector('.btn-minus');

        btnPlusRating.addEventListener('click', () => toRate(movie), true);
        btnMinusRating.addEventListener('click', () => toRate(movie), true);
    }, true));

    btnEdit.forEach(el => el.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();

        let movieOrigin = list.find(item => item.id == event.currentTarget.attributes.id.value);
        contentReplace('#modal', movieOrigin);

        $('#myModal').modal('show');
        $('#myModal').on('hidden.bs.modal', function(e) {
            $(this).remove()
        });

        deleteField();
        addField(deleteField);

        let btnAddMovie = document.querySelector('.btn-add-movie'),
            movieIndex = movieList.findIndex(item => item == movieOrigin);

        btnAddMovie.addEventListener('click', () => {
            event.preventDefault();

            let inputs = document.querySelectorAll('input'),
                texts = document.querySelectorAll('textarea'),
                actors = document.querySelector('#actors'),
                extraFields = document.querySelectorAll('.extra-field'),
                actorsArr = actors.value.split(','),
                creatorsArr = [],
                movie = {};

            inputs.forEach(el => {
                let item = el.attributes.value;
                if (!el.parentNode.parentNode.classList.contains('extra-field') && item) movie[el.id] = el.value || item.value
            });

            extraFields.forEach(el => {
                let pos = el.querySelector('#extraPosition'),
                    name = el.querySelector('#extraName'),
                    obj = {};

                obj.id = +el.id || el.id;
                obj.role = pos.value;
                obj.name = name.value;

                creatorsArr.push(obj)
                movie.creators = creatorsArr;
            });

            texts.forEach(el => {
                if (el.id !== 'actors') movie[el.id] = el.value;
            });

            movie.actors = actorsArr;

            Object.assign(movieOrigin, movie)
            movieList.splice(movieIndex, 1, movieOrigin);
            $('#myModal').modal('hide');
            saveMovies(movieList);
            drawList(movieList);
        })

    }));

    btnDelete.forEach(el => el.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();

        let movie = movieList.find(item => item.id == event.currentTarget.attributes.id.value),
            movieIndex = movieList.indexOf(movie, 0),
            confirmToDelete = confirm(`Удалить "${movie.title}"?`);

        if (confirmToDelete) {
            movieList.splice(movieIndex, 1);
            saveMovies(movieList);
        };

        drawList(movieList)
    }, true));

};

function createNewMovie() {
    event.preventDefault();

    let inputs = document.querySelectorAll('input'),
        texts = document.querySelectorAll('textarea'),
        actors = document.querySelector('#actors'),
        extraFields = document.querySelectorAll('.extra-field'),
        actorsArr = actors.value.split(','),
        creatorsArr = [],
        movie = {};

    inputs.forEach(el => {
        if (!el.parentNode.parentNode.classList.contains('extra-field')) movie[el.id] = el.value
    });

    extraFields.forEach(el => {
        let pos = el.querySelector('#extraPosition'),
            name = el.querySelector('#extraName'),
            obj = {};

        obj.id = el.id;
        obj.role = pos.value;
        obj.name = name.value;

        creatorsArr.push(obj)
        movie.creators = creatorsArr;
    })

    texts.forEach(el => {
        if (el.id !== 'actors') movie[el.id] = el.value;
    });

    movie.actors = actorsArr;

    let newMovie = new Movie(...movie.title, movie.originTitle, movie.imgSRC,
        movie.year, movie.country, movie.tagline, movie.director, movie.creators,
        movie.IMDb, movie.description, movie.actors);

    movieList.push(newMovie);

    $('#myModal').modal('hide');
    content.innerHTML = '';
    saveMovies(movieList);
    drawList(movieList);
};

function toRate(movie) {
    event.stopPropagation();
    event.preventDefault();

    movieList.map(el => {
        if (el.id === movie.id) {
            if (event.currentTarget.classList.contains("btn-plus")) {
                let i = +event.currentTarget.dataset.count;
                el.countPlus = event.currentTarget.dataset.count = i + 1;
            } else {
                let i = +event.currentTarget.dataset.count;
                el.countMinus = event.currentTarget.dataset.count = i + 1;
            }
        }
    })
    saveMovies(movieList);
};

btnMovies.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    history.pushState({ page: 'list' }, null, '#list');

    content.innerHTML = '';
    drawList(movieList)
});

btnSearch.addEventListener('click', () => {
    event.stopPropagation();
    event.preventDefault();

    searchInput.focus()
});

searchInput.addEventListener('input', event => {
    content.innerHTML = '';

    let inputValue = event.target.value,
        searchTrue = [];

    for (let movie of movieList) {
        if (inputValue !== '' && movie.title.includes(inputValue)) {
            searchTrue.push(movie);
            drawList(searchTrue);
        } else if (inputValue === '') {
            drawList(movieList)
        }
    };
});

btnAddNewFilm.addEventListener('click', () => {
    contentReplace('#modal', null);
    $('#myModal').modal('show');

    $('#myModal').on('hidden.bs.modal', function(e) {
        $(this).remove()
    });

    addField(deleteField);

    let btnAddMovie = document.querySelector('.btn-add-movie');
    btnAddMovie.addEventListener('click', createNewMovie)
});

window.addEventListener('popstate', e => {
    if (e.state.page === 'start') {
        history.pushState({ page: 'start' }, null, "");
    };

    if (e.state.page === 'list') { drawList(movieList) };

    if (e.state.page === 'start') {
        content.innerHTML = '';
        contentReplace('#preview');
    };

    if (typeof(e.state.page) === 'number') {
        content.innerHTML = '';

        let movie = movieList.find(item => +item.id == e.state.page);
        contentReplace('#movie-list', movie);
    };

});