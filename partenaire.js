"use strict";

// ============================================
// NEXORA — ESPACE PARTENAIRE
// Initialisation de l'interface partenaire
// ============================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("NEXORA Partenaire : interface chargée.");

    // Vérifier les éléments principaux de l'espace partenaire
    const elementsPartenaire = [
        "partner-name",
        "partner-email",
        "partner-balance"
    ];

    elementsPartenaire.forEach((id) => {
        const element = document.getElementById(id);

        if (!element) {
            console.log(
                `NEXORA Partenaire : élément facultatif absent : ${id}`
            );
        }
    });

    console.log("Initialisation de l'espace partenaire terminée.");
});