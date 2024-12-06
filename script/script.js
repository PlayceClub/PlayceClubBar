document.addEventListener("DOMContentLoaded", () => {
    // Основные элементы
    const cartModal = document.getElementById("cart-modal");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalDisplay = document.getElementById("cart-total");
    const submitOrderButton = document.getElementById("submit-order");
    const proceedToOrderButton = document.getElementById("proceed-to-order");
    const closeCart = document.getElementById("close-cart");

    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const quantityDisplay = document.getElementById("quantity");
    const addToCartButton = document.getElementById("add-to-cart");

    let cart = {};
    let currentQuantity = 1;
    let itemPrice = 0;

    /*** Открытие модального окна товара ***/
    document.querySelectorAll(".food-item").forEach((item) => {
        item.addEventListener("click", () => {
            const price = parseInt(item.dataset.price, 10);
            itemPrice = price;

            modalImage.src = item.dataset.image;
            modalTitle.textContent = item.dataset.name;
            modalPrice.textContent = `₽ ${price}`;
            currentQuantity = 1;
            quantityDisplay.textContent = currentQuantity;

            modal.classList.remove("hidden");
            modal.style.display = "flex";
        });
    });

    /*** Закрытие модального окна товара ***/
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    /*** Увеличение и уменьшение количества товара ***/
    document.getElementById("plus").addEventListener("click", () => {
        currentQuantity++;
        quantityDisplay.textContent = currentQuantity;
    });

    document.getElementById("minus").addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityDisplay.textContent = currentQuantity;
        }
    });

    /*** Добавление товара в корзину ***/
    addToCartButton.addEventListener("click", () => {
        const itemName = modalTitle.textContent;

        if (!cart[itemName]) {
            cart[itemName] = {
                quantity: 0,
                price: itemPrice,
            };
        }

        cart[itemName].quantity += currentQuantity;

        updateCart();
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    /*** Обновление корзины ***/
    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            const li = document.createElement("li");
            li.classList.add("cart-item");

            li.innerHTML = `
                <span>${name} x${item.quantity} - ₽ ${item.price * item.quantity}</span>
                <div>
                    <button class="decrease-item" data-name="${name}">−</button>
                    <button class="increase-item" data-name="${name}">+</button>
                    <button class="remove-item" data-name="${name}">Удалить</button>
                </div>
            `;

            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        }

        cartTotalDisplay.textContent = total;

        // Обработчики кнопок для управления товарами в корзине
        document.querySelectorAll(".decrease-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                if (cart[name].quantity > 1) {
                    cart[name].quantity--;
                } else {
                    delete cart[name];
                }
                updateCart();
            });
        });

        document.querySelectorAll(".increase-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                cart[name].quantity++;
                updateCart();
            });
        });

        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                delete cart[name];
                updateCart();
            });
        });
    }

    /*** Открытие корзины ***/
    proceedToOrderButton.addEventListener("click", () => {
        cartModal.classList.remove("hidden");
        cartModal.style.display = "flex";
    });

    /*** Закрытие корзины ***/
    closeCart.addEventListener("click", () => {
        cartModal.classList.add("hidden");
        cartModal.style.display = "none";
    });

    /*** Отправка заказа в Telegram ***/
    async function sendOrderToTelegram() {
        const token = "7978127151:AAEiJVWSEmrXn6pj26O3C8HrSNVmKZYKyDA"; // Замените на токен вашего бота
        const chatId = "1776219693";  // Замените на ваш chat_id

        let message = "🛒 *Ваш заказ:*\n";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            message += `- ${name} x${item.quantity} = ₽${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        }

        message += `\n💰 *Общая стоимость:* ₽${total}`;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                }),
            });

            const result = await response.json();
            if (result.ok) {
                alert("Заказ успешно отправлен официанту");
                cart = {}; // Очищаем корзину
                updateCart();
            } else {
                alert("Ошибка при отправке заказа. Проверьте токен или chat_id.");
            }
        } catch (error) {
            console.error("Ошибка при отправке заказа:", error);
            alert("Не удалось отправить заказ. Проверьте соединение с интернетом.");
        }
    }

    /*** Обработчик кнопки "Оформить заказ" ***/
    submitOrderButton.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            alert("Корзина пуста!");
            return;
        }
        sendOrderToTelegram();
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const filtersContainer = document.querySelector(".filters");

    let isDown = false;
    let startX;
    let scrollLeft;

    // Начало движения
    filtersContainer.addEventListener("mousedown", (e) => {
        isDown = true;
        filtersContainer.classList.add("active");
        startX = e.pageX - filtersContainer.offsetLeft;
        scrollLeft = filtersContainer.scrollLeft;
    });

    // Прекращение движения
    filtersContainer.addEventListener("mouseleave", () => {
        isDown = false;
        filtersContainer.classList.remove("active");
    });

    filtersContainer.addEventListener("mouseup", () => {
        isDown = false;
        filtersContainer.classList.remove("active");
    });

    // Прокрутка при движении мыши
    filtersContainer.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filtersContainer.offsetLeft;
        const walk = (x - startX) * 2; // Скорость прокрутки
        filtersContainer.scrollLeft = scrollLeft - walk;
    });

    // Прокрутка для сенсорных экранов
    filtersContainer.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        const walk = touch.clientX - startX;
        filtersContainer.scrollLeft = scrollLeft - walk;
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const cartModal = document.getElementById("cart-modal");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalDisplay = document.getElementById("cart-total");
    const submitOrderButton = document.getElementById("submit-order");
    const proceedToOrderButton = document.getElementById("proceed-to-order");
    const closeCart = document.getElementById("close-cart");
    const filters = document.querySelectorAll(".filter");
    const foodItems = document.querySelectorAll(".food-item");

    let cart = {};
    let totalItems = 0;

    /*** Фильтрация по категориям ***/
    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.category;

            filters.forEach(btn => btn.classList.remove("active"));
            filter.classList.add("active");

            foodItems.forEach(item => {
                if (category === "all" || item.dataset.category === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });

    /*** Обновление корзины ***/
    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            const li = document.createElement("li");
            li.classList.add("cart-item");

            li.innerHTML = `
                <span>${name} x${item.quantity} - ₽ ${item.price * item.quantity}</span>
                <div>
                    <button class="decrease-item" data-name="${name}">−</button>
                    <button class="increase-item" data-name="${name}">+</button>
                    <button class="remove-item" data-name="${name}">Удалить</button>
                </div>
            `;

            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        }

        cartTotalDisplay.textContent = total;

        // Уменьшение количества товара
        document.querySelectorAll(".decrease-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                if (cart[name].quantity > 1) {
                    cart[name].quantity--;
                } else {
                    delete cart[name];
                }
                updateCart();
            });
        });

        // Увеличение количества товара
        document.querySelectorAll(".increase-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                cart[name].quantity++;
                updateCart();
            });
        });

        // Удаление товара
        document.querySelectorAll(".remove-item").forEach(button => {
            button.addEventListener("click", (e) => {
                const name = e.target.dataset.name;
                delete cart[name];
                updateCart();
            });
        });
    }

    /*** Отправка заказа в Telegram ***/
    async function sendOrderToTelegram() {
        const token = "ВАШ_ТОКЕН_БОТА"; // Замените на токен вашего бота
        const chatId = "ВАШ_CHAT_ID";  // Замените на ваш chat_id

        let message = "🛒 *Ваш заказ:*\n";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            message += `- ${name} x${item.quantity} = ₽${item.price * item.quantity}\n`;
            total += item.price * item.quantity;
        }

        message += `\n💰 *Общая стоимость:* ₽${total}`;

        const url = `https://api.telegram.org/bot${token}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: "Markdown",
                }),
            });

            const result = await response.json();
            if (result.ok) {
                alert("Заказ успешно отправлен в Telegram!");
                cart = {}; // Очищаем корзину
                updateCart();
            } else {
                alert("Ошибка при отправке заказа. Проверьте токен или chat_id.");
                console.error(result);
            }
        } catch (error) {
            console.error("Ошибка при отправке заказа:", error);
            alert("Не удалось отправить заказ. Проверьте соединение с интернетом.");
        }
    }

    /*** Обработчик кнопки "Оформить заказ" ***/
 

    /*** Добавление товара в корзину ***/
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            const item = e.target.closest(".food-item");
            const name = item.dataset.name;
            const price = parseInt(item.dataset.price, 10);

            if (!cart[name]) {
                cart[name] = { price, quantity: 0 };
            }

            cart[name].quantity++;
            totalItems++;

            updateCart();
        });
    });

    /*** Открытие корзины ***/
    proceedToOrderButton.addEventListener("click", () => {
        cartModal.classList.remove("hidden");
        cartModal.style.display = "flex";
    });

    /*** Закрытие корзины ***/
    closeCart.addEventListener("click", () => {
        cartModal.classList.add("hidden");
        cartModal.style.display = "none";
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const filters = document.querySelectorAll(".filter");
    const foodItems = document.querySelectorAll(".food-item");

    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            // Удаляем класс "active" у всех фильтров
            filters.forEach(btn => btn.classList.remove("active"));

            // Добавляем класс "active" к текущему фильтру
            filter.classList.add("active");

            // Получаем категорию из data-атрибута
            const category = filter.dataset.category;

            // Фильтруем элементы галереи
            foodItems.forEach(item => {
                if (category === "all" || item.dataset.category === category) {
                    item.style.display = "block"; // Показываем элемент
                } else {
                    item.style.display = "none"; // Скрываем элемент
                }
            });
        });
    });
});


