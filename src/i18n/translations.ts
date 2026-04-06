export type Language = "en" | "pt" | "es" | "fr" | "it" | "de";

export const languageLabels: Record<Language, string> = {
  en: "🇺🇸 English",
  pt: "🇧🇷 Português",
  es: "🇪🇸 Español",
  fr: "🇫🇷 Français",
  it: "🇮🇹 Italiano",
  de: "🇩🇪 Deutsch",
};

type TranslationKeys = {
  // Bottom nav
  nav_home: string;
  nav_routine: string;
  nav_translator: string;
  nav_help: string;
  nav_profile: string;

  // Profile page
  profile_title: string;
  profile_your_baby: string;
  profile_baby_info: string;
  profile_parent: string;
  profile_sleep_location: string;
  profile_feeding: string;
  profile_uses_pacifier: string;
  profile_night_feedings: string;
  profile_usual_bedtime: string;
  profile_main_challenge: string;
  profile_special_conditions: string;
  profile_edit_info: string;
  profile_account: string;
  profile_email: string;
  profile_change_password: string;
  profile_new_password: string;
  profile_confirm_password: string;
  profile_min_chars: string;
  profile_repeat_password: string;
  profile_changing: string;
  profile_change_btn: string;
  profile_settings: string;
  profile_notifications: string;
  profile_receive_reminders: string;
  profile_night_mode: string;
  profile_auto_activate: string;
  profile_help_center: string;
  profile_admin_panel: string;
  profile_sign_out: string;
  profile_language: string;
  profile_select_language: string;

  // Sleep locations
  loc_crib: string;
  loc_parents_room: string;
  loc_co_sleeping: string;
  loc_bassinet: string;

  // Feeding types
  feed_breastfeeding: string;
  feed_formula: string;
  feed_mixed: string;
  feed_solids: string;

  // Bedtimes
  bed_before_19: string;
  bed_19_20: string;
  bed_20_21: string;
  bed_21_22: string;
  bed_after_22: string;
  bed_irregular: string;

  // Special conditions
  cond_reflux: string;
  cond_colic: string;
  cond_premature: string;
  cond_allergy: string;
  cond_dermatitis: string;

  // Age units
  age_days: string;
  age_month: string;
  age_months: string;
  age_year: string;
  age_years: string;
  age_and: string;

  // Yes/No
  yes: string;
  no: string;

  // Per night
  per_night: string;

  // Password messages
  password_too_short: string;
  password_too_short_desc: string;
  passwords_dont_match: string;
  passwords_dont_match_desc: string;
  password_changed: string;
  password_changed_desc: string;

  // Loading
  loading: string;

  // Home page
  home_good_morning: string;
  home_good_afternoon: string;
  home_good_evening: string;

  // Subscription
  subscription_title: string;
};

