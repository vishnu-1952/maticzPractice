document.getElementById('signupForm')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(username)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Validate password
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    if (!passwordPattern.test(password)) {
        alert(
            'Password must be 8-20 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
        );
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Store user credentials in local storage
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    alert('Signup successful! Please log in.');
    window.location.href = 'index.html';
});

$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const username = $('#Username').val();
        const password = $('#Password').val();

        console.log(username, password);

        if (
            localStorage.getItem('username') === username &&
            localStorage.getItem('password') === password
        ) {
            alert('Login successful!');
            window.location.href = 'home.html';
        } else {
            alert('Invalid credentials. Please try again.');
        }
    });
});

// Load the common navbar
$(document).ready(function () {
    $('#navbar').load('navbar.html');
    $('#navbar').load('navbar.html', function () {
        highlightActiveLink();
    });

    // Logout functionality
    $(document).on('click', '#logout', function (e) {
        e.preventDefault();
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        window.location.href = 'index.html'; // Redirect to login page
    });
});

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop(); // Extract filename
    $('.navbar-nav .nav-link').each(function () {
        if ($(this).attr('href') === currentPath) {
            $(this).closest('.nav-item').addClass('active');
        }
    });
}

const loadCourses = () => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    renderCourses(courses);
};

const renderCourses = (courses) => {
    const courseCards = document.getElementById('courseCards');
    courseCards.innerHTML = '';

    courses.forEach((course, index) => {
        courseCards.innerHTML += `
        <div class="col">
          <div class="card h-100">
            <img src="${course.image}" class="card-img-top" alt="${course.title}" />
            <div class="card-body">
              <h5 class="card-title">${course.title}</h5>
              <p class="card-text">${course.description}</p>
              <p class="card-text"><strong>Price:</strong> $${course.price}</p>
              <button class="btn btn-warning btn-sm me-2" onclick="editCourse(${index})">Edit</button>
              <button class="btn btn-danger btn-sm" onclick="deleteCourse(${index})">Delete</button>
            </div>
          </div>
        </div>`;
    });
};

document.getElementById('addCourseForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('courseTitle').value;
    const image = document.getElementById('courseImage').value;
    const price = document.getElementById('coursePrice').value;
    const description = document.getElementById('courseDescription').value;

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.push({ title, image, price, description });
    localStorage.setItem('courses', JSON.stringify(courses));

    renderCourses(courses);
    e.target.reset();
});

const deleteCourse = (index) => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses.splice(index, 1);
    localStorage.setItem('courses', JSON.stringify(courses));
    renderCourses(courses);
};

const editCourse = (index) => {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    const course = courses[index];

    document.getElementById('updateCourseId').value = index;
    document.getElementById('updateTitle').value = course.title;
    document.getElementById('updateImage').value = course.image;
    document.getElementById('updatePrice').value = course.price;
    document.getElementById('updateDescription').value = course.description;

    const updateModal = new bootstrap.Modal(
        document.getElementById('updateModal')
    );
    updateModal.show();
};

document.getElementById('updateCourseForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const index = document.getElementById('updateCourseId').value;
    const title = document.getElementById('updateTitle').value;
    const image = document.getElementById('updateImage').value;
    const price = document.getElementById('updatePrice').value;
    const description = document.getElementById('updateDescription').value;

    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    courses[index] = { title, image, price, description };
    localStorage.setItem('courses', JSON.stringify(courses));

    renderCourses(courses);

    const updateModal = bootstrap.Modal.getInstance(
        document.getElementById('updateModal')
    );
    updateModal.hide();
});

document.addEventListener('DOMContentLoaded', () => {
    loadCourses();
});
