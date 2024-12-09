document.addEventListener("DOMContentLoaded", () => {
    const cartModal = document.getElementById("cart-modal");
    const cartItemsList = document.getElementById("cart-items");
    const cartTotalDisplay = document.getElementById("cart-total");
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const quantityDisplay = document.getElementById("quantity");
    const addToCartButton = document.getElementById("add-to-cart");
    const submitOrderButton = document.getElementById("submit-order");

    let cart = {}; // Объект корзины
    let currentQuantity = 1;
    let itemPrice = 0;

    // Функция обновления общей стоимости в модальном окне
    function updateTotalPrice() {
        const totalPrice = itemPrice * currentQuantity;
        document.getElementById("total-price-modal").textContent = `Общая стоимость: ₽ ${totalPrice}`;
    }

    // Открытие модального окна
    document.querySelectorAll(".food-item").forEach((item) => {
        item.addEventListener("click", () => {
            itemPrice = parseInt(item.dataset.price, 10);
            modalImage.src = item.dataset.image;
            modalTitle.textContent = item.dataset.name;
            modalPrice.textContent = `₽ ${itemPrice}`;
            currentQuantity = 1; // Сбрасываем количество
            quantityDisplay.textContent = currentQuantity;
            document.getElementById("order-comment").value = ""; // Очищаем поле комментария
            modal.classList.remove("hidden");
            modal.style.display = "flex";
        });
    });

    // Закрытие модального окна
    closeModal.addEventListener("click", () => {
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    // Управление количеством товара
    document.getElementById("plus").addEventListener("click", () => {
        currentQuantity++;
        quantityDisplay.textContent = currentQuantity;
        updateTotalPrice();
    });

    document.getElementById("minus").addEventListener("click", () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            quantityDisplay.textContent = currentQuantity;
            updateTotalPrice();
        }
    });

    // Добавление товара в корзину
    addToCartButton.addEventListener("click", () => {
        const itemName = modalTitle.textContent;
        const comment = document.getElementById("order-comment").value.trim(); // Получаем комментарий

        if (!cart[itemName]) {
            cart[itemName] = {
                price: itemPrice,
                quantity: 0,
                comment: "",
            };
        }

        cart[itemName].quantity += currentQuantity;
        cart[itemName].comment = comment; // Сохраняем комментарий
        updateCart(); // Обновляем корзину
        modal.classList.add("hidden");
        modal.style.display = "none";
    });

    // Обновление корзины
    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${name} x${item.quantity} - ₽ ${item.price * item.quantity}</span>
                <p><strong>Комментарий:</strong> ${item.comment || "Нет комментария"}</p>
            `;
            cartItemsList.appendChild(li);
            total += item.price * item.quantity;
        }

        cartTotalDisplay.textContent = total;
    }

    // Отправка заказа в Telegram
    async function sendOrderToTelegram() {
        const token = "7978127151:AAEiJVWSEmrXn6pj26O3C8HrSNVmKZYKyDA"; // Замените на токен вашего бота
        const chatId = "-1002430027699";  // Замените на ваш chat_id

        let message = "🛒 *Ваш заказ:*\n";
        let total = 0;

        for (const [name, item] of Object.entries(cart)) {
            message += `- ${name} x${item.quantity} = ₽${item.price * item.quantity}\n`;
            if (item.comment) {
                message += `  Комментарий: ${item.comment}\n`;
            }
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
                cart = {};
                updateCart();
            } else {
                alert("Ошибка при отправке заказа. Проверьте токен или chat_id.");
            }
        } catch (error) {
            console.error("Ошибка при отправке заказа:", error);
            alert("Не удалось отправить заказ. Проверьте соединение с интернетом.");
        }
    }

    // Оформление заказа
    submitOrderButton.addEventListener("click", () => {
        if (Object.keys(cart).length === 0) {
            alert("Корзина пуста!");
            return;
        }
        sendOrderToTelegram();
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const cartModal = document.getElementById("cart-modal");
    const proceedToOrderButton = document.getElementById("proceed-to-order");
    const closeCartButton = document.getElementById("close-cart");

    // Открытие корзины
    proceedToOrderButton.addEventListener("click", () => {
        cartModal.classList.remove("hidden");
        cartModal.style.display = "flex";
    });

    // Закрытие корзины
    closeCartButton.addEventListener("click", () => {
        cartModal.classList.add("hidden");
        cartModal.style.display = "none";
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const filters = document.querySelectorAll(".filter");
    const foodItems = document.querySelectorAll(".food-item");

    // Обработчик клика по фильтрам
    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            const category = filter.dataset.category;

            // Сбрасываем активный класс у всех фильтров
            filters.forEach((btn) => btn.classList.remove("active"));
            filter.classList.add("active");

            // Показываем или скрываем товары
            foodItems.forEach((item) => {
                if (category === "all" || item.dataset.category === category) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });
        });
    });
});
