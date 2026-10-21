"use strict";

// ============================================
// NEXORA — ESPACE CLIENT
// Initialisation de l'interface client
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("NEXORA Client : interface chargée.");

    // Vérifier les éléments principaux de l'espace client
    const elementsClient = [
        "client-name",
        "client-email",
        "client-balance"
    ];

    elementsClient.forEach((id) => {
        const element = document.getElementById(id);

        if (!element) {
            console.log(
                `NEXORA Client : élément facultatif absent : ${id}`
            );
        }
    });

    console.log("Initialisation de l'espace client terminée.");
});