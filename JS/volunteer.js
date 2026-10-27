/**
 * Volunteer sign-up form (index.html).
 *
 * Sends the visitor's email address to EmailJS, which emails them the
 * volunteer information using the template configured in the EmailJS
 * dashboard. The template's "To email" must be {{email}} to match the
 * form field's name attribute.
 *
 * Requires the EmailJS browser SDK (global `emailjs`) to be loaded first.
 */

// Identifiers from the EmailJS dashboard (https://dashboard.emailjs.com).
// The public key is designed to be exposed in client-side code.
const EMAILJS_PUBLIC_KEY = "uuG61OpVX0SRRLRKt";
const EMAILJS_SERVICE_ID = "service_t55ajpg";
const EMAILJS_TEMPLATE_ID = "template_tsxd0nm";

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
    const message = document.getElementById("contact-message");
    if (!form || !message) {
        return;
    }

    const submitButton = form.querySelector("button[type='submit']");
    // The success copy lives in index.html so it can be edited alongside the markup.
    const successText = message.textContent.trim();

    function showMessage(text) {
        message.textContent = text;
        message.hidden = false;
    }

    form.addEventListener("submit", async (event) => {
        const emailAddress = document.getElementById("volunteer-email").value;
        // Send through EmailJS instead of the browser's page-reloading GET.
        event.preventDefault();
        submitButton.disabled = true; // Prevents double submits while in flight.
        showMessage(SENDING_TEXT);

        try {
            // Every named field in the form becomes a template variable.
            await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, {
                publicKey: EMAILJS_PUBLIC_KEY,
                limitRate: { throttle: SEND_THROTTLE_MS },
                email: emailAddress,
            });
            showMessage(successText);
            form.reset();
        } catch (error) {
            console.error("Volunteer sign-up failed:", error);
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

document.addEventListener("DOMContentLoaded", initVolunteerForm);
