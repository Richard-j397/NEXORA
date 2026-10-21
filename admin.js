// ============================================
// NEXORA — ADMINISTRATION CENTRALE
// Connexion à Appwrite et gestion des clients
// ============================================

"use strict";

// ============================================
// 1. CONFIGURATION APPWRITE
// ============================================

const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "6acea3d5003acc6b81be";
const APPWRITE_DATABASE_ID = "6acea53e001ac9c40d6c";

// Identifiants des tables
const APPWRITE_CLIENTS_TABLE_ID = "6ad0767e003c5cdb1884";
const APPWRITE_PARTNERS_TABLE_ID = "6acea769001a343dc52a";
const APPWRITE_EVENTS_TABLE_ID = "6ad076c0000203a25843";
const APPWRITE_ORDERS_TABLE_ID = "6ad0770a002456f6cf15";

// ============================================
// 2. INITIALISATION APPWRITE
// ============================================

const client = new Appwrite.Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const tablesDB = new Appwrite.TablesDB(client);

console.log("NEXORA Administration : interface chargée.");
console.log("NEXORA — Vérification Appwrite");

console.log("SDK Appwrite disponible :", typeof Appwrite !== "undefined");

console.log("Identifiant du projet :", APPWRITE_PROJECT_ID);

console.log("Identifiant de la base :", APPWRITE_DATABASE_ID);

// ============================================
// 3. CHARGEMENT DU TABLEAU DE BORD
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------
    // COMPTEUR DES CLIENTS
    // ----------------------------------------

    tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_CLIENTS_TABLE_ID
    })
    .then((response) => {

        console.log(
            "NEXORA — Clients récupérés :",
            response.total
        );
        console.log("Réponse complète Appwrite :", response);

        // Mise à jour du compteur
        const totalClients =
            document.getElementById("Total-clients");

        if (totalClients) {
            totalClients.textContent = response.total;
        }

        // Affichage des clients dans le tableau
        const listeClients =
            document.getElementById("liste-clients");

        if (listeClients) {
            listeClients.replaceChildren();

            if (response.rows.length === 0) {
                const ligne = document.createElement("tr");
                const cellule = document.createElement("td");

                cellule.colSpan = 4;
                cellule.textContent = "Aucun client enregistré.";

                ligne.appendChild(cellule);
                listeClients.appendChild(ligne);

            } else {
                response.rows.forEach((client) => {
                    const ligne = document.createElement("tr");

                    ["name", "email", "phone", "status"]
                        .forEach((champ) => {
                            const cellule =
                                document.createElement("td");

                            cellule.textContent =
                                client[champ] ?? "—";

                            ligne.appendChild(cellule);
                        });

                    listeClients.appendChild(ligne);
                });
            }
        }

        console.log(
            "NEXORA — Données clients :",
            response.rows
        );

    })
    .catch((error) => {
        console.error(
            "NEXORA — Erreur de lecture Clients :",
            error
        );
        alert("Erreur Clients : " + (error.message || error));
    });

    // ----------------------------------------
    // COMPTEUR DES PARTENAIRES
    // ----------------------------------------

    tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_PARTNERS_TABLE_ID
    })
    .then((response) => {

        console.log(
            "NEXORA — Partenaires récupérés :",
            response.total
        );

        const totalPartenaires =
            document.getElementById("Total-partenaires");

        if (totalPartenaires) {
            totalPartenaires.textContent = response.total;
        }

    })
    .catch((error) => {
        console.error(
            "NEXORA — Erreur de lecture Partenaires :",
            error
        );
    });

    // ----------------------------------------
    // COMPTEUR DES ÉVÉNEMENTS
    // ----------------------------------------

    tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_EVENTS_TABLE_ID
    })
    .then((response) => {

        console.log(
            "NEXORA — Événements récupérés :",
            response.total
        );

        const totalEvenements =
            document.getElementById("Total-evenements");

        if (totalEvenements) {
            totalEvenements.textContent = response.total;
        }

    })
    .catch((error) => {
        console.error(
            "NEXORA — Erreur de lecture Événements :",
            error
        );
    });

    // ----------------------------------------
    // COMPTEUR DES COMMANDES
    // ----------------------------------------

    tablesDB.listRows({
        databaseId: APPWRITE_DATABASE_ID,
        tableId: APPWRITE_ORDERS_TABLE_ID
    })
    .then((response) => {

        console.log(
            "NEXORA — Commandes récupérées :",
            response.total
        );

        const totalCommandes =
            document.getElementById("Total-commandes");

        if (totalCommandes) {
            totalCommandes.textContent = response.total;
        }

    })
    .catch((error) => {
        console.error(
            "NEXORA — Erreur de lecture Commandes :",
            error
        );
    });

});
