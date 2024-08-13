// script.js
document.addEventListener('DOMContentLoaded', () => {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('main-image');
    const goproSelect = document.getElementById('gopro-select');
    const totalPriceDisplay = document.getElementById('total-price');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const calendar = document.getElementById("calendar");

    // Générer le calendrier simple pour le mois en cours
    function generateCalendar() {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        let calendarHTML = "<table><tr>";
        const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

        // En-têtes des jours de la semaine
        daysOfWeek.forEach(day => {
            calendarHTML += `<th>${day}</th>`;
        });

        calendarHTML += "</tr><tr>";

        // Blancs avant le début du mois
        for (let i = 0; i < firstDay; i++) {
            calendarHTML += "<td></td>";
        }

        // Ajouter les jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateString = date.toISOString().split('T')[0];

            // Désactiver les jours passés
            const isPast = date < today.setHours(0, 0, 0, 0);
            const disabledClass = isPast ? 'disabled' : '';

            calendarHTML += `<td class="calendar-day ${disabledClass}" data-date="${dateString}">${day}</td>`;

            // Fin de la semaine
            if ((firstDay + day) % 7 === 0) {
                calendarHTML += "</tr><tr>";
            }
        }

        calendarHTML += "</tr></table>";
        calendar.innerHTML = calendarHTML;
    }

    // Mettre à jour les champs de date en cliquant sur le calendrier
    calendar.addEventListener("click", function(event) {
        if (event.target.classList.contains("calendar-day") && !event.target.classList.contains("disabled")) {
            const selectedDate = event.target.getAttribute("data-date");

            if (!startDateInput.value || new Date(selectedDate) < new Date(startDateInput.value)) {
                startDateInput.value = selectedDate;

                // Désélectionner tous les jours et sélectionner le jour choisi
                document.querySelectorAll('.calendar-day.selected').forEach(day => day.classList.remove('selected'));
                event.target.classList.add('selected');
            } else {
                endDateInput.value = selectedDate;

                // Marquer les jours entre start-date et end-date comme sélectionnés
                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                document.querySelectorAll('.calendar-day').forEach(day => {
                    const dayDate = new Date(day.getAttribute('data-date'));
                    if (dayDate >= startDate && dayDate <= endDate) {
                        day.classList.add('selected');
                    } else {
                        day.classList.remove('selected');
                    }
                });
            }

            calculateTotalPrice(); // Mettre à jour le prix total après la sélection de la date
        }
    });

    // Fonction de calcul du prix total
    function calculateTotalPrice() {
        const goproPrice = parseFloat(goproSelect.selectedOptions[0].getAttribute('data-price'));
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        if (startDate && endDate && startDate < endDate) {
            const timeDiff = endDate - startDate;
            const daysRented = timeDiff / (1000 * 3600 * 24) + 1;
            if (daysRented >= 4) {
                const totalPrice = daysRented * goproPrice;
                totalPriceDisplay.textContent = `Total : ${totalPrice.toFixed(2)}€`;
            } else {
                totalPriceDisplay.textContent = "La durée minimale de location est de 4 jours.";
            }
        } else {
            totalPriceDisplay.textContent = "Veuillez sélectionner des dates valides.";
        }
    }

    // Gestion des événements pour l'image principale et les variantes de GoPro
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            mainImage.src = thumbnail.src;
        });
    });

    goproSelect.addEventListener('change', () => {
        const selectedImg = goproSelect.selectedOptions[0].getAttribute('data-img');
        mainImage.src = selectedImg;
        calculateTotalPrice();
    });

    startDateInput.addEventListener('change', calculateTotalPrice);
    endDateInput.addEventListener('change', calculateTotalPrice);

    // Générer le calendrier au chargement de la page
    generateCalendar();
});
