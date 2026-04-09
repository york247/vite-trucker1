<template>
    <header class="header">
        <h1>Monitor de Conflictes globals</h1>
        <nav>
            <ul class="nav-list">
                <li>
                    <router-link class="link" to="/">Home</router-link>
                </li>
                <li>
                    <router-link class="link" to="/conflicts">Conflicts</router-link>
                </li>
            </ul>
        </nav>
    </header>
</template>

<style scoped>
.header {
    margin-bottom: 1rem;
}

h1 {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    margin: 0 0 0.75rem;
    color: #123456;
}

.nav-list {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    list-style: none;
    margin: 0;
    padding: 0.3rem;
    border-radius: 999px;
    background: #0f2940;
}

.link {
    color: #fff;
    text-decoration: none;
    padding: 0.5rem 0.9rem;
    border-radius: 999px;
}

.link.router-link-active {
    background: var(--accent);
}

@media (max-width: 640px) {
    h1 {
        font-size: clamp(1.55rem, 7vw, 2rem);
        margin-bottom: 0.6rem;
    }

    .nav-list {
        width: 100%;
        justify-content: space-between;
        border-radius: 16px;
    }

    .link {
        flex: 1 1 0;
        text-align: center;
        padding: 0.6rem 0.75rem;
    }
}
</style>