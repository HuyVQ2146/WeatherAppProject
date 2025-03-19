const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "a031ba5edfe4c79a1dba6fefd4edf565"; // lấy từ trang openweathermap

weatherForm.addEventListener("submit", async event => { // biến cnay thành 1 async
    event.preventDefault();
    /*
    Với một form, mặc định khi bấm nút "Submit", 
        trang sẽ tải lại. Dùng preventDefault() để ngăn việc đó.
    Với một link (<a>), bấm vào sẽ chuyển trang. 
        Dùng preventDefault() để chặn việc chuyển trang.
    */

    const city = cityInput.value.trim();
    if(city){
        try{
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        }
        catch(error){
            console.error(error);
            displayError(error);
        }
    }
    else{
        displayError("Please enter a city.")
    }
});

async function getWeatherData(city){
    /*
    Hàm getWeatherData() cần là một async function vì nó có khả năng 
    thực hiện các tác vụ bất đồng bộ, chẳng hạn như gửi yêu cầu HTTP 
    đến một API thời tiết để lấy dữ liệu.
    */
   const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
   const response = await fetch(apiUrl);
   if (!response.ok){
       throw new Error("Could not fetch weather data.");
   }

   return await response.json();
   // dùng await đảm bảo rằng bạn đang trả về dữ liệu đã được phân tích cú pháp, 
   // chứ không phải một Promise đang chờ xử lý.
}

function displayWeatherInfo(data){
    /*
    Đang sử dụng Destructuring Assignment trong JavaScript để "bóc tách" 
    các giá trị từ đối tượng data (dữ liệu lấy từ API) một cách trực tiếp.
        -Tên thuộc tính trong destructuring phải khớp chính xác với 
            tên trong dữ liệu API.
        -Nếu API thay đổi cấu trúc hoặc có trường hợp trả về thiếu dữ liệu, 
            bạn cần thêm xử lý kiểm tra hoặc dùng giá trị mặc định.
    */
    const {
        name: city, 
        main: {temp, humidity}, 
        weather: [{description, id}]} = data;
                             // id này là id của thời tiết
 
    card.textContent = "";
    card.style.display = "flex";

    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    cityDisplay.textContent = city;
    cityDisplay.classList.add("cityDisplay");
    card.appendChild(cityDisplay);

    tempDisplay.textContent = `${(temp - 273.15).toFixed(1)}°C`;
                                // temp để mặc định thì là độ K
    tempDisplay.classList.add("tempDisplay");
    card.appendChild(tempDisplay);

    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    humidityDisplay.classList.add("humidityDisplay");
    card.appendChild(humidityDisplay);

    descDisplay.textContent = description;
    descDisplay.classList.add("descDisplay");
    card.appendChild(descDisplay);

    weatherEmoji.textContent = getWeatherEmoji(id);
    weatherEmoji.classList.add("weatherEmoji");
    card.appendChild(weatherEmoji);
}

function getWeatherEmoji(weatherId){
    switch(true){
        case (weatherId >= 200 && weatherId < 300):
            return "⛈️";
        case (weatherId >= 300 && weatherId < 400):
            return "🌦️";
        case (weatherId >= 500 && weatherId < 600):
            return "🌧️";
        case (weatherId >= 600 && weatherId < 700):
            return "❄️";
        case (weatherId >= 700 && weatherId < 800):
            return "🌫️";
        case(weatherId === 800):
            return "☀️";
        case (weatherId >= 800 && weatherId < 810):
            return "🌥️";
        default:
            return "❓";

    }
}

function displayError(message){
    const errDisplay = document.createElement("p");
    errDisplay.textContent = message;
    errDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errDisplay);
}
