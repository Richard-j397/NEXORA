// ============================================
 // NEXORA — ADMINISTRATION CENTRALE
 // Connexion à Appwrite et gestion des données
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

const account = new Appwrite.Account(client);
const tablesDB = new Appwrite.TablesDB(client);

// Masquer le document pendant la vérification
document.documentElement.style.visibility = "hidden";

// ============================================
// 3. VÉRIFICATION DE LA SESSION
// ============================================

async function verifierConnexionAdmin() {
    try {
        const utilisateur = await account.get();

        if (!utilisateur || !utilisateur.$id) {
            throw new Error("Session utilisateur absente.");
        }

        document.documentElement.style.visibility = "visible";

        console.log("NEXORA : session Appwrite vérifiée.");
        return true;

    } catch (erreur) {
        console.warn("NEXORA : connexion requise.");

        window.location.replace("./login.html");
        return false;
    }
}

// ============================================
// 4. CHARGEMENT DU TABLEAU DE BORD
// ============================================

document.addEventListener("DOMContentLoaded", async () => {

    // Vérifier la session AVANT de charger les données
    const autorise = await verifierConnexionAdmin();

    if (!autorise) {
        return;
    }

    console.log("NEXORA Administration : interface chargée.");

    // ----------------------------------------
    // COMPTEUR ET LISTE DES CLIENTS
    // ----------------------------------------

    try {
        const response = await tablesDB.listRows({
            databaseId: APPWRITE_DATABASE_ID,
            tableId: APPWRITE_CLIENTS_TABLE_ID
        });

        console.log("NEXORA — Nombre de clients :", response.total);

        const totalClients =
            document.getElementById("Total-clients");

        if (totalClients) {
            totalClients.textContent = response.total;
        }

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
                            const cellule = document.createElement("td");

                            cellule.textContent =
                                client[champ] ?? "—";

                            ligne.appendChild(cellule);
                        });

                    listeClients.appendChild(ligne);
                });
            }
        }

    } catch (erreur) {
        console.error("NEXORA — Erreur Clients :", erreur);

        const listeClients =
            document.getElementById("liste-clients");

        if (listeClients) {
            listeClients.replaceChildren();

            const ligne = document.createElement("tr");
            const cellule = document.createElement("td");

            cellule.colSpan = 4;
            cellule.textContent =
                "Impossible de charger les clients.";

            ligne.appendChild(cellule);
            listeClients.appendChild(ligne);
        }
    }

    // ----------------------------------------
    // COMPTEUR DES PARTENAIRES
    // ----------------------------------------

    try {
        const response = await tablesDB.listRows({
            databaseId: APPWRITE_DATABASE_ID,
            tableId: APPWRITE_PARTNERS_TABLE_ID
        });

        const totalPartenaires =
            document.getElementById("Total-partenaires");

        if (totalPartenaires) {
            totalPartenaires.textContent = response.total;
        }

        console.log("NEXORA — Partenaires :", response.total);

    } catch (erreur) {
        console.error("NEXORA — Erreur Partenaires :", erreur);
    }

    // ----------------------------------------
    // COMPTEUR DES ÉVÉNEMENTS
    // ----------------------------------------

    try {
        const response = await tablesDB.listRows({
            databaseId: APPWRITE_DATABASE_ID,
            tableId: APPWRITE_EVENTS_TABLE_ID
        });

        const totalEvenements =
            document.getElementById("Total-evenements");

        if (totalEvenements) {
            totalEvenements.textContent = response.total;
        }

        console.log("NEXORA — Événements :", response.total);

    } catch (erreur) {
        console.error("NEXORA — Erreur Événements :", erreur);
    }

    // ----------------------------------------
    // COMPTEUR DES COMMANDES
    // ----------------------------------------

    try {
        const response = await tablesDB.listRows({
            databaseId: APPWRITE_DATABASE_ID,
            tableId: APPWRITE_ORDERS_TABLE_ID
        });

        const totalCommandes =
            document.getElementById("Total-commandes");

        if (totalCommandes) {
            totalCommandes.textContent = response.total;
        }

        console.log("NEXORA — Commandes :", response.total);

    } catch (erreur) {
        console.error("NEXORA — Erreur Commandes :", erreur);
    }

});
