"use strict";

// ============================================
// NEXORA — PAGE PUBLIQUE
// Initialisation de l'interface publique
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("NEXORA Public : page chargée.");

    // Navigation mobile
    const menuButton = document.getElementById("menu-toggle");
    const navigation = document.getElementById("public-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // Navigation vers les sections de la page
    document.querySelectorAll('a[href^="#"]').forEach((lien) => {
        lien.addEventListener("click", () => {
            if (navigation) {
                navigation.classList.remove("is-open");
            }

            if (menuButton) {
                menuButton.setAttribute("aria-expanded", "false");
            }
        });
    });

    console.log("Initialisation de la page publique terminée.");
});