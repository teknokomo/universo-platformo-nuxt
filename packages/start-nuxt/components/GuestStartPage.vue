<script setup lang="ts">
/**
 * GuestStartPage - Landing page for non-authenticated users
 *
 * Displays:
 * - AppBar with login button
 * - Hero section with title and "To the future" button (centered)
 * - Testimonials section (4 product cards)
 * - Footer with contact information
 */
</script>

<template>
    <div class="guest-page">
        <!-- Background gradient overlay -->
        <div class="guest-page-overlay" />

        <!-- Navigation bar -->
        <AppBar />

        <!-- Main content -->
        <div class="guest-page-content">
            <!-- Hero: takes available space, content centered -->
            <div class="guest-page-hero">
                <Hero />
            </div>

            <!-- Testimonials: fixed to bottom area -->
            <div class="guest-page-testimonials">
                <Testimonials />
            </div>

            <!-- Footer -->
            <div class="guest-page-footer">
                <StartFooter variant="guest" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.guest-page {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-image: url('/background-image.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.guest-page-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(210, 230, 255, 0.7), transparent);
    pointer-events: none;
    z-index: 0;
}

.guest-page-content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.guest-page-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.guest-page-testimonials {
    flex-shrink: 0;
}

.guest-page-footer {
    flex-shrink: 0;
}
</style>
