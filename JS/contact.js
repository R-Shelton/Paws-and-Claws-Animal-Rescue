/**
 * Contact form (contact.html).
 *
 * Sends the visitor's enquiry (name, email and message) through EmailJS,
 * using the template configured in the EmailJS dashboard. The form fields'
 * name attributes must match the template variables: {{name}}, {{email}}
 * and {{message}}. Who receives the email, and whether the visitor's address
 * is used as To or Reply-To, is set in the template, not here.
 *
 * Requires the EmailJS browser SDK (global `emailjs`) to be loaded first.
 */

// Identifiers from the EmailJS dashboard (https://dashboard.emailjs.com).
// The public key is designed to be exposed in client-side code.
const EMAILJS_PUBLIC_KEY = "uuG61OpVX0SRRLRKt";
const EMAILJS_SERVICE_ID = "service_t55ajpg";
const EMAILJS_TEMPLATE_ID = "template_k9ot10o";

// Minimum gap between sends from one browser. Enforced client-side only, so
// it deters accidental repeats but not a determined abuser.
const SEND_THROTTLE_MS = 10000;

// HTTP status EmailJS rejects with when the throttle above is hit.
const RATE_LIMITED_STATUS = 429;

const SENDING_TEXT = "Sending...";
const RATE_LIMITED_TEXT = "Please wait a few seconds before trying again.";
const FAILURE_TEXT = "Sorry, something went wrong. Please try again later.";

function initContactForm() {
    const form = document.getElementById("contact-form");

    if (!form) {
        console.error("Contact form not found in the DOM.");
        return;
    }

    // Named statusMessage, not message: the textarea's id is "message", and
    // element ids are also exposed as globals.
    const statusMessage = document.getElementById("contact-message");

    if (!statusMessage) {
        console.error("Contact status message not found in the DOM.");
        return;
    }

    const submitButton = form.querySelector("button[type='submit']");

    // The success copy lives in contact.html so it can be edited alongside the markup.
    const successText = statusMessage.textContent.trim();

    function showMessage(text) {
        statusMessage.textContent = text;
        statusMessage.hidden = false;
    }

    form.addEventListener("submit", async (event) => {
        const emailAddress = document.getElementById("email").value;
        const name         = document.getElementById("name").value;
        const messageContent = document.getElementById("message").value;
        // Send through EmailJS instead of the browser's page-reloading POST.
        event.preventDefault();
        submitButton.disabled = true; // Prevents double submits while in flight.
        showMessage(SENDING_TEXT);

        try {
            // Every named field in the form becomes a template variable.
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
                publicKey: EMAILJS_PUBLIC_KEY,
                limitRate: { throttle: SEND_THROTTLE_MS },
                email: emailAddress,
                name: name,
                message: messageContent,
            });
            showMessage(successText);
            form.reset();
        } catch (error) {
            console.error("Contact form submission failed:", error);
            showMessage(
                error && error.status === RATE_LIMITED_STATUS
                    ? RATE_LIMITED_TEXT
                    : FAILURE_TEXT
            );
        } finally {
            submitButton.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", initContactForm);
