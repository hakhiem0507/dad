// URL API cơ bản
const baseUrl = 'https://hakhiem.cf/dad/dadcal.php';

// Lấy tuần hiện tại
function getCurrentWeek() {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Lấy năm hiện tại
function getCurrentYear() {
    return new Date().getFullYear();
}

// Tạo danh sách tùy chọn tuần (1-53)
function populateWeekOptions() {
    const weekSelect = document.getElementById('week-select');
    for (let i = 1; i <= 53; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = `${i}`; //Tuần text
        weekSelect.appendChild(option);
    }
}

// Tạo danh sách tùy chọn năm (2007-2030)
function populateYearOptions() {
    const yearSelect = document.getElementById('year-select');
    for (let i = 2007; i <= 2030; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        yearSelect.appendChild(option);
    }
}

// Đặt giá trị tuần và năm mặc định (tuần hiện tại và năm hiện tại)
function setDefaultWeekAndYear() {
    const currentWeek = getCurrentWeek();
    const currentYear = getCurrentYear();

    document.getElementById('week-select').value = currentWeek;
    document.getElementById('year-select').value = currentYear;
}

// Hàm định dạng thời gian theo chuẩn 24 giờ (mm:hh, dd/mm/yyyy)
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}, ${day}/${month}/${year}`;
}

// Hàm cập nhật thời gian lần fetch cuối cùng
function updateLastUpdated() {
    const lastUpdated = document.getElementById('last-updated');
    const now = new Date();
    lastUpdated.textContent = `Cập nhật lúc: ${formatDateTime(now)} ⟳`;
}

// Hàm hiển thị dữ liệu công việc theo tuần
function displaySchedule(data) {
    const weekTitle = document.getElementById('week-title');
    const weekDate = document.getElementById('week-date');
    const content = document.getElementById('content');
    const scheduleDiv = document.getElementById('schedule');

    // Xóa lịch cũ trước khi thêm lịch mới
    scheduleDiv.innerHTML = '';

    // Hiển thị thông tin chung của tuần
    weekTitle.textContent = `${data.anoun.week}`;
    weekDate.textContent = `${data.anoun.from}`;
    content.innerHTML = `${data.anoun.content}`;

    // Hiển thị công việc theo ngày
    data.ketqua.forEach(dayInfo => {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';

        // Tạo các phần tử HTML cho ngày và các công việc
        const dayTitle = document.createElement('h3');
        dayTitle.innerHTML = `<span class="day-icon">📅</span> ${dayInfo.day}`;

        const morningDiv = document.createElement('p');
        morningDiv.className = 'morning';
        morningDiv.innerHTML = `<span class="icon">☀️</span> ${dayInfo.morning || ''}`; //Buổi sáng: 

        const afternoonDiv = document.createElement('p');
        afternoonDiv.className = 'afternoon';
        afternoonDiv.innerHTML = `<span class="icon">🌙</span> ${dayInfo.afternoon || ''}`; //Buổi chiều: 

        // Thêm các phần tử vào thẻ div của ngày
        dayDiv.appendChild(dayTitle);
        dayDiv.appendChild(morningDiv);
        dayDiv.appendChild(afternoonDiv);

        // Thêm ngày vào thẻ cha
        scheduleDiv.appendChild(dayDiv);
    });
}

// Hàm fetch dữ liệu từ API
function fetchSchedule(week, year, maphong) {
    const url = `${baseUrl}?tuan=${week}&namlv=${year}&maphong=${maphong}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                displaySchedule(data);
                updateLastUpdated();  // Cập nhật thời gian fetch
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}
function setFetch(){
	//document.getElementById("fetch-button").disabled = true;
	//document.getElementById("fetch-button").textContent = "Loading...";
	const weekInput = document.getElementById('week-select').value;
    const yearInput = document.getElementById('year-select').value;
	const maphongInput = document.getElementById('maphong-select').value;
    fetchSchedule(weekInput, yearInput, maphongInput);
	//document.getElementById("fetch-button").disabled = false;
	//document.getElementById("fetch-button").textContent = "Lấy dữ liệu";
}

// Gọi hàm fetch khi nhấn nút "Lấy dữ liệu"
document.getElementById('fetch-button').addEventListener('click', function() { setFetch() });
document.getElementById('last-updated').addEventListener('click', function() { setFetch()});
// Gọi hàm fetch khi thay đổi dữ liệu Select option
document.getElementById('week-select').addEventListener('change', function() { setFetch()});
document.getElementById('year-select').addEventListener('change', function() { setFetch()});
document.getElementById('maphong-select').addEventListener('change', function() { setFetch()});
// Gọi hàm fetch dữ liệu mặc định khi tải trang
window.onload = function() {
    populateWeekOptions();  // Tạo danh sách tuần
    populateYearOptions();  // Tạo danh sách năm
    setDefaultWeekAndYear();  // Đặt tuần và năm mặc định
    fetchSchedule(getCurrentWeek(), getCurrentYear(),"coquan");
};

setInterval(setFetch, 60000); // Tự động fetch sau mỗi 1 phút (60,000 milliseconds)

