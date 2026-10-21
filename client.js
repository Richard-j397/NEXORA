"use strict";

// ============================================
// NEXORA — COMPTES CLIENTS
// Inscription, connexion et déconnexion
// ============================================

const clientAppwrite = new Appwrite.Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("6acea3d5003acc6b81be");

const clientAccount = new Appwrite.Account(clientAppwrite);

document.addEventListener("DOMContentLoaded", async () => {
    const anciennesValeurs = new Map();

    // Masquer l'espace client tant que la connexion
    // n'a pas été vérifiée.
    const authRoot = document.createElement("div");
    authRoot.id = "nexora-client-auth";
    authRoot.style.cssText = `
        position:fixed;
        inset:0;
        z-index:999999;
        overflow:auto;
        background:#f3f5f9;
        font-family:Arial,sans-serif;
        padding:24px 16px;
        box-sizing:border-box;
    `;

    document.body.appendChild(authRoot);

    Array.from(document.body.children).forEach(element => {
        if (element !== authRoot) {
            anciennesValeurs.set(element, element.style.display);
            element.style.display = "none";
        }
    });

    const afficherFormulaire = () => {
        authRoot.innerHTML = `
            <div style="
                max-width:420px;
                margin:35px auto;
                padding:28px;
                background:white;
                border-radius:16px;
                box-shadow:0 5px 25px #00000012;
            ">
                <h1 style="text-align:center;color:#173b75">
                    NEXORA
                </h1>
                <p style="text-align:center;color:#666">
                    Votre espace personnel
                </p>

                <div style="display:flex;gap:8px;margin:24px 0">
                    <button id="nexora-login-tab" type="button"
                        style="flex:1;padding:12px;border:0;
                        border-radius:8px;background:#173b75;
                        color:white">
                        Connexion
                    </button>
                    <button id="nexora-register-tab" type="button"
                        style="flex:1;padding:12px;border:0;
                        border-radius:8px;background:#e8edf5;
                        color:#173b75">
                        Inscription
                    </button>
                </div>

                <form id="nexora-auth-form">
                    <div id="nexora-name-field" style="display:none;margin-bottom:14px">
                        <label for="nexora-name">Nom complet</label>
                        <input id="nexora-name" autocomplete="name"
                            style="width:100%;box-sizing:border-box;
                            padding:12px;margin-top:6px"
                            placeholder="Votre nom complet">
                    </div>

                    <div style="margin-bottom:14px">
                        <label for="nexora-email">Adresse e-mail</label>
                        <input id="nexora-email" type="email"
                            autocomplete="email" required
                            style="width:100%;box-sizing:border-box;
                            padding:12px;margin-top:6px"
                            placeholder="exemple@email.com">
                    </div>

                    <div style="margin-bottom:18px">
                        <label for="nexora-password">Mot de passe</label>
                        <input id="nexora-password" type="password"
                            autocomplete="current-password"
                            minlength="8" required
                            style="width:100%;box-sizing:border-box;
                            padding:12px;margin-top:6px"
                            placeholder="8 caractères minimum">
                    </div>

                    <button id="nexora-submit" type="submit"
                        style="width:100%;padding:14px;border:0;
                        border-radius:8px;background:#173b75;
                        color:white;font-weight:bold">
                        Se connecter
                    </button>

                    <p id="nexora-message" role="status"
                        style="margin-top:16px;text-align:center;
                        overflow-wrap:anywhere"></p>
                </form>
            </div>
        `;

        let mode = "login";

        const nameField = document.getElementById("nexora-name-field");
        const nameInput = document.getElementById("nexora-name");
        const passwordInput = document.getElementById("nexora-password");
        const submitButton = document.getElementById("nexora-submit");
        const message = document.getElementById("nexora-message");

        function choisirMode(nouveauMode) {
            mode = nouveauMode;
            const inscription = mode === "register";

            nameField.style.display = inscription ? "block" : "none";
            nameInput.required = inscription;
            passwordInput.autocomplete = inscription
                ? "new-password"
                : "current-password";

            submitButton.textContent = inscription
                ? "Créer mon compte"
                : "Se connecter";

            document.getElementById("nexora-login-tab").style.background =
                inscription ? "#e8edf5" : "#173b75";
            document.getElementById("nexora-login-tab").style.color =
                inscription ? "#173b75" : "white";

            document.getElementById("nexora-register-tab").style.background =
                inscription ? "#173b75" : "#e8edf5";
            document.getElementById("nexora-register-tab").style.color =
                inscription ? "white" : "#173b75";

            message.textContent = "";
        }

        document.getElementById("nexora-login-tab")
            .addEventListener("click", () => choisirMode("login"));

        document.getElementById("nexora-register-tab")
            .addEventListener("click", () => choisirMode("register"));

        document.getElementById("nexora-auth-form")
            .addEventListener("submit", async event => {
                event.preventDefault();

                const email = document.getElementById("nexora-email")
                    .value.trim();
                const password = passwordInput.value;
                const name = nameInput.value.trim();

                if (mode === "register" && !name) {
                    message.style.color = "red";
                    message.textContent = "Veuillez saisir votre nom.";
                    return;
                }

                submitButton.disabled = true;
                message.style.color = "#173b75";
                message.textContent = "Veuillez patienter...";

                try {
                    if (mode === "register") {
                        await clientAccount.create({
                            userId: Appwrite.ID.unique(),
                            email,
                            password,
                            name
                        });
                    }

                    await clientAccount.createEmailPasswordSession({
                        email,
                        password
                    });

                    await chargerEspaceClient();
                } catch (error) {
                    message.style.color = "red";

                    if (error.code === 409) {
                        message.textContent =
                            "Cette adresse e-mail possède déjà un compte. Connectez-vous.";
                    } else {
                        message.textContent =
                            "Erreur : " + (error.message ||
                            "opération impossible") +
                            ". Vérifiez vos informations et réessayez.";
                    }

                    submitButton.disabled = false;
                }
            });
    };

    async function chargerEspaceClient() {
        try {
            const utilisateur = await clientAccount.get();

            // Afficher les éléments habituels de la page.
            anciennesValeurs.forEach((display, element) => {
                if (element.isConnected) {
                    element.style.display = display;
                }
            });

            authRoot.remove();

            // Mettre à jour les informations disponibles du client.
            const champsNom = [
                "client-name",
                "clientProfileName"
            ];

            const champsEmail = [
                "client-email",
                "clientProfileEmail"
            ];

            champsNom.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = utilisateur.name;
            });

            champsEmail.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.textContent = utilisateur.email;
            });

            // Ajouter le bouton de déconnexion.
            const bouton = document.createElement("button");
            bouton.type = "button";
            bouton.textContent = "Se déconnecter";
            bouton.style.cssText =
                "padding:10px 14px;margin:12px;border:0;" +
                "border-radius:8px;background:#b42318;color:white;";

            bouton.addEventListener("click", async () => {
                bouton.disabled = true;

                try {
                    await clientAccount.deleteSession({
                        sessionId: "current"
                    });
                    window.location.reload();
                } catch (error) {
                    alert("Déconnexion impossible : " + error.message);
                    bouton.disabled = false;
                }
            });

            document.body.appendChild(bouton);

        } catch (error) {
            // Pas de session valide : demander de se connecter.
            afficherFormulaire();
        }
    }

    await chargerEspaceClient();
});
