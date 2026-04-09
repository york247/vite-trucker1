<script setup>
import HeaderComponent from '@/components/Headercomponent.vue';
import AppShell from '@/components/AppShell.vue';

</script>

<template>
    <main class="home-page">
        <div class="backdrop" aria-hidden="true"></div>
        <HeaderComponent />
        <section class="hero-panel">
            <AppShell title="Panell de conflictes globals">
                <p>
                    Aplicacio Vue per monitoritzar els conflictes armats al mon.
                    Els pots consultar, filtrar, editar i añadir conflictes.
                </p>
                <router-link class="go" to="/conflicts">Consultar</router-link>
            </AppShell>
        </section>
    </main>
</template>

<style scoped>
.home-page {
    position: relative;
    min-height: calc(100vh - 1.5rem);
    padding: 0 0 1rem;
    isolation: isolate;
}

.backdrop {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
        radial-gradient(circle at 18% 22%, rgba(46, 129, 238, 0.2) 0 10%, transparent 24%),
        radial-gradient(circle at 82% 14%, rgba(17, 35, 57, 0.24) 0 11%, transparent 28%),
        radial-gradient(circle at 78% 78%, rgba(31, 95, 191, 0.14) 0 12%, transparent 28%),
        linear-gradient(135deg, rgba(7, 18, 31, 0.05), rgba(7, 18, 31, 0.02)),
        linear-gradient(140deg, var(--bg-1), var(--bg-2));
}

.backdrop::before,
.backdrop::after {
    content: '';
    position: absolute;
    inset: 0;
}

.backdrop::before {
    background-image:
        linear-gradient(rgba(16, 42, 67, 0.08) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 42, 67, 0.08) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: radial-gradient(circle at center, black 45%, transparent 92%);
    opacity: 0.45;
}

.backdrop::after {
    background:
        linear-gradient(115deg, transparent 0 42%, rgba(255, 255, 255, 0.1) 42% 44%, transparent 44% 100%),
        linear-gradient(300deg, transparent 0 58%, rgba(46, 129, 238, 0.08) 58% 61%, transparent 61% 100%);
    mix-blend-mode: multiply;
    opacity: 0.75;
}

.hero-panel {
    position: relative;
    padding-top: 0.25rem;
}

p {
    margin: 0;
    color: #1f3a52;
}

.go {
    display: inline-block;
    width: fit-content;
    text-decoration: none;
    background: #2e81ee;
    color: #fff;
    font-weight: 700;
    border-radius: 12px;
    padding: 0.65rem 0.9rem;
    box-shadow: 0 10px 24px rgba(46, 129, 238, 0.22);
}

.go:hover {
    transform: translateY(-1px);
}

@media (max-width: 760px) {
    .home-page {
        min-height: calc(100vh - 1rem);
    }

    .backdrop::before {
        background-size: 54px 54px;
        opacity: 0.32;
    }
}
</style>