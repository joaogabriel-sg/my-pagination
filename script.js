// getHtml is a function that returns the selected element
function getHtml(element) {
  return document.querySelector(element);
}

// Get datas from API
// In this case, I'm using a fake API
const datas = Array.from({ length: 100 })
  .map((_, index) => `Item ${index + 1}`);

// Define application states like actual page, total pages...
let perPage = 5;
const states = {
  page: 1,
  perPage,
  totalPages: Math.ceil(datas.length / perPage),
  maxVisibleButtons: 5,
}

// Corresponding to the list of items
const list = {
  element: getHtml('.list'),
  // Create a new item for the list
  create(item) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.innerHTML = item;

    list.element.appendChild(div);
  },
  // Update the list
  update() {
    list.element.innerHTML = '';

    const start = (states.page - 1) * states.perPage;
    const end = start + states.perPage;

    const items = datas.slice(start, end);

    items.forEach(list.create);
  }
}

// Corresponding to the application controls
// How to go to the previous page, next page, or go to a specifically page
const controls = {
  // Pŕevious button
  prev() {
    states.page--;
    if (states.page < 1) {
      states.page = 1;
    }
  },
  // Next button
  next() {
    states.page++;
    if (states.page > states.totalPages) {
      states.page = states.totalPages;
    }
  },
  // Go to the corresponding page
  goTo(page) {
    states.page = page;
  },
}

// Corresponding to the numbers that identify the application pages
const buttons = {
  element: getHtml('.numbers'),
  // Create buttons/numbers on the screen
  create(number) {
    const div = document.createElement('div');
    div.innerHTML = number;

    if (number === states.page) {
      div.classList.add('active');
    }

    // Add event click to buttons/numbers
    // When I click, I go to the corresponding page and update the list
    div.addEventListener('click', (e) => {
      controls.goTo(Number(e.target.innerHTML));
      update();
    })

    buttons.element.append(div);
  },
  // Update buttons/numbers on the screen
  update() {
    buttons.element.innerHTML = '';

    // Define two numbers before(left) and after(right) the active page
    let leftVisible = states.page - Math.floor(states.maxVisibleButtons / 2);
    let rightVisible = states.page + Math.floor(states.maxVisibleButtons / 2);

    if (leftVisible < 1) {
      leftVisible = 1;
      rightVisible = states.maxVisibleButtons;
    }

    if (rightVisible > states.totalPages) {
      rightVisible = states.totalPages;
      leftVisible = states.totalPages - states.maxVisibleButtons + 1;
    }

    for (let page = leftVisible; page <= rightVisible; page++) {
      buttons.create(page);
    }
  },
  // Add events for each button on the screen
  addEvents() {
    getHtml('.first').addEventListener('click', () => {
      controls.goTo(1);
      update();
    });

    getHtml('.last').addEventListener('click', () => {
      controls.goTo(states.totalPages);
      update();
    });

    getHtml('.prev').addEventListener('click', () => {
      controls.prev();
      update();
    });

    getHtml('.next').addEventListener('click', () => {
      controls.next();
      update();
    });
  }
}

// Update the list and buttons/numbers
function update() {
  list.update();
  buttons.update();
}

// Launch the application with the update function and add events to the buttons
function init() {
  update();
  buttons.addEvents();
}

// Launching the application
init()