const translations: Record<Language, TranslationKeys> = {
  en: {
    nav_home: "Home",
    nav_routine: "Routine",
    nav_translator: "Translator",
    nav_help: "Help",
    nav_profile: "Profile",
    profile_title: "Profile",
    profile_your_baby: "Your baby",
    profile_baby_info: "Baby info",
    profile_parent: "Parent",
    profile_sleep_location: "Sleep location",
    profile_feeding: "Feeding",
    profile_uses_pacifier: "Uses pacifier",
    profile_night_feedings: "Night feedings",
    profile_usual_bedtime: "Usual bedtime",
    profile_main_challenge: "Main challenge",
    profile_special_conditions: "Special conditions",
    profile_edit_info: "Edit information",
    profile_account: "Account",
    profile_email: "Email",
    profile_change_password: "Change Password",
    profile_new_password: "New password",
    profile_confirm_password: "Confirm new password",
    profile_min_chars: "Minimum 6 characters",
    profile_repeat_password: "Repeat new password",
    profile_changing: "Changing...",
    profile_change_btn: "Change password",
    profile_settings: "Settings",
    profile_notifications: "Notifications",
    profile_receive_reminders: "Receive reminders",
    profile_night_mode: "Night mode",
    profile_auto_activate: "Activate automatically",
    profile_help_center: "Help Center",
    profile_admin_panel: "Admin Panel",
    profile_sign_out: "Sign out",
    profile_language: "Language",
    profile_select_language: "Select language",
    loc_crib: "Own crib",
    loc_parents_room: "Parents' room",
    loc_co_sleeping: "Co-sleeping",
    loc_bassinet: "Bassinet",
    feed_breastfeeding: "Exclusive breastfeeding",
    feed_formula: "Formula",
    feed_mixed: "Mixed",
    feed_solids: "Solids introduced",
    bed_before_19: "Before 7 PM",
    bed_19_20: "7–8 PM",
    bed_20_21: "8–9 PM",
    bed_21_22: "9–10 PM",
    bed_after_22: "After 10 PM",
    bed_irregular: "No fixed schedule",
    cond_reflux: "Reflux",
    cond_colic: "Colic",
    cond_premature: "Premature",
    cond_allergy: "Food allergy",
    cond_dermatitis: "Dermatitis",
    age_days: "days",
    age_month: "month",
    age_months: "months",
    age_year: "year",
    age_years: "years",
    age_and: "and",
    yes: "Yes",
    no: "No",
    per_night: "per night",
    password_too_short: "Password too short",
    password_too_short_desc: "Password must be at least 6 characters.",
    passwords_dont_match: "Passwords don't match",
    passwords_dont_match_desc: "Password confirmation doesn't match.",
    password_changed: "Password changed!",
    password_changed_desc: "Your password has been updated successfully.",
    loading: "Loading...",
    home_good_morning: "Good morning",
    home_good_afternoon: "Good afternoon",
    home_good_evening: "Good evening",
    subscription_title: "Subscription",
  },
  pt: {
    nav_home: "Início",
    nav_routine: "Rotina",
    nav_translator: "Tradutor",
    nav_help: "Ajuda",
    nav_profile: "Perfil",
    profile_title: "Perfil",
    profile_your_baby: "Seu bebê",
    profile_baby_info: "Dados do bebê",
    profile_parent: "Responsável",
    profile_sleep_location: "Local de dormir",
    profile_feeding: "Alimentação",
    profile_uses_pacifier: "Usa chupeta",
    profile_night_feedings: "Mamadas noturnas",
    profile_usual_bedtime: "Horário de dormir",
    profile_main_challenge: "Desafio principal",
    profile_special_conditions: "Condições especiais",
    profile_edit_info: "Editar informações",
    profile_account: "Conta",
    profile_email: "E-mail",
    profile_change_password: "Alterar Senha",
    profile_new_password: "Nova senha",
    profile_confirm_password: "Confirmar nova senha",
    profile_min_chars: "Mínimo 6 caracteres",
    profile_repeat_password: "Repita a nova senha",
    profile_changing: "Alterando...",
    profile_change_btn: "Alterar senha",
    profile_settings: "Configurações",
    profile_notifications: "Notificações",
    profile_receive_reminders: "Receber lembretes",
    profile_night_mode: "Modo noturno",
    profile_auto_activate: "Ativar automaticamente",
    profile_help_center: "Central de Ajuda",
    profile_admin_panel: "Painel Admin",
    profile_sign_out: "Sair",
    profile_language: "Idioma",
    profile_select_language: "Selecionar idioma",
    loc_crib: "Berço próprio",
    loc_parents_room: "Quarto dos pais",
    loc_co_sleeping: "Cama compartilhada",
    loc_bassinet: "Moisés",
    feed_breastfeeding: "Amamentação exclusiva",
    feed_formula: "Fórmula",
    feed_mixed: "Mista",
    feed_solids: "Introdução alimentar",
    bed_before_19: "Antes das 19h",
    bed_19_20: "19h–20h",
    bed_20_21: "20h–21h",
    bed_21_22: "21h–22h",
    bed_after_22: "Após 22h",
    bed_irregular: "Sem horário fixo",
    cond_reflux: "Refluxo",
    cond_colic: "Cólica",
    cond_premature: "Prematuro",
    cond_allergy: "Alergia alimentar",
    cond_dermatitis: "Dermatite",
    age_days: "dias",
    age_month: "mês",
    age_months: "meses",
    age_year: "ano",
    age_years: "anos",
    age_and: "e",
    yes: "Sim",
    no: "Não",
    per_night: "por noite",
    password_too_short: "Senha muito curta",
    password_too_short_desc: "A senha deve ter pelo menos 6 caracteres.",
    passwords_dont_match: "Senhas não conferem",
    passwords_dont_match_desc: "A confirmação da senha não corresponde.",
    password_changed: "Senha alterada!",
    password_changed_desc: "Sua senha foi atualizada com sucesso.",
    loading: "Carregando...",
    home_good_morning: "Bom dia",
    home_good_afternoon: "Boa tarde",
    home_good_evening: "Boa noite",
    subscription_title: "Assinatura",
  },
  es: {
    nav_home: "Inicio",
    nav_routine: "Rutina",
    nav_translator: "Traductor",
    nav_help: "Ayuda",
    nav_profile: "Perfil",
    profile_title: "Perfil",
    profile_your_baby: "Tu bebé",
    profile_baby_info: "Datos del bebé",
    profile_parent: "Padre/Madre",
    profile_sleep_location: "Lugar para dormir",
    profile_feeding: "Alimentación",
    profile_uses_pacifier: "Usa chupete",
    profile_night_feedings: "Tomas nocturnas",
    profile_usual_bedtime: "Hora de dormir",
    profile_main_challenge: "Desafío principal",
    profile_special_conditions: "Condiciones especiales",
    profile_edit_info: "Editar información",
    profile_account: "Cuenta",
    profile_email: "Correo",
    profile_change_password: "Cambiar Contraseña",
    profile_new_password: "Nueva contraseña",
    profile_confirm_password: "Confirmar nueva contraseña",
    profile_min_chars: "Mínimo 6 caracteres",
    profile_repeat_password: "Repetir nueva contraseña",
    profile_changing: "Cambiando...",
    profile_change_btn: "Cambiar contraseña",
    profile_settings: "Configuración",
    profile_notifications: "Notificaciones",
    profile_receive_reminders: "Recibir recordatorios",
    profile_night_mode: "Modo nocturno",
    profile_auto_activate: "Activar automáticamente",
    profile_help_center: "Centro de Ayuda",
    profile_admin_panel: "Panel Admin",
    profile_sign_out: "Cerrar sesión",
    profile_language: "Idioma",
    profile_select_language: "Seleccionar idioma",
    loc_crib: "Cuna propia",
    loc_parents_room: "Habitación de padres",
    loc_co_sleeping: "Colecho",
    loc_bassinet: "Moisés",
    feed_breastfeeding: "Lactancia exclusiva",
    feed_formula: "Fórmula",
    feed_mixed: "Mixta",
    feed_solids: "Alimentación complementaria",
    bed_before_19: "Antes de las 19h",
    bed_19_20: "19–20h",
    bed_20_21: "20–21h",
    bed_21_22: "21–22h",
    bed_after_22: "Después de las 22h",
    bed_irregular: "Sin horario fijo",
    cond_reflux: "Reflujo",
    cond_colic: "Cólico",
    cond_premature: "Prematuro",
    cond_allergy: "Alergia alimentaria",
    cond_dermatitis: "Dermatitis",
    age_days: "días",
    age_month: "mes",
    age_months: "meses",
    age_year: "año",
    age_years: "años",
    age_and: "y",
    yes: "Sí",
    no: "No",
    per_night: "por noche",
    password_too_short: "Contraseña muy corta",
    password_too_short_desc: "La contraseña debe tener al menos 6 caracteres.",
    passwords_dont_match: "Las contraseñas no coinciden",
    passwords_dont_match_desc: "La confirmación no coincide.",
    password_changed: "¡Contraseña cambiada!",
    password_changed_desc: "Tu contraseña ha sido actualizada.",
    loading: "Cargando...",
    home_good_morning: "Buenos días",
    home_good_afternoon: "Buenas tardes",
    home_good_evening: "Buenas noches",
    subscription_title: "Suscripción",
  },
  fr: {
    nav_home: "Accueil",
    nav_routine: "Routine",
    nav_translator: "Traducteur",
    nav_help: "Aide",
    nav_profile: "Profil",
    profile_title: "Profil",
    profile_your_baby: "Votre bébé",
    profile_baby_info: "Infos bébé",
    profile_parent: "Parent",
    profile_sleep_location: "Lieu de sommeil",
    profile_feeding: "Alimentation",
    profile_uses_pacifier: "Utilise une tétine",
    profile_night_feedings: "Tétées nocturnes",
    profile_usual_bedtime: "Heure du coucher",
    profile_main_challenge: "Défi principal",
    profile_special_conditions: "Conditions spéciales",
    profile_edit_info: "Modifier les infos",
    profile_account: "Compte",
    profile_email: "E-mail",
    profile_change_password: "Changer le mot de passe",
    profile_new_password: "Nouveau mot de passe",
    profile_confirm_password: "Confirmer le mot de passe",
    profile_min_chars: "Minimum 6 caractères",
    profile_repeat_password: "Répéter le mot de passe",
    profile_changing: "Modification...",
    profile_change_btn: "Changer le mot de passe",
    profile_settings: "Paramètres",
    profile_notifications: "Notifications",
    profile_receive_reminders: "Recevoir des rappels",
    profile_night_mode: "Mode nuit",
    profile_auto_activate: "Activer automatiquement",
    profile_help_center: "Centre d'aide",
    profile_admin_panel: "Panneau Admin",
    profile_sign_out: "Se déconnecter",
    profile_language: "Langue",
    profile_select_language: "Choisir la langue",
    loc_crib: "Lit propre",
    loc_parents_room: "Chambre des parents",
    loc_co_sleeping: "Co-dodo",
    loc_bassinet: "Berceau",
    feed_breastfeeding: "Allaitement exclusif",
    feed_formula: "Lait artificiel",
    feed_mixed: "Mixte",
    feed_solids: "Diversification alimentaire",
    bed_before_19: "Avant 19h",
    bed_19_20: "19h–20h",
    bed_20_21: "20h–21h",
    bed_21_22: "21h–22h",
    bed_after_22: "Après 22h",
    bed_irregular: "Pas d'horaire fixe",
    cond_reflux: "Reflux",
    cond_colic: "Coliques",
    cond_premature: "Prématuré",
    cond_allergy: "Allergie alimentaire",
    cond_dermatitis: "Dermatite",
    age_days: "jours",
    age_month: "mois",
    age_months: "mois",
    age_year: "an",
    age_years: "ans",
    age_and: "et",
    yes: "Oui",
    no: "Non",
    per_night: "par nuit",
    password_too_short: "Mot de passe trop court",
    password_too_short_desc: "Le mot de passe doit avoir au moins 6 caractères.",
    passwords_dont_match: "Les mots de passe ne correspondent pas",
    passwords_dont_match_desc: "La confirmation ne correspond pas.",
    password_changed: "Mot de passe changé !",
    password_changed_desc: "Votre mot de passe a été mis à jour.",
    loading: "Chargement...",
    home_good_morning: "Bonjour",
    home_good_afternoon: "Bon après-midi",
    home_good_evening: "Bonsoir",
    subscription_title: "Abonnement",
  },
  it: {
    nav_home: "Home",
    nav_routine: "Routine",
    nav_translator: "Traduttore",
    nav_help: "Aiuto",
    nav_profile: "Profilo",
    profile_title: "Profilo",
    profile_your_baby: "Il tuo bambino",
    profile_baby_info: "Info bambino",
    profile_parent: "Genitore",
    profile_sleep_location: "Luogo del sonno",
    profile_feeding: "Alimentazione",
    profile_uses_pacifier: "Usa il ciuccio",
    profile_night_feedings: "Poppate notturne",
    profile_usual_bedtime: "Orario di andare a letto",
    profile_main_challenge: "Sfida principale",
    profile_special_conditions: "Condizioni speciali",
    profile_edit_info: "Modifica informazioni",
    profile_account: "Account",
    profile_email: "E-mail",
    profile_change_password: "Cambia Password",
    profile_new_password: "Nuova password",
    profile_confirm_password: "Conferma nuova password",
    profile_min_chars: "Minimo 6 caratteri",
    profile_repeat_password: "Ripeti nuova password",
    profile_changing: "Modificando...",
    profile_change_btn: "Cambia password",
    profile_settings: "Impostazioni",
    profile_notifications: "Notifiche",
    profile_receive_reminders: "Ricevi promemoria",
    profile_night_mode: "Modalità notte",
    profile_auto_activate: "Attiva automaticamente",
    profile_help_center: "Centro Assistenza",
    profile_admin_panel: "Pannello Admin",
    profile_sign_out: "Esci",
    profile_language: "Lingua",
    profile_select_language: "Seleziona lingua",
    loc_crib: "Lettino proprio",
    loc_parents_room: "Camera dei genitori",
    loc_co_sleeping: "Co-sleeping",
    loc_bassinet: "Culla",
    feed_breastfeeding: "Allattamento esclusivo",
    feed_formula: "Latte artificiale",
    feed_mixed: "Misto",
    feed_solids: "Svezzamento",
    bed_before_19: "Prima delle 19",
    bed_19_20: "19–20",
    bed_20_21: "20–21",
    bed_21_22: "21–22",
    bed_after_22: "Dopo le 22",
    bed_irregular: "Nessun orario fisso",
    cond_reflux: "Reflusso",
    cond_colic: "Coliche",
    cond_premature: "Prematuro",
    cond_allergy: "Allergia alimentare",
    cond_dermatitis: "Dermatite",
    age_days: "giorni",
    age_month: "mese",
    age_months: "mesi",
    age_year: "anno",
    age_years: "anni",
    age_and: "e",
    yes: "Sì",
    no: "No",
    per_night: "per notte",
    password_too_short: "Password troppo corta",
    password_too_short_desc: "La password deve avere almeno 6 caratteri.",
    passwords_dont_match: "Le password non corrispondono",
    passwords_dont_match_desc: "La conferma non corrisponde.",
    password_changed: "Password cambiata!",
    password_changed_desc: "La tua password è stata aggiornata.",
    loading: "Caricamento...",
    home_good_morning: "Buongiorno",
    home_good_afternoon: "Buon pomeriggio",
    home_good_evening: "Buonasera",
    subscription_title: "Abbonamento",
  },
  de: {
    nav_home: "Startseite",
    nav_routine: "Routine",
    nav_translator: "Übersetzer",
    nav_help: "Hilfe",
    nav_profile: "Profil",
    profile_title: "Profil",
    profile_your_baby: "Dein Baby",
    profile_baby_info: "Baby-Infos",
    profile_parent: "Elternteil",
    profile_sleep_location: "Schlafplatz",
    profile_feeding: "Ernährung",
    profile_uses_pacifier: "Benutzt Schnuller",
    profile_night_feedings: "Nachtfütterungen",
    profile_usual_bedtime: "Übliche Schlafenszeit",
    profile_main_challenge: "Hauptherausforderung",
    profile_special_conditions: "Besondere Bedingungen",
    profile_edit_info: "Infos bearbeiten",
    profile_account: "Konto",
    profile_email: "E-Mail",
    profile_change_password: "Passwort ändern",
    profile_new_password: "Neues Passwort",
    profile_confirm_password: "Passwort bestätigen",
    profile_min_chars: "Mindestens 6 Zeichen",
    profile_repeat_password: "Neues Passwort wiederholen",
    profile_changing: "Wird geändert...",
    profile_change_btn: "Passwort ändern",
    profile_settings: "Einstellungen",
    profile_notifications: "Benachrichtigungen",
    profile_receive_reminders: "Erinnerungen erhalten",
    profile_night_mode: "Nachtmodus",
    profile_auto_activate: "Automatisch aktivieren",
    profile_help_center: "Hilfecenter",
    profile_admin_panel: "Admin-Bereich",
    profile_sign_out: "Abmelden",
    profile_language: "Sprache",
    profile_select_language: "Sprache wählen",
    loc_crib: "Eigenes Bett",
    loc_parents_room: "Elternschlafzimmer",
    loc_co_sleeping: "Familienbett",
    loc_bassinet: "Stubenwagen",
    feed_breastfeeding: "Ausschließliches Stillen",
    feed_formula: "Flaschennahrung",
    feed_mixed: "Gemischt",
    feed_solids: "Beikost eingeführt",
    bed_before_19: "Vor 19 Uhr",
    bed_19_20: "19–20 Uhr",
    bed_20_21: "20–21 Uhr",
    bed_21_22: "21–22 Uhr",
    bed_after_22: "Nach 22 Uhr",
    bed_irregular: "Kein fester Zeitplan",
    cond_reflux: "Reflux",
    cond_colic: "Koliken",
    cond_premature: "Frühgeburt",
    cond_allergy: "Lebensmittelallergie",
    cond_dermatitis: "Dermatitis",
    age_days: "Tage",
    age_month: "Monat",
    age_months: "Monate",
    age_year: "Jahr",
    age_years: "Jahre",
    age_and: "und",
    yes: "Ja",
    no: "Nein",
    per_night: "pro Nacht",
    password_too_short: "Passwort zu kurz",
    password_too_short_desc: "Das Passwort muss mindestens 6 Zeichen haben.",
    passwords_dont_match: "Passwörter stimmen nicht überein",
    passwords_dont_match_desc: "Die Bestätigung stimmt nicht überein.",
    password_changed: "Passwort geändert!",
    password_changed_desc: "Dein Passwort wurde erfolgreich aktualisiert.",
    loading: "Laden...",
    home_good_morning: "Guten Morgen",
    home_good_afternoon: "Guten Tag",
    home_good_evening: "Guten Abend",
    subscription_title: "Abonnement",
  },
};

export default translations;
